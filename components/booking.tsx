'use client'

import React from 'react'
import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Loader2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ArrowRight,
  X,
  XCircle
} from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { Workspace, normalizeWorkspace } from "@/types/workspace"

type BookingStep = 'space' | 'dates' | 'contact' | 'confirmation'
type DurationUnit = "day" | "week" | "month"

type AvailabilityInfo = {
  workspace: string
  remaining: number
  inventory: number
  booked: number
  lead_time?: string
  requested_start?: string
  requested_end?: string
  is_available?: boolean
}

export default function Booking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('space')
  const [spaces, setSpaces] = useState<Workspace[]>([])
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [duration, setDuration] = useState<DurationUnit>("day")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true)
  const [spaceQuery, setSpaceQuery] = useState("")
  const [showSpaceSuggestions, setShowSpaceSuggestions] = useState(false)
  const [availabilityInfo, setAvailabilityInfo] = useState<AvailabilityInfo | null>(null)
  const [availabilityState, setAvailabilityState] = useState<"idle" | "loading" | "error">("idle")
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)
  const [showOccupiedConfirm, setShowOccupiedConfirm] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const isSingleDay = duration === "day"
  const selectedSpace = useMemo(() => spaces.find(space => space.id === selectedSpaceId) ?? null, [spaces, selectedSpaceId])

  // Fetch available spaces
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/workspaces?status=active`)
        if (!res.ok) throw new Error("Failed to fetch workspaces")
        const data = await res.json()
        if (!Array.isArray(data)) return
        setSpaces(data.map(normalizeWorkspace))
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoadingSpaces(false)
      }
    }
    fetchSpaces()
  }, [])

  // Update search query when space is selected
  useEffect(() => { 
    if (selectedSpace) setSpaceQuery(selectedSpace.name) 
  }, [selectedSpace])

  // Reset times when changing duration
  useEffect(() => { 
    if (isSingleDay) setEndDate(""); 
    else { 
      setStartTime(""); 
      setEndTime(""); 
    } 
  }, [isSingleDay])

  // Fetch availability with debounce
  useEffect(() => {
    if (!selectedSpace || !startDate) {
      setAvailabilityInfo(null)
      setAvailabilityState("idle")
      setAvailabilityError(null)
      return
    }
    
    const controller = new AbortController()
    const fetchAvailability = async () => {
      setAvailabilityState("loading")
      setAvailabilityError(null)
      try {
        const params = new URLSearchParams({ 
          workspace_id: String(selectedSpace.id), 
          start_date: startDate 
        })
        if (!isSingleDay && endDate) params.append("end_date", endDate)
        
        const res = await fetch(`${API_BASE_URL}/workspaces/availability?${params.toString()}`, { 
          signal: controller.signal 
        })
        
        if (!res.ok) throw new Error("Unable to check availability")
        
        const data = await res.json()
        
        // Ensure we have all required fields
        setAvailabilityInfo({
          workspace: data.workspace || selectedSpace.name,
          remaining: data.remaining || 0,
          inventory: data.inventory || 1,
          booked: data.booked || 0,
          lead_time: data.lead_time,
          requested_start: data.requested_start || startDate,
          requested_end: data.requested_end || (isSingleDay ? startDate : endDate),
          is_available: data.is_available || data.remaining > 0
        })
        setAvailabilityState("idle")
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Availability fetch error:", err)
          setAvailabilityInfo(null)
          setAvailabilityState("error")
          setAvailabilityError((err as Error).message)
        }
      }
    }
    
    // Debounce to avoid too many requests
    const debounceTimer = setTimeout(fetchAvailability, 300)
    return () => {
      controller.abort()
      clearTimeout(debounceTimer)
    }
  }, [selectedSpace?.id, startDate, endDate, isSingleDay])

  // Filter space suggestions
  const filteredSpaceSuggestions = useMemo(() => {
    const source = spaces
    if (!spaceQuery.trim()) return source.slice(0, 8)
    const q = spaceQuery.toLowerCase()
    return source.filter(space =>
      space.name.toLowerCase().includes(q) ||
      (space.locationName?.toLowerCase().includes(q) ?? false) ||
      (space.category?.toLowerCase().includes(q) ?? false)
    ).slice(0, 8)
  }, [spaces, spaceQuery])

  // Calculate per day rate
  const derivePerDayRate = (space?: Workspace) => {
    if (!space) return 0
    if (space.priceDay) return space.priceDay
    if (space.priceHour) return space.priceHour * 8
    if (space.priceMonth) return space.priceMonth / 22
    return 0
  }

  // Calculate total price
  const calculatePrice = () => {
    if (!selectedSpace) return 0
    const perDayRate = derivePerDayRate(selectedSpace)
    const perWeekRate = perDayRate * 5
    const perMonthRate = selectedSpace.priceMonth ?? perDayRate * 22

    if (isSingleDay) return Math.round(perDayRate)
    if (!startDate || !endDate) return Math.round(duration === "week" ? perWeekRate : perMonthRate)

    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000*60*60*24)) + 1)
    let total = perDayRate * days
    if (duration === "week") total = Math.max(total, perWeekRate)
    if (duration === "month") total = Math.max(total, perMonthRate * Math.max(1, Math.round(days/30)))
    return Math.round(total)
  }

  // Submit booking to backend
  const submitBooking = async () => {
    const totalPrice = calculatePrice()
    setBookingMessage(null)
    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: name,
          email,
          phone,
          workspace_id: selectedSpace?.id,
          space: selectedSpace?.name,
          start_date: startDate,
          end_date: isSingleDay ? startDate : endDate,
          start_time: isSingleDay ? startTime : null,
          end_time: isSingleDay ? endTime : null,
          duration_unit: duration,
          total_price: totalPrice,
          payment_status: "manual",
          source: "website",
          addons: [],
        })
      })
      
      const data = await res.json()
      console.log("Booking response:", data)

      if (!res.ok) { 
        setBookingMessage({ 
          type: "error", 
          text: data.message || `Booking failed with status ${res.status}` 
        }); 
        setIsSubmitting(false); 
        return 
      }

      setBookingMessage({ 
        type: "success", 
        text: `Booking submitted for ${selectedSpace?.name}. Total: Br ${totalPrice}.` 
      })
      setIsSubmitting(false)
      setCurrentStep('confirmation')
    } catch (err) {
      console.error("Booking fetch error:", err)
      setBookingMessage({ type: "error", text: "Server error" })
      setIsSubmitting(false)
    }
  }

  // Handle booking with availability check
  const handleBooking = async () => {
    console.log("handleBooking called - step:", currentStep)
    console.log("Form data:", {
      name, email, phone, 
      startDate, endDate, startTime, endTime,
      duration, selectedSpaceId, selectedSpace
    })

    // Basic validation
    if (!name || !email || !phone) { 
      setBookingMessage({ type: "error", text: "Please fill all contact fields" }); 
      return;
    }
    if (!startDate) { 
      setBookingMessage({ type: "error", text: "Please select a start date" }); 
      return; 
    }
    if (!isSingleDay && !endDate) { 
      setBookingMessage({ type: "error", text: "Please select an end date" }); 
      return; 
    }
    if (!selectedSpace) { 
      setBookingMessage({ type: "error", text: "Please select a workspace" }); 
      return; 
    }

    // Check availability - matches backend logic
    if (availabilityInfo && availabilityInfo.remaining === 0) { 
      setShowOccupiedConfirm(true)
      return; 
    }

    // If availability check is still loading
    if (availabilityState === "loading") {
      setBookingMessage({ 
        type: "error", 
        text: "Please wait while we check availability..." 
      })
      return
    }

    // If availability check failed
    if (availabilityState === "error") {
      setBookingMessage({ 
        type: "error", 
        text: "Unable to verify availability. Please try again." 
      })
      return
    }

    // If no availability info yet but we have dates
    if (!availabilityInfo && startDate) {
      setBookingMessage({ 
        type: "error", 
        text: "Checking availability... Please wait a moment." 
      })
      return
    }

    // All good - submit booking
    await submitBooking()
  }

  // Steps configuration
  const steps = [
    { id: 'space', name: 'Select Space', status: currentStep === 'space' ? 'current' : (['dates', 'contact', 'confirmation'].includes(currentStep) ? 'complete' : 'upcoming') },
    { id: 'dates', name: 'Choose Dates', status: currentStep === 'dates' ? 'current' : (['contact', 'confirmation'].includes(currentStep) ? 'complete' : 'upcoming') },
    { id: 'contact', name: 'Your Details', status: currentStep === 'contact' ? 'current' : (currentStep === 'confirmation' ? 'complete' : 'upcoming') },
    { id: 'confirmation', name: 'Confirm', status: currentStep === 'confirmation' ? 'current' : 'upcoming' },
  ]

  // Navigation functions
  const nextStep = () => {
    if (currentStep === 'space') setCurrentStep('dates')
    else if (currentStep === 'dates') setCurrentStep('contact')
    else if (currentStep === 'contact') setCurrentStep('confirmation')
  }

  const prevStep = () => {
    if (currentStep === 'confirmation') setCurrentStep('contact')
    else if (currentStep === 'contact') setCurrentStep('dates')
    else if (currentStep === 'dates') setCurrentStep('space')
  }

  // Handle space selection
  const handleSpaceSelect = (space: Workspace) => {
    setSelectedSpaceId(space.id)
    setSpaceQuery(space.name)
    setShowSpaceSuggestions(false)
    setBookingMessage(null)
    nextStep()
  }

  // Handle date selection validation
  const handleDateSelect = () => {
    if (!startDate) {
      setBookingMessage({ type: "error", text: "Please select a start date" })
      return
    }
    if (!isSingleDay && !endDate) {
      setBookingMessage({ type: "error", text: "Please select an end date" })
      return
    }
    if (isSingleDay && (!startTime || !endTime)) {
      setBookingMessage({ type: "error", text: "Please select start and end times" })
      return
    }
    nextStep()
  }

  return (
    <div className="min-h-screen w-full bg-white py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Book Your Perfect Workspace</h1>
          <p className="text-center text-yellow-100 max-w-2xl mx-auto">
            Experience our premium workspace in Torhailoch, Kolfe Keranio, Addis Ababa.
            <a 
              href="https://www.google.com/maps/contrib/102030795905177538691/place/ChIJF-cCZtSHSxYRegys6vVlrKM/@9.0130609,38.7169007,1864m/data=!3m1!1e3!4m6!1m5!8m4!1e1!2s102030795905177538691!3m1!1e1?hl=en-GB&entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-200 hover:text-white underline mt-2 ml-2"
            >
              <MapPin className="h-4 w-4 mr-1" />
              View on Google Maps
            </a>
          </p>
        </div>

        {/* Progress Steps */}
        <nav aria-label="Progress" className="px-6 pt-6">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''} relative`}>
                {step.status === 'complete' ? (
                  <div className="group flex flex-col items-center">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-700">
                      <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                    <span className="mt-2 text-xs font-medium text-gray-900">{step.name}</span>
                  </div>
                ) : step.status === 'current' ? (
                  <div className="flex flex-col items-center" aria-current="step">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-yellow-700 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-700"></span>
                    </span>
                    <span className="mt-2 text-xs font-medium text-yellow-700">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex flex-col items-center">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-300">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent"></span>
                    </span>
                    <span className="mt-2 text-xs font-medium text-gray-500">{step.name}</span>
                  </div>
                )}

                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-4 right-0 h-0.5 w-full -translate-x-1/2 bg-gray-200" aria-hidden="true"></div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Booking Message Alert */}
        {bookingMessage && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${bookingMessage.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-start">
              {bookingMessage.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              )}
              <p className={`text-sm ${bookingMessage.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                {bookingMessage.text}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {/* Space Selection Step */}
            {currentStep === 'space' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Workspace</h2>
                  <p className="text-gray-600 mb-6">Choose from our premium workspaces in Bole, Addis Ababa</p>
                  
                  <div className="relative">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600" />
                      <input
                        type="text"
                        value={spaceQuery}
                        onChange={(e) => {
                          setSpaceQuery(e.target.value)
                          if (!showSpaceSuggestions) setShowSpaceSuggestions(true)
                        }}
                        onFocus={() => setShowSpaceSuggestions(true)}
                        placeholder="Search workspaces..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-500 outline-none transition-all"
                      />
                      {spaceQuery && (
                        <button 
                          onClick={() => {
                            setSpaceQuery('')
                            setSelectedSpaceId(null)
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {showSpaceSuggestions && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                        {isLoadingSpaces ? (
                          <div className="p-4 text-center text-gray-500">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            <p className="mt-1 text-sm">Loading workspaces...</p>
                          </div>
                        ) : spaces.length > 0 ? (
                          spaces.map((space) => (
                            <button
                              key={space.id}
                              onClick={() => handleSpaceSelect(space)}
                              className={`w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors flex items-center ${selectedSpaceId === space.id ? 'bg-yellow-50' : ''}`}
                            >
                              <div className="shrink-0 h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-yellow-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{space.name}</p>
                                <p className="text-xs text-gray-500">{space.locationName || 'Bole, Addis Ababa'}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p>No workspaces found</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {selectedSpace && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg"
                  >
                    <div className="flex items-start">
                      <div className="shrink-0 h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{selectedSpace.name}</h3>
                        <p className="text-sm text-gray-600">{selectedSpace.locationName || 'Bole, Addis Ababa'}</p>
                        <div className="mt-2 flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {selectedSpace.capacity ? `Up to ${selectedSpace.capacity} people` : 'Flexible capacity'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!selectedSpaceId}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white ${selectedSpaceId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors`}
                  >
                    Continue to Dates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Dates Selection Step */}
            {currentStep === 'dates' && selectedSpace && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">When would you like to book?</h2>
                  <p className="text-gray-600 mb-6">Select your preferred date and time for {selectedSpace?.name}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Booking Type
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        {(['day', 'week', 'month'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setDuration(option)}
                            className={`flex-1 py-2 px-4 text-sm font-medium ${duration === option 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'} 
                              ${option === 'day' ? 'rounded-l-md' : ''} 
                              ${option === 'month' ? 'rounded-r-md' : ''} 
                              focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="start-date"
                          min={today}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {!isSingleDay && (
                      <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            id="end-date"
                            min={startDate || today}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={!startDate}
                            className={`focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border ${!startDate ? 'bg-gray-50' : 'bg-white'} border-gray-300 rounded-md`}
                          />
                        </div>
                      </div>
                    )}

                    {isSingleDay && (
                      <>
                        <div>
                          <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="time"
                              id="start-time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="time"
                              id="end-time"
                              min={startTime}
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              disabled={!startTime}
                              className={`focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border ${!startTime ? 'bg-gray-50' : 'bg-white'} border-gray-300 rounded-md`}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Availability Status Display */}
                  {availabilityState === "loading" && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                        <span className="text-sm text-blue-700">Checking availability...</span>
                      </div>
                    </div>
                  )}

                  {availabilityState === "error" && availabilityError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Unable to check availability</p>
                          <p className="text-xs text-red-700">{availabilityError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {availabilityInfo && availabilityState === "idle" && (
                    <div className={`mt-4 p-4 rounded-lg ${availabilityInfo.remaining > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-start">
                        {availabilityInfo.remaining > 0 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium ${availabilityInfo.remaining > 0 ? 'text-green-800' : 'text-red-800'}`}>
                            {availabilityInfo.remaining > 0 ? (
                              <>
                                <span className="font-bold">{availabilityInfo.remaining}</span> of <span className="font-bold">{availabilityInfo.inventory}</span> space(s) available
                              </>
                            ) : (
                              "Fully booked for selected dates"
                            )}
                          </p>
                          {availabilityInfo.lead_time && (
                            <p className="text-sm mt-1 text-gray-700">
                              Next available: {new Date(availabilityInfo.lead_time).toLocaleDateString()}
                            </p>
                          )}
                          {availabilityInfo.remaining > 0 && availabilityInfo.remaining < availabilityInfo.inventory && (
                            <p className="text-sm mt-2 text-yellow-700 font-medium">
                              ⚠️ Only {availabilityInfo.remaining} left - book soon!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDateSelect}
                      disabled={!startDate || (!isSingleDay && !endDate) || (isSingleDay && (!startTime || !endTime))}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white ${(startDate && ((!isSingleDay && endDate) || (isSingleDay && startTime && endTime))) ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors`}
                    >
                      Continue to Contact
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Details Step */}
            {currentStep === 'contact' && selectedSpace && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Workspace</p>
                        <p className="font-medium">{selectedSpace.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {isSingleDay 
                            ? startDate 
                              ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                              : 'Not selected'
                            : startDate && endDate
                              ? `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                              : 'Select dates'}
                        </p>
                        {isSingleDay && startTime && endTime && (
                          <p className="text-sm text-gray-600">{startTime} - {endTime}</p>
                        )}
                      </div>
                      {availabilityInfo && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Availability</p>
                          <div className="flex items-center mt-1">
                            {availabilityInfo.remaining > 0 ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-green-700 font-medium">
                                  {availabilityInfo.remaining} space(s) available
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600 mr-1" />
                                <span className="text-red-700 font-medium">
                                  Fully booked - request only
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                          placeholder="+251 9XX XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={isSubmitting || !name || !email || !phone}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white ${(name && email && phone && !isSubmitting) ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                          Processing...
                        </>
                      ) : availabilityInfo?.remaining === 0 ? 'Request Booking (Space Occupied)' : 'Complete Booking'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Confirmation Step */}
            {currentStep === 'confirmation' && selectedSpace && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-8 text-center text-white">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white bg-opacity-20 mb-4">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Booking Completed Successfully!</h2>
                  <p className="text-yellow-100 text-lg">
                    Thank you for choosing our workspace. Your booking has been received and is being processed.
                  </p>
                  <p className="text-yellow-100 text-lg mt-2">
                    A confirmation email will be sent shortly to <span className="font-semibold">{email}</span> with your booking details.
                  </p>
                </div>
                
                <div className="p-8">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Our team will review your request and send a confirmation within 24 hours. For any questions, please contact us at <a href="mailto:support@workspace.com" className="font-medium underline">support@workspace.com</a>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Booking Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Workspace</p>
                          <p className="text-base font-medium text-gray-900">{selectedSpace.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Date & Time</p>
                          <p className="text-base font-medium text-gray-900">
                            {isSingleDay 
                              ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                              : `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                            {isSingleDay && startTime && endTime && (
                              <span className="block text-sm text-gray-600 mt-1">{startTime} - {endTime}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Guest</p>
                          <p className="text-base font-medium text-gray-900">{name}</p>
                          <p className="text-sm text-gray-600">{email}</p>
                          {phone && <p className="text-sm text-gray-600">{phone}</p>}
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <p className="text-base font-medium text-gray-900">Total Amount</p>
                          <p className="text-2xl font-bold text-yellow-700">Br{calculatePrice()}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Payment will be processed after booking confirmation</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <a
                      href="/"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                    >
                      Back to Home
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                  
                  <p className="mt-6 text-center text-sm text-gray-500">
                    Need to make changes? Contact us at <a href="mailto:support@workspace.com" className="font-medium text-yellow-700 hover:text-yellow-600">support@workspace.com</a>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Occupied Space Confirmation Modal */}
      {showOccupiedConfirm && availabilityInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Limited Availability</h3>
                  <p className="text-sm text-gray-600 mt-1">Based on real-time system check</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">No Available Spaces</p>
                      <div className="text-red-700 text-sm mt-1 space-y-1">
                        <p>
                          <span className="font-semibold">{selectedSpace?.name}</span> is fully booked for:
                        </p>
                        <p>• Dates: {startDate} {!isSingleDay && `to ${endDate}`}</p>
                        <p>• Already booked: {availabilityInfo.booked} space(s)</p>
                        <p>• Total capacity: {availabilityInfo.inventory} space(s)</p>
                        {availabilityInfo.lead_time && (
                          <p>• Next available: {new Date(availabilityInfo.lead_time).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  This workspace appears to be fully booked for your selected dates. 
                  You can still submit a booking request, and our team will:
                </p>
                
                <ul className="text-gray-600 text-sm mb-6 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>Check for any cancellations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>Contact you about alternative dates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span>Suggest similar available workspaces</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowOccupiedConfirm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel & Choose Different Dates
                  </button>
                  <button
                    onClick={async () => {
                      setShowOccupiedConfirm(false)
                      await submitBooking()
                    }}
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 inline mr-2" />
                        Submitting...
                      </>
                    ) : 'Submit Booking Request Anyway'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Submitting doesn't guarantee availability. You'll receive a confirmation email.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}