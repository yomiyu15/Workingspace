"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Calendar, Clock, Loader2, MapPin, X } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { Workspace, normalizeWorkspace } from "@/types/workspace"

type DurationUnit = "day" | "week" | "month"

type AvailabilityInfo = {
  workspace: string
  remaining: number
  lead_time?: string
  requested_start?: string
  requested_end?: string
}

export function Booking() {
  const [isOpen, setIsOpen] = useState(false)
  const [spaces, setSpaces] = useState<Workspace[]>([])
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [duration, setDuration] = useState<DurationUnit>("day")
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

  const isSingleDay = duration === "day"
  const selectedSpace = useMemo(
    () => spaces.find((space) => space.id === selectedSpaceId) ?? null,
    [spaces, selectedSpaceId],
  )

  const availableSpaces = spaces

  useEffect(() => {
    if (selectedSpace) {
      setSpaceQuery(selectedSpace.name)
    }
  }, [selectedSpace])

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/workspaces?status=active`)
        if (!res.ok) throw new Error("Failed to fetch workspaces")
        const data = await res.json()
        if (!Array.isArray(data)) return
        const normalized = data.map((space) => normalizeWorkspace(space))
        setSpaces(normalized)
      } catch (error) {
        console.error("Failed to load workspaces:", error)
      } finally {
        setIsLoadingSpaces(false)
      }
    }
    fetchSpaces()
  }, [])

  const filteredSpaceSuggestions = useMemo(() => {
    const source = availableSpaces
    if (!spaceQuery.trim()) return source.slice(0, 8)
    const query = spaceQuery.toLowerCase()
    return source
      .filter((space) => {
        return (
          space.name.toLowerCase().includes(query) ||
          (space.locationName?.toLowerCase().includes(query) ?? false) ||
          (space.category?.toLowerCase().includes(query) ?? false)
        )
      })
      .slice(0, 8)
  }, [availableSpaces, spaceQuery])

  const handleSpaceSelect = (space: Workspace) => {
    setSelectedSpaceId(space.id)
    setSpaceQuery(space.name)
    setShowSpaceSuggestions(false)
    setBookingMessage(null)
  }

  const handleSpaceInputBlur = () => {
    // delay to allow click on suggestion before closing
    setTimeout(() => setShowSpaceSuggestions(false), 120)
  }

  // Open modal on hash #booking
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#booking") setIsOpen(true)
    }
    if (window.location.hash === "#booking") setIsOpen(true)
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        window.history.replaceState(null, "", window.location.pathname)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  useEffect(() => {
    if (isSingleDay) setEndDate("")
  }, [isSingleDay])

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
          start_date: startDate,
        })
        if (!isSingleDay && endDate) {
          params.append("end_date", endDate)
        }
        const res = await fetch(`${API_BASE_URL}/workspaces/availability?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error("Unable to check availability right now")
        const data = (await res.json()) as AvailabilityInfo
        setAvailabilityInfo(data)
        setAvailabilityState("idle")
      } catch (error) {
        if ((error as Error).name === "AbortError") return
        setAvailabilityInfo(null)
        setAvailabilityState("error")
        setAvailabilityError((error as Error).message)
      }
    }

    fetchAvailability()
    return () => controller.abort()
  }, [selectedSpace?.id, startDate, endDate, isSingleDay])

  const derivePerDayRate = (space?: Workspace) => {
    if (!space) return 0
    if (space.priceDay) return space.priceDay
    if (space.priceHour) return space.priceHour * 8
    if (space.priceMonth) return space.priceMonth / 22
    return 0
  }

  const calculatePrice = () => {
    if (!selectedSpace) return 0

    const perDayRate = derivePerDayRate(selectedSpace)
    const perWeekRate = perDayRate * 5
    const perMonthRate = selectedSpace.priceMonth ?? perDayRate * 22

    if (isSingleDay) return Math.round(perDayRate)

    if (!startDate || !endDate) {
      return Math.round(duration === "week" ? perWeekRate : perMonthRate)
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)

    let total = perDayRate * days

    if (duration === "week") total = Math.max(total, perWeekRate)

    if (duration === "month") {
      const months = Math.max(1, Math.round(days / 30))
      total = Math.max(total, perMonthRate * months)
    }

    return Math.round(total)
  }

