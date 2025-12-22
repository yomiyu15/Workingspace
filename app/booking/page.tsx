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
  ArrowRight,
  X,
  XCircle,
  CreditCard,
  Repeat,
  ArrowLeft,
  Home,
} from "lucide-react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/config"
import { type Workspace, normalizeWorkspace } from "@/types/workspace"

type BookingStep = "space" | "membership" | "dates" | "contact" | "confirmation"
type DurationUnit = "day" | "week" | "month"
type BookingType = "one-time" | "membership"

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
  const [bookingType, setBookingType] = useState<BookingType>("one-time")
  const [currentStep, setCurrentStep] = useState<BookingStep>("space")
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

  const containerRef = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split("T")[0]
  const isSingleDay = duration === "day"
  const selectedSpace = useMemo(
    () => spaces.find((space) => space.id === selectedSpaceId) ?? null,
    [spaces, selectedSpaceId],
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
    else {
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
        const params = new URLSearchParams({
          workspace_id: String(selectedSpace.id),
          start_date: startDate,
        })
        if (!isSingleDay && endDate) params.append("end_date", endDate)

        const res = await fetch(`${API_BASE_URL}/workspaces/availability?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!res.ok) throw new Error("Unable to check availability")

        const data = await res.json()

        setAvailabilityInfo({
          workspace: data.workspace || selectedSpace.name,
          remaining: data.remaining || 0,
          inventory: data.inventory || 1,
          booked: data.booked || 0,
          lead_time: data.lead_time,
          requested_start: data.requested_start || startDate,
          requested_end: data.requested_end || (isSingleDay ? startDate : endDate),
          is_available: data.is_available || data.remaining > 0,
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

    const debounceTimer = setTimeout(fetchAvailability, 300)
    return () => {
      controller.abort()
      clearTimeout(debounceTimer)
    }
  }, [selectedSpace, startDate, endDate, isSingleDay])

  const filteredSpaceSuggestions = useMemo(() => {
    const source = spaces
    if (!spaceQuery.trim()) return source.slice(0, 8)
    const q = spaceQuery.toLowerCase()
    return source
      .filter(
        (space) =>
          space.name.toLowerCase().includes(q) ||
          (space.locationName?.toLowerCase().includes(q) ?? false) ||
          (space.category?.toLowerCase().includes(q) ?? false),
      )
      .slice(0, 8)
  }, [spaces, spaceQuery])

  const derivePerDayRate = (space?: Workspace) => {
    if (!space) return 0
    if (space.priceDay) return space.priceDay
    if (space.priceHour) return space.priceHour * 8
    if (space.priceMonth) return space.priceMonth / 22
    return 0
  }

  const calculatePrice = () => {
    if (!selectedSpace) return 0

    // Membership pricing
    if (bookingType === "membership") {
      return selectedSpace.priceMonth || derivePerDayRate(selectedSpace) * 22
    }

    // One-time pricing
    const perDayRate = derivePerDayRate(selectedSpace)
    const perWeekRate = perDayRate * 5
    const perMonthRate = selectedSpace.priceMonth ?? perDayRate * 22

    if (isSingleDay) return Math.round(perDayRate)
    if (!startDate || !endDate) return Math.round(duration === "week" ? perWeekRate : perMonthRate)

    const days = Math.max(
      1,
      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
    )
    let total = perDayRate * days
    if (duration === "week") total = Math.max(total, perWeekRate)
    if (duration === "month") total = Math.max(total, perMonthRate * Math.max(1, Math.round(days / 30)))
    return Math.round(total)
  }

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
          end_date: bookingType === "membership" ? null : isSingleDay ? startDate : endDate,
          start_time: isSingleDay && bookingType === "one-time" ? startTime : null,
          end_time: isSingleDay && bookingType === "one-time" ? endTime : null,
          duration_unit: bookingType === "membership" ? "month" : duration,
          total_price: totalPrice,
          payment_status: "manual",
          source: "website",
          booking_type: bookingType,
          is_recurring: bookingType === "membership",
          addons: [],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setBookingMessage({
          type: "error",
          text: data.message || `Booking failed with status ${res.status}`,
        })
        setIsSubmitting(false)
        return
      }

      setBookingMessage({
        type: "success",
        text: `${bookingType === "membership" ? "Membership" : "Booking"} submitted for ${selectedSpace?.name}. Total: Br ${totalPrice}.`,
      })
      setIsSubmitting(false)
      setCurrentStep("confirmation")
    } catch (err) {
      console.error("Booking fetch error:", err)
      setBookingMessage({ type: "error", text: "Server error" })
      setIsSubmitting(false)
    }
  }

  const handleBooking = async () => {
    if (!name || !email || !phone) {
      setBookingMessage({ type: "error", text: "Please fill all contact fields" })
      return
    }

    // For membership, dates are optional
    if (bookingType === "one-time") {
      if (!startDate) {
        setBookingMessage({ type: "error", text: "Please select a start date" })
        return
      }
      if (!isSingleDay && !endDate) {
        setBookingMessage({ type: "error", text: "Please select an end date" })
        return
      }
    }

    if (!selectedSpace) {
      setBookingMessage({ type: "error", text: "Please select a workspace" })
      return
    }

    if (bookingType === "one-time" && availabilityInfo && availabilityInfo.remaining === 0) {
      setShowOccupiedConfirm(true)
      return
    }

    if (availabilityState === "loading") {
      setBookingMessage({
        type: "error",
        text: "Please wait while we check availability...",
      })
      return
    }

    await submitBooking()
  }

  const steps =
    bookingType === "one-time"
      ? [
          {
            id: "space",
            name: "Select Space",
            status:
              currentStep === "space"
                ? "current"
                : ["membership", "dates", "contact", "confirmation"].includes(currentStep)
                  ? "complete"
                  : "upcoming",
          },
          {
            id: "dates",
            name: "Choose Dates",
            status:
              currentStep === "dates"
                ? "current"
                : ["contact", "confirmation"].includes(currentStep)
                  ? "complete"
                  : "upcoming",
          },
          {
            id: "contact",
            name: "Your Details",
            status: currentStep === "contact" ? "current" : currentStep === "confirmation" ? "complete" : "upcoming",
          },
          { id: "confirmation", name: "Confirm", status: currentStep === "confirmation" ? "current" : "upcoming" },
        ]
      : [
          {
            id: "space",
            name: "Select Space",
            status:
              currentStep === "space"
                ? "current"
                : ["membership", "dates", "contact", "confirmation"].includes(currentStep)
                  ? "complete"
                  : "upcoming",
          },
          {
            id: "membership",
            name: "Membership",
            status:
              currentStep === "membership"
                ? "current"
                : ["contact", "confirmation"].includes(currentStep)
                  ? "complete"
                  : "upcoming",
          },
          {
            id: "contact",
            name: "Your Details",
            status: currentStep === "contact" ? "current" : currentStep === "confirmation" ? "complete" : "upcoming",
          },
          { id: "confirmation", name: "Confirm", status: currentStep === "confirmation" ? "current" : "upcoming" },
        ]

  const nextStep = () => {
    // Scroll to top of container smoothly
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

    setTimeout(() => {
      if (currentStep === "space") {
        if (bookingType === "membership") {
          setCurrentStep("membership")
        } else {
          setCurrentStep("dates")
        }
      } else if (currentStep === "membership") {
        setCurrentStep("contact")
      } else if (currentStep === "dates") {
        setCurrentStep("contact")
      } else if (currentStep === "contact") {
        setCurrentStep("confirmation")
      }
    }, 300)
  }

  const prevStep = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

    setTimeout(() => {
      if (currentStep === "confirmation") {
        setCurrentStep("contact")
      } else if (currentStep === "contact") {
        if (bookingType === "membership") {
          setCurrentStep("membership")
        } else {
          setCurrentStep("dates")
        }
      } else if (currentStep === "membership") {
        setCurrentStep("space")
      } else if (currentStep === "dates") {
        setCurrentStep("space")
      }
    }, 300)
  }

  const handleSpaceSelect = (space: Workspace) => {
    setSelectedSpaceId(space.id)
    setSpaceQuery(space.name)
    setShowSpaceSuggestions(false)
    setBookingMessage(null)
    nextStep()
  }

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
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Book Your Workspace</h1>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* <div className="bg-gradient-to-r from-primary to-accent p-6 sm:p-8 text-primary-foreground rounded-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Experience Premium Workspaces</h2>
          <p className="text-center text-primary-foreground/90 max-w-2xl mx-auto text-sm sm:text-base">
            Located in Torhailoch, Kolfe Keranio, Addis Ababa
          </p>
          <div className="flex justify-center mt-3">
            <a
              href="https://www.google.com/maps/contrib/102030795905177538691/place/ChIJF-cCZtSHSxYRegys6vVlrKM/@9.0130609,38.7169007,1864m/data=!3m1!1e3!4m6!1m5!8m4!1e1!2s102030795905177538691!3m1!1e1?hl=en-GB&entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-foreground/90 hover:text-primary-foreground underline text-sm"
            >
              <MapPin className="h-4 w-4 mr-1" />
              View on Google Maps
            </a>
          </div>
        </div> */}

        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative flex-1 flex flex-col items-center">
                {step.status === "complete" ? (
                  <div className="flex flex-col items-center">
                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary">
                      <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                    </span>
                    <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">{step.name}</span>
                  </div>
                ) : step.status === "current" ? (
                  <div className="flex flex-col items-center">
                    <span className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-primary bg-background">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                    </span>
                    <span className="mt-2 text-xs sm:text-sm font-semibold text-primary">{step.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-border bg-background">
                      <span className="h-3 w-3 rounded-full bg-transparent"></span>
                    </span>
                    <span className="mt-2 text-xs sm:text-sm font-medium text-muted-foreground">{step.name}</span>
                  </div>
                )}

                {stepIdx !== steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-[60%] right-[-40%] h-0.5 ${step.status === "complete" ? "bg-primary" : "bg-border"}`}
                  ></div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {bookingMessage && (
          <div
            className={`mb-6 p-4 rounded-lg max-w-3xl mx-auto ${bookingMessage.type === "error" ? "bg-destructive/10 border border-destructive/20" : "bg-green-50 border border-green-200"}`}
          >
            <div className="flex items-start">
              {bookingMessage.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm ${bookingMessage.type === "error" ? "text-destructive" : "text-green-800"}`}>
                {bookingMessage.text}
              </p>
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto">
          {/* Space Selection Step */}
          {currentStep === "space" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Select Your Workspace</h2>
                <p className="text-muted-foreground mb-6">Choose from our premium workspaces</p>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-foreground mb-4">Booking Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setBookingType("one-time")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        bookingType === "one-time"
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <CreditCard
                          className={`h-8 w-8 ${bookingType === "one-time" ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-bold mb-1 ${bookingType === "one-time" ? "text-primary" : "text-foreground"}`}
                      >
                        One-Time Booking
                      </h3>
                      <p className="text-sm text-muted-foreground">Book for specific dates</p>
                    </button>

                    <button
                      onClick={() => setBookingType("membership")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        bookingType === "membership"
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <Repeat
                          className={`h-8 w-8 ${bookingType === "membership" ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-bold mb-1 ${bookingType === "membership" ? "text-primary" : "text-foreground"}`}
                      >
                        Membership
                      </h3>
                      <p className="text-sm text-muted-foreground">Recurring monthly access</p>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <input
                      type="text"
                      value={spaceQuery}
                      onChange={(e) => {
                        setSpaceQuery(e.target.value)
                        if (!showSpaceSuggestions) setShowSpaceSuggestions(true)
                      }}
                      onFocus={() => setShowSpaceSuggestions(true)}
                      placeholder="Search workspaces..."
                      className="w-full pl-12 pr-12 py-4 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background text-foreground text-lg"
                    />
                    {spaceQuery && (
                      <button
                        onClick={() => {
                          setSpaceQuery("")
                          setSelectedSpaceId(null)
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {showSpaceSuggestions && (
                    <div className="absolute z-10 mt-2 w-full bg-card shadow-xl rounded-xl border-2 border-border max-h-80 overflow-auto">
                      {isLoadingSpaces ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p className="text-sm">Loading workspaces...</p>
                        </div>
                      ) : filteredSpaceSuggestions.length > 0 ? (
                        filteredSpaceSuggestions.map((space) => (
                          <button
                            key={space.id}
                            onClick={() => handleSpaceSelect(space)}
                            className={`w-full text-left px-6 py-4 hover:bg-primary/10 transition-colors flex items-center border-b border-border last:border-0 ${selectedSpaceId === space.id ? "bg-primary/10" : ""}`}
                          >
                            <div className="shrink-0 h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div className="ml-4">
                              <p className="font-semibold text-foreground">{space.name}</p>
                              <p className="text-sm text-muted-foreground">{space.locationName || "Addis Ababa"}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <p>No workspaces found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedSpace && (
                <div className="mt-6 p-6 bg-primary/10 border-2 border-primary/30 rounded-xl">
                  <div className="flex items-start">
                    <div className="shrink-0 h-16 w-16 bg-primary/20 rounded-xl flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-bold text-foreground">{selectedSpace.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedSpace.locationName || "Addis Ababa"}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-background text-foreground border border-border">
                          {selectedSpace.capacity ? `Up to ${selectedSpace.capacity} people` : "Flexible capacity"}
                        </span>
                        {bookingType === "membership" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary text-primary-foreground">
                            Br {calculatePrice()}/month
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!selectedSpace}
                  className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg text-primary-foreground ${selectedSpace ? "bg-primary hover:bg-primary/90" : "bg-muted cursor-not-allowed"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all`}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Membership Step */}
          {currentStep === "membership" && selectedSpace && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Membership Plan</h2>
                <p className="text-muted-foreground mb-8">Unlimited access to {selectedSpace?.name}</p>

                <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-foreground">Monthly Membership</h3>
                      <p className="text-muted-foreground mt-2">Recurring access - cancel anytime</p>
                    </div>
                    <Repeat className="h-16 w-16 text-primary" />
                  </div>

                  <div className="border-t border-border my-6"></div>

                  <div className="space-y-4">
                    <div className="flex items-center text-foreground text-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                      <span>Unlimited access to workspace</span>
                    </div>
                    <div className="flex items-center text-foreground text-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                      <span>Book any available time slot</span>
                    </div>
                    <div className="flex items-center text-foreground text-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                      <span>Priority booking for events</span>
                    </div>
                    <div className="flex items-center text-foreground text-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                      <span>Access to all amenities</span>
                    </div>
                    <div className="flex items-center text-foreground text-lg">
                      <CheckCircle2 className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                      <span>24/7 member support</span>
                    </div>
                  </div>

                  <div className="border-t border-border my-6"></div>

                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-primary">Br {calculatePrice()}</span>
                    <span className="text-xl text-muted-foreground ml-3">/month</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-3 border-2 border-border shadow-sm font-medium rounded-xl text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    Continue to Details
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dates Step - Only for one-time bookings */}
          {currentStep === "dates" && selectedSpace && bookingType === "one-time" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">When would you like to book?</h2>
                <p className="text-muted-foreground mb-8">
                  Select your preferred date and time for {selectedSpace.name}
                </p>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-foreground mb-3">
                      Booking Duration
                    </label>
                    <div className="flex rounded-xl overflow-hidden border-2 border-border shadow-sm">
                      {(["day", "week", "month"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDuration(option)}
                          className={`flex-1 py-3 px-6 text-base font-semibold ${
                            duration === option
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-foreground hover:bg-muted"
                          } focus:outline-none transition-colors`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="start-date" className="block text-sm font-semibold text-foreground mb-2">
                        Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                        <input
                          type="date"
                          id="start-date"
                          min={today}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background text-foreground"
                        />
                      </div>
                    </div>

                    {!isSingleDay && (
                      <div>
                        <label htmlFor="end-date" className="block text-sm font-semibold text-foreground mb-2">
                          End Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                          <input
                            type="date"
                            id="end-date"
                            min={startDate || today}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={!startDate}
                            className={`w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none ${!startDate ? "bg-muted cursor-not-allowed" : "bg-background"} text-foreground`}
                          />
                        </div>
                      </div>
                    )}

                    {isSingleDay && (
                      <>
                        <div>
                          <label htmlFor="start-time" className="block text-sm font-semibold text-foreground mb-2">
                            Start Time
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                            <input
                              type="time"
                              id="start-time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background text-foreground"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="end-time" className="block text-sm font-semibold text-foreground mb-2">
                            End Time
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                            <input
                              type="time"
                              id="end-time"
                              min={startTime}
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              disabled={!startTime}
                              className={`w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none ${!startTime ? "bg-muted cursor-not-allowed" : "bg-background"} text-foreground`}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Availability Status */}
                  {availabilityState === "loading" && (
                    <div className="p-4 bg-primary/10 border-2 border-primary/30 rounded-xl">
                      <div className="flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" />
                        <span className="font-medium text-foreground">Checking availability...</span>
                      </div>
                    </div>
                  )}

                  {availabilityState === "error" && availabilityError && (
                    <div className="p-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-destructive mr-3 mt-0.5" />
                        <div>
                          <p className="font-semibold text-destructive">Unable to check availability</p>
                          <p className="text-sm text-destructive/80 mt-1">{availabilityError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {availabilityInfo && availabilityState === "idle" && (
                    <div
                      className={`p-5 rounded-xl border-2 ${availabilityInfo.remaining > 0 ? "bg-green-50 border-green-300" : "bg-destructive/10 border-destructive/30"}`}
                    >
                      <div className="flex items-start">
                        {availabilityInfo.remaining > 0 ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 mt-0.5" />
                        ) : (
                          <XCircle className="h-6 w-6 text-destructive mr-3 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`font-bold text-lg ${availabilityInfo.remaining > 0 ? "text-green-800" : "text-destructive"}`}
                          >
                            {availabilityInfo.remaining > 0 ? (
                              <>
                                {availabilityInfo.remaining} of {availabilityInfo.inventory} space(s) available
                              </>
                            ) : (
                              "Fully booked for selected dates"
                            )}
                          </p>
                          {availabilityInfo.lead_time && (
                            <p className="text-sm mt-1 text-muted-foreground">
                              Next available: {new Date(availabilityInfo.lead_time).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-3 border-2 border-border shadow-sm font-medium rounded-xl text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={handleDateSelect}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Details Step */}
          {currentStep === "contact" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Your Contact Details</h2>
                <p className="text-muted-foreground mb-8">We'll use this information to confirm your booking</p>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none" />
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 9XX XXX XXX"
                        className="w-full pl-12 pr-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-3 border-2 border-border shadow-sm font-medium rounded-xl text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!name || !email || !phone}
                    className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg text-primary-foreground ${name && email && phone ? "bg-primary hover:bg-primary/90" : "bg-muted cursor-not-allowed"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all`}
                  >
                    Review Booking
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === "confirmation" && selectedSpace && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Confirm Your Booking</h2>
                <p className="text-muted-foreground mb-8">Review your booking details before submitting</p>

                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Workspace</span>
                        <span className="font-semibold text-foreground">{selectedSpace.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Booking Type</span>
                        <span className="font-semibold text-foreground">
                          {bookingType === "membership" ? "Monthly Membership" : "One-Time Booking"}
                        </span>
                      </div>
                      {bookingType === "one-time" && (
                        <>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="text-muted-foreground">Start Date</span>
                            <span className="font-semibold text-foreground">
                              {new Date(startDate).toLocaleDateString()}
                            </span>
                          </div>
                          {!isSingleDay && endDate && (
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">End Date</span>
                              <span className="font-semibold text-foreground">
                                {new Date(endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {isSingleDay && startTime && endTime && (
                            <div className="flex justify-between py-2 border-b border-border">
                              <span className="text-muted-foreground">Time</span>
                              <span className="font-semibold text-foreground">
                                {startTime} - {endTime}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-semibold text-foreground">{name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-semibold text-foreground">{email}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-semibold text-foreground">{phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">
                          {bookingType === "membership" ? "Monthly Payment" : "Total Price"}
                        </p>
                        <p className="text-5xl font-bold mt-1">Br {calculatePrice()}</p>
                        {bookingType === "membership" && (
                          <p className="text-sm opacity-90 mt-2">Billed monthly until cancelled</p>
                        )}
                      </div>
                      <CreditCard className="h-16 w-16 opacity-80" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center px-6 py-3 border-2 border-border shadow-sm font-medium rounded-xl text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg text-primary-foreground ${isSubmitting ? "bg-muted cursor-wait" : "bg-primary hover:bg-primary/90"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <CheckCircle2 className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Occupied Confirmation Modal */}
        {showOccupiedConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="flex items-start mb-4">
                <AlertCircle className="h-8 w-8 text-destructive mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Space Fully Booked</h3>
                  <p className="text-muted-foreground mt-2">
                    This workspace is fully booked for the selected dates. Would you like to proceed anyway?
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowOccupiedConfirm(false)}
                  className="flex-1 px-4 py-3 border-2 border-border rounded-xl font-medium text-foreground hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowOccupiedConfirm(false)
                    submitBooking()
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
