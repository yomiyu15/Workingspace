"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Calendar, Clock, X } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function Booking() {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [duration, setDuration] = useState("day")
  const [selectedSpace, setSelectedSpace] = useState("premium")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Handle hash change for anchor links
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#booking") {
        setIsOpen(true)
      }
    }
    
    if (window.location.hash === "#booking") {
      setIsOpen(true)
    }
    
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Close modal when escape key is pressed
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

  const spaces = {
    standard: { name: "Standard Desk", price: 1500, availability: 5 },
    premium: { name: "Premium Desk", price: 2000, availability: 2 },
    meeting: { name: "Meeting Room", price: 5000, availability: 1 },
  }

  const isSingleDay = duration === "day"

  const calculatePrice = () => {
    const spaceData = spaces[selectedSpace as keyof typeof spaces]
    const basePrice = spaceData.price

    if (isSingleDay && startDate) {
      return basePrice
    }

    if (startDate && endDate && duration === "week") {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      return Math.ceil((basePrice * days * 5) / 20)
    }

    if (startDate && endDate && duration === "month") {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      return Math.ceil((basePrice * days * 20) / 20)
    }

    return 0
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

    const totalPrice = calculatePrice()
    
    // Clear previous messages and set loading state
    setBookingMessage(null)
    setIsSubmitting(true)

    try {
      const res = await fetch(`http://localhost:5000/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: name,
          email,
          phone,
          space: selectedSpace,
          start_date: startDate,
          end_date: isSingleDay ? startDate : endDate,
          total_price: totalPrice,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        const errorMessage = errorData.message || "Booking failed"
        setBookingMessage({ type: "error", text: errorMessage })
        setIsSubmitting(false)
        return
      }

      const data = await res.json()
      setBookingMessage({
        type: "success",
        text: `Booking confirmed! ${spaces[selectedSpace as keyof typeof spaces].name} for ${
          isSingleDay ? startDate : `${startDate} to ${endDate}`
        }. Total: Br ${totalPrice}. A confirmation has been sent to ${email}.`,
      })
      setIsSubmitting(false)

      // Reset form after 4 seconds
      setTimeout(() => {
        setStartDate("")
        setEndDate("")
        setName("")
        setEmail("")
        setPhone("")
        setBookingMessage(null)
        setIsSubmitting(false)
        setIsOpen(false)
        window.history.replaceState(null, "", window.location.pathname)
      }, 4000)
    } catch (err) {
      console.error("Error creating booking:", err)
      setBookingMessage({ type: "error", text: "Server error. Please try again." })
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false)
                window.history.replaceState(null, "", window.location.pathname)
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
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
                    onClick={() => {
                      setIsOpen(false)
                      window.history.replaceState(null, "", window.location.pathname)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => {
                  setName(e.target.value);
                  setBookingMessage(null);
                }} 
                placeholder="Full name" 
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address *</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  setBookingMessage(null);
                }} 
                placeholder="your@email.com" 
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number *</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => {
                  setPhone(e.target.value);
                  setBookingMessage(null);
                }} 
                placeholder="+251 9XX XXX XXXX" 
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Select Space *</label>
              <select 
                value={selectedSpace} 
                onChange={(e) => {
                  setSelectedSpace(e.target.value);
                  setBookingMessage(null);
                }} 
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(spaces).map(([key, value]) => (
                  <option key={key} value={key}>{value.name} - Br{value.price}/day ({value.availability} available)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Duration *</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="day">Single Day</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Start Date *
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => { 
                  setStartDate(e.target.value); 
                  setBookingMessage(null);
                }} 
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            {!isSingleDay && (
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> End Date *
                </label>
                <input 
                  type="date" 
                  value={endDate} 
                  min={startDate} 
                  onChange={(e) => { 
                    setEndDate(e.target.value); 
                    setBookingMessage(null);
                  }} 
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            )}

            {isSingleDay && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Start Time
                  </label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> End Time
                  </label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </>
            )}
          </div>

          {selectedSpace && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-900">Estimated Price:</p>
                <motion.p key={calculatePrice()} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-2xl font-bold text-blue-600">Br {calculatePrice()}</motion.p>
              </div>
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
                    className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      isSubmitting || bookingMessage?.type === "success"
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : bookingMessage?.type === "success" ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Booking Confirmed!</span>
                      </>
                    ) : (
                      `Complete Booking - Br ${calculatePrice()}`
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Section Placeholder (hidden, only used for anchor link) */}
      <section id="booking" className="hidden"></section>
    </>
  )
}
