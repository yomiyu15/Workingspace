"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Calendar, Clock } from 'lucide-react'

export function Booking() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [duration, setDuration] = useState("day")
  const [selectedSpace, setSelectedSpace] = useState("premium")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bookedDates, setBookedDates] = useState(["2025-11-20", "2025-11-21", "2025-11-27", "2025-11-28"])
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const spaces = {
    standard: { name: "Standard Desk", price: 150, availability: 5 },
    premium: { name: "Premium Desk", price: 200, availability: 2 },
    meeting: { name: "Meeting Room", price: 500, availability: 1 },
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

  const isDateRangeBooked = () => {
    if (!startDate) return false
    if (isSingleDay) return bookedDates.includes(startDate)
    if (!endDate) return false

    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (bookedDates.includes(d.toISOString().split("T")[0])) {
        return true
      }
    }
    return false
  }

  const handleBooking = () => {
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

    if (isDateRangeBooked()) {
      setBookingMessage({
        type: "error",
        text: "Some dates in your selected range are already booked. Please choose different dates.",
      })
      return
    }

    const totalPrice = calculatePrice()
    const dateRange = isSingleDay ? startDate : `${startDate} to ${endDate}`
    const timeInfo = isSingleDay ? ` (${startTime} - ${endTime})` : ""

    setBookingMessage({
      type: "success",
      text: `Booking confirmed! ${spaces[selectedSpace as keyof typeof spaces].name} for ${dateRange}${timeInfo}. Total: Br ${totalPrice}. A confirmation has been sent to ${email}.`,
    })

    if (isSingleDay) {
      setBookedDates([...bookedDates, startDate])
    } else {
      const newBookedDates = [...bookedDates]
      const start = new Date(startDate)
      const end = new Date(endDate)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        newBookedDates.push(d.toISOString().split("T")[0])
      }
      setBookedDates(newBookedDates)
    }

    setStartDate("")
    setEndDate("")
    setName("")
    setEmail("")
    setPhone("")
  }

  return (
    <section id="booking" className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">Book Your Workspace Today</h2>
          <p className="text-center text-muted-foreground mb-12">
            Simple and fast booking. Check real-time availability and reserve your space in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg border border-border p-8 shadow-lg"
        >
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-semibold mb-2">Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 9XX XXX XXXX"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Space Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Select Space *</label>
              <select
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(spaces).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} - Br{value.price}/day ({value.availability} available)
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Duration *</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Single Day</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setBookingMessage(null)
                }}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date (for multi-day) */}
            {!isSingleDay && (
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setBookingMessage(null)
                  }}
                  min={startDate}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Time Selection (for single day) */}
            {isSingleDay && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {selectedSpace && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-900">Estimated Price:</p>
                <motion.p
                  key={calculatePrice()}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-blue-600"
                >
                  Br {calculatePrice()}
                </motion.p>
              </div>
            </motion.div>
          )}

          {startDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                isDateRangeBooked() ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
              }`}
            >
              {isDateRangeBooked() ? (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Not Available</p>
                    <p className="text-red-800 text-sm">Some dates are already booked. Please select different dates.</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Available</p>
                    <p className="text-green-800 text-sm">
                      Great! Your selected dates are available for booking.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {bookingMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                bookingMessage.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
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
            disabled={isDateRangeBooked()}
            whileHover={{ scale: isDateRangeBooked() ? 1 : 1.02 }}
            whileTap={{ scale: isDateRangeBooked() ? 1 : 0.98 }}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isDateRangeBooked()
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isDateRangeBooked() ? "Dates Not Available" : `Complete Booking - Br ${calculatePrice()}`}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