const handleBooking = async () => {
  if (!name || !email || !phone) {
    setBookingMessage({ type: "error", text: "Please fill in all fields" })
    return
  }
  if (!startDate) {
    setBookingMessage({ type: "error", text: "Please select a start date" })
    return
  }
  if (!isSingleDay && !endDate) {
    setBookingMessage({ type: "error", text: "Please select an end date for multi-day bookings" })
    return
  }
  if (!selectedSpace) {
    setBookingMessage({ type: "error", text: "Please select a workspace" })
    return
  }
  if (availabilityInfo && availabilityInfo.remaining === 0) {
    setBookingMessage({ type: "error", text: "This workspace is fully booked for the selected dates" })
    return
  }

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
        workspace_id: selectedSpace.id,
        space: selectedSpace.name,
        start_date: startDate,
        end_date: isSingleDay ? startDate : endDate,
        duration_unit: duration,
        total_price: totalPrice,
        payment_status: "manual",
        source: "website",
        addons: [],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setBookingMessage({ type: "error", text: data.message || "Booking failed" })
      setIsSubmitting(false)
      return
    }

    // Show success message
    setBookingMessage({
      type: "success",
      text: `Booking submitted! ${selectedSpace.name} for ${isSingleDay ? startDate : `${startDate} to ${endDate}`} (manual payment). Total: Br ${totalPrice}. You’ll receive a confirmation email after verification.`,
    })
    setIsSubmitting(false)

    // Reset form fields, but keep modal and success message
    setStartDate("")
    setEndDate("")
    setName("")
    setEmail("")
    setPhone("")
    setSelectedSpaceId(null)
    setSpaceQuery("")

  } catch (err) {
    console.error(err)
    setBookingMessage({ type: "error", text: "Server error. Please try again." })
    setIsSubmitting(false)
  }
}


  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsOpen(false); window.history.replaceState(null, "", window.location.pathname) }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Book Your Workspace</h2>
                  <p className="text-sm text-gray-600 mt-1">Reserve your space in seconds</p>
                </div>
                <button
                  onClick={() => { setIsOpen(false); window.history.replaceState(null, "", window.location.pathname) }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Your Name *", value: name, setter: setName, type: "text", placeholder: "Full name" },
                    { label: "Email Address *", value: email, setter: setEmail, type: "email", placeholder: "your@email.com" },
                    { label: "Phone Number *", value: phone, setter: setPhone, type: "tel", placeholder: "+251 9XX XXX XXXX" }
                  ].map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-semibold mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => { field.setter(e.target.value); setBookingMessage(null) }}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-3">Select Space *</label>
                    <input
                      type="text"
                      value={spaceQuery}
                      onChange={(e) => { setSpaceQuery(e.target.value); setShowSpaceSuggestions(true) }}
                      onFocus={() => setShowSpaceSuggestions(true)}
                      onBlur={handleSpaceInputBlur}
                      placeholder={
                        isLoadingSpaces
                          ? "Loading spaces..."
                          : availableSpaces.length === 0
                            ? "No spaces available yet"
                            : "Search by name, city, or category"
                      }
                      disabled={isLoadingSpaces || availableSpaces.length === 0}
                      autoComplete="off"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {showSpaceSuggestions && (
                      <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                        {filteredSpaceSuggestions.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-slate-500">
                            {availableSpaces.length === 0
                              ? "No spaces available yet."
                              : `No spaces match “${spaceQuery}”.`}
                          </p>
                        ) : (
                          filteredSpaceSuggestions.map((space) => (
                            <button
                              key={space.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSpaceSelect(space)}
                              className="flex w-full flex-col items-start gap-1 px-4 py-2 text-left hover:bg-slate-50"
                            >
                              <span className="text-sm font-semibold text-slate-900">{space.name}</span>
                              <span className="text-xs text-slate-500">
                                {space.locationName || "WorkSpace Hub"} · {space.category} ·{" "}
                                {space.capacity ? `up to ${space.capacity} ppl` : "flex capacity"}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    {selectedSpace && (
                      <p className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {selectedSpace.locationName || "WorkSpace Hub"} · {selectedSpace.leadTime || "Instant confirmation"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Duration *</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as DurationUnit)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="day">Single Day</option>
                      <option value="week">Multi-day</option>
                      <option value="month">Monthly stay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Start Date *
                    </label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(e) => { setStartDate(e.target.value); setBookingMessage(null) }} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {!isSingleDay && (
                    <div>
                      <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> End Date *
                      </label>
                      <input type="date" min={startDate} value={endDate} onChange={(e) => { setEndDate(e.target.value); setBookingMessage(null) }} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  )}
                </div>

                {selectedSpace && startDate && (
                  <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    {availabilityState === "loading" && (
                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking live availability for your dates...
                      </p>
                    )}
                    {availabilityState === "error" && (
                      <p className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {availabilityError || "Unable to confirm availability. We will double-check after submission."}
                      </p>
                    )}
                    {availabilityState === "idle" && availabilityInfo && (
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              availabilityInfo.remaining > 0 ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {availabilityInfo.remaining > 0
                              ? `${availabilityInfo.remaining} ${
                                  availabilityInfo.remaining === 1 ? "spot" : "spots"
                                } left in ${selectedSpace.name}`
                              : "Fully booked for the selected dates"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(availabilityInfo.requested_start || startDate).toLocaleDateString()}
                            {availabilityInfo.requested_end &&
                              availabilityInfo.requested_end !== availabilityInfo.requested_start && (
                                <>
                                  {" "}
                                  → {new Date(availabilityInfo.requested_end).toLocaleDateString()}
                                </>
                              )}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          {availabilityInfo.lead_time || selectedSpace.leadTime || "Instant confirmation"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {selectedSpace && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-slate-900">Estimated Price:</p>
                      <motion.p key={calculatePrice()} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-2xl font-bold text-blue-600">Br {calculatePrice()}</motion.p>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {selectedSpace.leadTime || "Instant confirmation"} · Manual payment after approval
                    </p>
                  </motion.div>
                )}

                {bookingMessage && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${bookingMessage.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    {bookingMessage.type === "success" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-900 font-semibold text-sm">{bookingMessage.text}</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-900 font-semibold text-sm">{bookingMessage.text}</p>
                      </>
                    )}
                  </motion.div>
                )}

                <motion.button
                  onClick={handleBooking}
                  disabled={isSubmitting || bookingMessage?.type === "success"}
                  whileHover={{ scale: isSubmitting || bookingMessage?.type === "success" ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || bookingMessage?.type === "success" ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isSubmitting || bookingMessage?.type === "success" ? "bg-gray-400 text-white cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 text-white shadow-lg"}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : bookingMessage?.type === "success" ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Booking Submitted!</span>
                    </>
                  ) : (
                    `Complete Booking - Br ${calculatePrice()}`
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="booking" className="hidden"></section>
    </>
  )
}
