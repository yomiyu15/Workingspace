'use client'

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Calendar, Clock, Loader2 } from "lucide-react"
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

export default function Booking() {
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

  const isSingleDay = duration === "day"
  const selectedSpace = useMemo(
    () => spaces.find(space => space.id === selectedSpaceId) ?? null,
    [spaces, selectedSpaceId]
  )

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

  useEffect(() => {
    if (selectedSpace) setSpaceQuery(selectedSpace.name)
  }, [selectedSpace])

  useEffect(() => {
    if (isSingleDay) setEndDate("")
  }, [isSingleDay])

  useEffect(() => {
    if (!isSingleDay) {
      setStartTime("")
      setEndTime("")
    }
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
        const params = new URLSearchParams({ workspace_id: String(selectedSpace.id), start_date: startDate })
        if (!isSingleDay && endDate) params.append("end_date", endDate)
        const res = await fetch(`${API_BASE_URL}/workspaces/availability?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error("Unable to check availability")
        setAvailabilityInfo(await res.json() as AvailabilityInfo)
        setAvailabilityState("idle")
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setAvailabilityInfo(null)
          setAvailabilityState("error")
          setAvailabilityError((err as Error).message)
        }
      }
    }
    fetchAvailability()
    return () => controller.abort()
  }, [selectedSpace?.id, startDate, endDate, isSingleDay])

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

  const handleSpaceSelect = (space: Workspace) => {
    setSelectedSpaceId(space.id)
    setSpaceQuery(space.name)
    setShowSpaceSuggestions(false)
    setBookingMessage(null)
  }

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
    if (!startDate || !endDate) return Math.round(duration === "week" ? perWeekRate : perMonthRate)

    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000*60*60*24)) + 1)
    let total = perDayRate * days
    if (duration === "week") total = Math.max(total, perWeekRate)
    if (duration === "month") total = Math.max(total, perMonthRate * Math.max(1, Math.round(days/30)))
    return Math.round(total)
  }

  const handleBooking = async () => {
    if (!name || !email || !phone) { setBookingMessage({ type: "error", text: "Fill all fields" }); return }
    if (!startDate) { setBookingMessage({ type: "error", text: "Select start date" }); return }
    if (!isSingleDay && !endDate) { setBookingMessage({ type: "error", text: "Select end date" }); return }
    if (!selectedSpace) { setBookingMessage({ type: "error", text: "Select workspace" }); return }
    if (availabilityInfo && availabilityInfo.remaining === 0) { setBookingMessage({ type: "error", text: "Fully booked" }); return }

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
      if (!res.ok) { setBookingMessage({ type: "error", text: data.message || "Booking failed" }); setIsSubmitting(false); return }

      setBookingMessage({ type: "success", text: `Booking submitted for ${selectedSpace.name}. Total: Br ${totalPrice}.` })
      setIsSubmitting(false)
      setStartDate(""); setEndDate(""); setStartTime(""); setEndTime(""); setName(""); setEmail(""); setPhone(""); setSelectedSpaceId(null); setSpaceQuery("")
    } catch (err) {
      console.error(err)
      setBookingMessage({ type: "error", text: "Server error" })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Book Your Workspace</h2>
        <p className="text-center text-gray-600 mb-10">Choose your location, preferred date, and contact details. Our team will confirm your tour within 24 hours.</p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[{ label: "Full Name *", value: name, setter: setName, type: "text", placeholder: "John Doe" },
            { label: "Email *", value: email, setter: setEmail, type: "email", placeholder: "you@example.com" },
            { label: "Phone *", value: phone, setter: setPhone, type: "tel", placeholder: "+251 9XX XXX XXX" }
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block font-medium text-gray-700 mb-2">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => { field.setter(e.target.value); setBookingMessage(null) }}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <label className="block font-medium text-gray-700 mb-2">Select Space *</label>
            <input
              type="text"
              value={spaceQuery}
              onChange={(e) => { setSpaceQuery(e.target.value); setShowSpaceSuggestions(true) }}
              onFocus={() => setShowSpaceSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSpaceSuggestions(false), 100)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isLoadingSpaces ? "Loading..." : "Search space"}
            />
            {showSpaceSuggestions && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSpaceSuggestions.length === 0 ? (
                  <p className="px-4 py-3 text-gray-500">No spaces found</p>
                ) : filteredSpaceSuggestions.map(space => (
                  <button
                    key={space.id}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSpaceSelect(space)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="font-medium">{space.name}</div>
                    <div className="text-xs text-gray-500">{space.locationName} · {space.category}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Duration *</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as DurationUnit)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Single Day</option>
              <option value="week">Multi-Day</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Start Date *</label>
            <input type="date" min={new Date().toISOString().split("T")[0]} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          {!isSingleDay && (
            <div>
              <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> End Date *</label>
              <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          )}

          {isSingleDay && (
            <>
              <div>
                <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Start Time *</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> End Time *</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </>
          )}
        </div>

        {/* Availability & Price */}
        {selectedSpace && startDate && (
          <div className="p-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg">
            {availabilityState === "loading" && <p className="text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Checking availability...</p>}
            {availabilityState === "error" && <p className="text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {availabilityError}</p>}
            {availabilityState === "idle" && availabilityInfo && <p className={availabilityInfo.remaining>0 ? "text-green-600" : "text-red-600"}>{availabilityInfo.remaining>0 ? `${availabilityInfo.remaining} spots left` : "Fully booked"}</p>}
            <p className="text-sm text-gray-500 mt-2">Estimated Price: Br {calculatePrice()}</p>
          </div>
        )}

        {/* Booking Button */}
        <motion.button
          onClick={handleBooking}
          disabled={isSubmitting || bookingMessage?.type==="success"}
          whileHover={{ scale: isSubmitting || bookingMessage?.type==="success"?1:1.02 }}
          whileTap={{ scale: isSubmitting || bookingMessage?.type==="success"?1:0.98 }}
          className={`w-full py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isSubmitting || bookingMessage?.type==="success"?"bg-gray-400 text-white cursor-not-allowed":"bg-red-600 hover:bg-red-500 text-white shadow-lg"}`}
        >
          {isSubmitting ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Processing...</> :
           bookingMessage?.type==="success" ? <><CheckCircle2 className="w-5 h-5"/> Booking Submitted!</> :
           `Complete Booking - Br ${calculatePrice()}`}
        </motion.button>

        {/* Booking Message */}
        {bookingMessage && <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className={`mt-6 p-4 rounded-lg ${bookingMessage.type==="success"?"bg-green-50 border border-green-200":"bg-red-50 border border-red-200"} flex items-start gap-3`}>
          {bookingMessage.type==="success" ? <>
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5"/> <p className="text-green-900 font-semibold text-sm">{bookingMessage.text}</p>
          </> : <>
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5"/> <p className="text-red-900 font-semibold text-sm">{bookingMessage.text}</p>
          </>}
        </motion.div>}

      </div>
    </div>
  )
}
