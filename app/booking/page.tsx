"use client"

import { useEffect, useMemo, useState, useRef } from "react"
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
  Home,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { API_BASE_URL } from "@/lib/config"
import { type Workspace, normalizeWorkspace } from "@/types/workspace"

type BookingStep = "space" | "dates" | "contact" | "confirmation"
type DurationUnit = "day" | "week" | "month"

export default function Booking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("space")
  const [spaces, setSpaces] = useState<Workspace[]>([])
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("day")
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

  const containerRef = useRef<HTMLDivElement>(null)
  const today = new Date().toISOString().split("T")[0]
  const isSingleDay = durationUnit === "day"

  const selectedSpace = useMemo(
    () => spaces.find((s) => s.id === selectedSpaceId) ?? null,
    [spaces, selectedSpaceId]
  )

  // Fetch workspaces
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/workspaces?status=active`)
        if (!res.ok) throw new Error("Failed to fetch workspaces")
        const data = await res.json()
        setSpaces(Array.isArray(data) ? data.map(normalizeWorkspace) : [])
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setIsLoadingSpaces(false)
      }
    }
    fetchSpaces()
  }, [])

  useEffect(() => {
    if (isSingleDay) setEndDate("")
  }, [isSingleDay])

  const submitBooking = async () => {
    setBookingMessage(null)
    setIsSubmitting(true)

    try {
      const payload = {
        user_name: name,
        email: email,
        phone: phone,
        workspace_id: selectedSpace?.id,
        start_date: startDate,
        end_date: isSingleDay ? startDate : endDate,
        start_time: isSingleDay ? (startTime || null) : null,
        end_time: isSingleDay ? (endTime || null) : null,
        duration_unit: durationUnit,
        payment_status: "manual",
        source: "website",
        addons: [], 
        notes: `Customer booking via website for ${durationUnit} duration.`
      }

      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create booking")

      setBookingMessage({ type: "success", text: "Booking submitted successfully!" })
      setCurrentStep("confirmation")
    } catch (err: any) {
      setBookingMessage({ type: "error", text: err.message || "Server error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" })
    if (currentStep === "space") setCurrentStep("dates")
    else if (currentStep === "dates") setCurrentStep("contact")
  }

  const prevStep = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" })
    if (currentStep === "contact") setCurrentStep("dates")
    else if (currentStep === "dates") setCurrentStep("space")
  }

  const filteredSpaces = useMemo(() => {
    if (!spaceQuery.trim()) return spaces.slice(0, 8)
    return spaces.filter(s => s.name.toLowerCase().includes(spaceQuery.toLowerCase())).slice(0, 8)
  }, [spaces, spaceQuery])

  const isSelectedSpaceUnavailable = !!selectedSpace && (selectedSpace.inventoryCount ?? 1) <= 0

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={containerRef}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20 w-full">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
          <h1 className="font-bold text-xl md:text-2xl text-foreground">Workspace Booking</h1>
          <div className="w-10" />
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between mb-10">
          {["Space", "Dates", "Details"].map((step, i) => (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white 
                ${i <= (currentStep === "space" ? 0 : currentStep === "dates" ? 1 : 2) ? "border-primary text-primary" : "border-slate-300 text-slate-300"}`}>
                {i + 1}
              </div>
              <span className="text-xs mt-2 font-medium">{step}</span>
            </div>
          ))}
        </div>

        {bookingMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${bookingMessage.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
            {bookingMessage.type === "error" ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            <p className="text-sm font-medium">{bookingMessage.text}</p>
          </div>
        )}

        <div className="bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-10">
          {/* STEP 1: SPACE */}
          {currentStep === "space" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Find a space</h2>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Which workspace are you looking for?"
                  className="w-full pl-12 pr-4 py-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary"
                  value={spaceQuery}
                  onChange={(e) => { setSpaceQuery(e.target.value); setShowSpaceSuggestions(true); }}
                  onFocus={() => setShowSpaceSuggestions(true)}
                />
                {showSpaceSuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden">
                    {isLoadingSpaces ? <div className="p-4 text-center"><Loader2 className="animate-spin h-5 w-5 mx-auto" /></div> :
                      filteredSpaces.map(s => {
                        const available = (s.inventoryCount ?? 1) > 0
                        return (
                          <button
                            key={s.id}
                            onClick={() => { setSelectedSpaceId(s.id); setSpaceQuery(s.name); setShowSpaceSuggestions(false); }}
                            disabled={!available}
                            className={`w-full text-left px-6 py-4 flex flex-col border-b last:border-none border-border/60 transition ${
                              available ? "hover:bg-muted" : "opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold">{s.name}</span>
                              <div className="flex items-center gap-2">
                                {s.priceDay && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{s.priceDay} Br/day</span>}
                                {!available && <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">Booked</span>}
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">{s.locationName}</span>
                          </button>
                        )
                      })
                    }
                  </div>
                )}
              </div>
              {isSelectedSpaceUnavailable && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                  This space is currently fully booked. Please select another space or contact support.
                </div>
              )}
              <button disabled={!selectedSpaceId || isSelectedSpaceUnavailable} onClick={nextStep} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold disabled:opacity-50">
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: DATES */}
          {currentStep === "dates" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Choose timing</h2>
              <div className="flex bg-muted p-1 rounded-2xl">
                {(["day", "week", "month"] as const).map((u) => (
                  <button key={u} onClick={() => setDurationUnit(u)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${durationUnit === u ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1 text-foreground">Start Date</label>
                  <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-4 bg-muted rounded-2xl border-none" />
                </div>
                {!isSingleDay && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 text-foreground">End Date</label>
                    <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-4 bg-muted rounded-2xl border-none" />
                  </div>
                )}
              </div>
              {isSingleDay && (
                <div className="grid grid-cols-2 gap-4">
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-4 bg-muted rounded-2xl border-none" />
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-4 bg-muted rounded-2xl border-none" />
                </div>
              )}
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 border-2 border-border rounded-2xl font-bold">Back</button>
                <button disabled={!startDate || (!isSingleDay && !endDate)} onClick={nextStep} className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-bold">Next</button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT & PRICING REVIEW */}
          {currentStep === "contact" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Review your request</h2>
              
              {/* Dynamic Pricing Table */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Hourly", price: selectedSpace?.priceHour },
                  { label: "Daily", price: selectedSpace?.priceDay },
                  { label: "Monthly", price: selectedSpace?.priceMonth },
                ].map((tier) => (
                  <div key={tier.label} className={`p-3 rounded-2xl border ${durationUnit === tier.label.toLowerCase().slice(0,3) ? 'border-primary bg-primary/5' : 'border-border bg-card'} text-center`}>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{tier.label}</p>
                    <p className="text-sm font-bold text-foreground">{tier.price ? `${tier.price} Br` : 'N/A'}</p>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-6 rounded-2xl space-y-2 mb-6">
                <p className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Space:</span>
                  <b className="text-foreground">{selectedSpace?.name}</b>
                </p>
                <p className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Selected Duration:</span>
                  <b className="text-foreground capitalize">{durationUnit}</b>
                </p>
                <p className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dates:</span>
                  <b className="text-foreground">
                    {startDate} {endDate ? `to ${endDate}` : ""}
                  </b>
                </p>
                <div className="pt-3 mt-3 border-t border-border/50 flex justify-between items-center">
                   <span className="text-xs font-bold text-primary flex items-center gap-1">
                     <Tag className="w-3 h-3" /> Base Rate:
                   </span>
                   <span className="text-lg font-black text-foreground">
                      {durationUnit === 'day' ? selectedSpace?.priceDay : durationUnit === 'month' ? selectedSpace?.priceMonth : 'Custom'} Br
                   </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                   <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                   <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 p-4 bg-muted rounded-2xl border-none" />
                </div>
                <div className="relative">
                   <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                   <input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 p-4 bg-muted rounded-2xl border-none" />
                </div>
                <div className="relative">
                   <Phone className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                   <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 p-4 bg-muted rounded-2xl border-none" />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 border-2 border-border rounded-2xl font-bold">Back</button>
                <button disabled={isSubmitting || !name || !email} onClick={submitBooking} className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Booking"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {currentStep === "confirmation" && (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Booking Request Sent!</h2>
              <p className="text-muted-foreground">
                Your reservation for {selectedSpace?.name} is pending review. We’ll email you with availability and pricing
                details shortly.
              </p>
              <Link
                href="/"
                className="inline-block px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold"
              >
                Return Home
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}