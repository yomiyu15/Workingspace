"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { CalendarCheck2, Clock3, MapPin, Users, X } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { Workspace, normalizeWorkspace } from "@/types/workspace"

type GalleryCategory = {
  id: string
  name: string
  badge?: string
}

type GalleryItem = {
  id: number
  category: GalleryCategory["id"]
  title: string
  description: string
  image: string
  location: string
  capacity: string
  availability: string
  rating: number
  rates: {
    hourly: string
    daily: string
    monthly: string
  }
  amenities: string[]
  tags: string[]
  bookingLeadTime: string
  bookingLink?: string
}

const galleryCategories: GalleryCategory[] = [
  { id: "all", name: "All Spaces" },
  { id: "private", name: "Private Offices", badge: "Popular" },
  { id: "meeting", name: "Meeting Rooms" },
  { id: "hot-desk", name: "Hot Desks" },
  { id: "event", name: "Event Spaces" },
]

const ITEMS_PER_PAGE = 6

const FALLBACK_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: "private",
    title: "Private Office - Premium",
    description: "Corner office with skyline views, perfect for exec teams up to 8.",
    image: "/premium-private-office-workspace.jpg",
    location: "Level 18, Midtown Tower",
    capacity: "Up to 8 people",
    availability: "Available now",
    rating: 4.9,
    rates: { hourly: "$65", daily: "$420", monthly: "$4,900" },
    amenities: ["Dedicated concierge", "Smart access", "Ergonomic chairs", "Soundproofing"],
    tags: ["Enterprise ready", "Natural light", "24/7 access"],
    bookingLeadTime: "Instant confirmation",
    bookingLink: "/book/premium-office",
  },
  {
    id: 2,
    category: "hot-desk",
    title: "Hot Desk Area",
    description: "Flexible seats in the energy hub, ideal for hybrid teams.",
    image: "/collaborative-hot-desk-coworking.jpg",
    location: "Level 5, Creative Hub",
    capacity: "Per seat",
    availability: "Day passes available",
    rating: 4.7,
    rates: { hourly: "$12", daily: "$45", monthly: "$320" },
    amenities: ["Phone booths", "Community events", "Lockers", "Wellness room"],
    tags: ["Most booked", "Community vibe"],
    bookingLeadTime: "Book 1 day ahead",
  },
  {
    id: 3,
    category: "meeting",
    title: "Board Meeting Room",
    description: "12-person boardroom with dual displays and hybrid tools.",
    image: "/professional-meeting-room-conference.jpg",
    location: "Level 10, Strategy Suite",
    capacity: "Up to 12 people",
    availability: "High demand — book early",
    rating: 4.8,
    rates: { hourly: "$90", daily: "$620", monthly: "-" },
    amenities: ["4K conferencing", "On-site support", "Catering add-on"],
    tags: ["Hybrid ready", "Executive"],
    bookingLeadTime: "Confirm in 2 hours",
    bookingLink: "/book/boardroom",
  },
  {
    id: 4,
    category: "event",
    title: "Event & Workshop Space",
    description: "Modular event hall with LED wall and hospitality bar.",
    image: "/modern-event-space-workshop.jpg",
    location: "Ground Floor, Experience Center",
    capacity: "Up to 80 people",
    availability: "Weekends available",
    rating: 4.9,
    rates: { hourly: "$180", daily: "$1,200", monthly: "-" },
    amenities: ["LED wall", "Stage setup", "Green room", "A/V tech"],
    tags: ["Brand launches", "Workshops"],
    bookingLeadTime: "Needs 48h notice",
    bookingLink: "/book/event-space",
  },
  {
    id: 5,
    category: "private",
    title: "Executive Office Suite",
    description: "Two-room executive suite with lounge and concierge desk.",
    image: "/luxury-executive-office-suite.jpg",
    location: "Level 21, Signature Collection",
    capacity: "Up to 10 people",
    availability: "Only 1 left",
    rating: 5,
    rates: { hourly: "$85", daily: "$560", monthly: "$6,500" },
    amenities: ["Private lounge", "Personal assistant", "Premium espresso"],
    tags: ["Limited", "Enterprise"],
    bookingLeadTime: "Invite-only preview",
  },
  {
    id: 6,
    category: "hot-desk",
    title: "Open Workspace",
    description: "Sunlit open floor with biophilic design and quiet focus pods.",
    image: "/open-collaborative-desk-workspace.jpg",
    location: "Level 7, Creator Loft",
    capacity: "Per seat",
    availability: "Available now",
    rating: 4.6,
    rates: { hourly: "$10", daily: "$38", monthly: "$290" },
    amenities: ["Focus pods", "Community host", "Snack bar"],
    tags: ["Focus-friendly"],
    bookingLeadTime: "Instant booking",
  },
]

const FallbackAmenities = ["High speed WiFi", "Meeting rooms", "Coffee bar", "24/7 access"]

const formatPrice = (value?: number, suffix = "") => {
  if (!value || Number.isNaN(value)) return "-"
  return `Br ${Number(value).toLocaleString("en-US")}${suffix}`
}

const API_BASE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "") || API_BASE_URL

const resolveImageUrl = (value?: string) => {
  if (!value) return ""
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  const normalizedPath = value.startsWith("/") ? value : `/${value}`
  return `${API_BASE_ORIGIN}${normalizedPath}`
}

const workspaceToGalleryItem = (workspace: Workspace): GalleryItem => {
  const mainImage = workspace.images.length ? resolveImageUrl(workspace.images[0]) : "/premium-private-office-workspace.jpg"
  return {
    id: workspace.id,
    category: workspace.category || "all",
    title: workspace.name,
    description: workspace.description || "Flexible workspace tailored to ambitious teams.",
    image: mainImage,
    location: [workspace.locationName, workspace.locationCity].filter(Boolean).join(", ") || "Thrive Coworking Space",
    capacity: workspace.capacity ? `Up to ${workspace.capacity} people` : "Flexible capacity",
    availability: workspace.leadTime || "Available now",
    rating: workspace.rating || 4.8,
    rates: {
      hourly: formatPrice(workspace.priceHour, "/hr"),
      daily: formatPrice(workspace.priceDay, "/day"),
      monthly: formatPrice(workspace.priceMonth, "/month"),
    },
    amenities: workspace.amenities.length ? workspace.amenities : FallbackAmenities,
    tags: workspace.tags.length ? workspace.tags : [workspace.category, workspace.locationCity].filter(Boolean) as string[],
    bookingLeadTime: workspace.leadTime || "Instant confirmation",
    bookingLink: `/bookings?space=${workspace.id}`,
  }
}

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory["id"]>("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(FALLBACK_GALLERY_ITEMS)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workspaces?limit=9`)
        if (!response.ok) {
          throw new Error("Failed to load spaces")
        }
        const payload = await response.json()
        if (!Array.isArray(payload)) return
        const normalized = payload.map((item) => workspaceToGalleryItem(normalizeWorkspace(item)))
        if (normalized.length && isMounted) {
          setGalleryItems(normalized)
        }
      } catch (error) {
        console.error("Failed to fetch workspace gallery:", error)
        if (isMounted) setFetchError("Live availability is temporarily unavailable. Showing highlighted spaces.")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchWorkspaces()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPage(0)
  }, [activeCategory, galleryItems])

  const filteredItems = useMemo(() => {
    return activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)
  }, [activeCategory, galleryItems])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages - 1)

  const paginatedItems = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  return (
    <section className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
         
<h2 className="text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-black">
  Explore Our Spaces
</h2>


          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Flexible workspaces designed for productivity, collaboration, and creativity
          </p>

          {fetchError && (
            <p className="mt-4 text-sm text-amber-600">
              {fetchError}
            </p>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
        >
          {galleryCategories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
             <motion.button
  key={cat.id}
  onClick={() => setActiveCategory(cat.id)}
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className={`px-5 py-2.5 rounded-full font-semibold transition-all text-sm ${
    isActive
      ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-black/30"
      : "border border-slate-200 bg-white text-slate-900 hover:border-black hover:bg-black/5"
  }`}
>
  <span className="flex items-center gap-2">
    {cat.name}
    {cat.badge && (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          isActive
            ? "bg-black/10 text-black"
            : "bg-[#FFF8E1] text-[#D4AF37]"
        }`}
      >
        {cat.badge}
      </span>
    )}
  </span>
</motion.button>

            )
          })}
        </motion.div>

        {/* Masonry Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {paginatedItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  duration: 0.,
                  delay: idx * 0.08,
                  type: "spring",
                  stiffness: 100,
                }}
                onClick={() => setSelectedItem(item)}
                role="button"
                aria-label={`View details for ${item.title}`}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                style={{
                  gridRow: idx === 1 ? 'span 2' : undefined,
                  gridColumn: idx === 4 ? 'span 2' : undefined,
                }}
              >
                {/* Image Container */}
                <div className="relative w-full h-80 md:h-96 overflow-hidden bg-slate-200">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-50 group-hover:opacity-40 transition-opacity duration-300"></div>

                  {/* Accent Border on Hover */}
                  <div className="absolute inset-0 border border-emerald-400/0 group-hover:border-emerald-400/40 transition-colors duration-300 rounded-2xl pointer-events-none"></div>

                  {/* Content Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-slate-900 shadow-sm">
                      {item.bookingLeadTime}
                    </span>
                    {item.rating && (
                      <span className="px-3 py-1 text-xs rounded-full bg-slate-900/70 text-white">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                     <div className="flex items-center gap-3 mb-2">
  <div className="w-1 h-6 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-full"></div>
  <h3 className="font-bold text-lg md:text-xl">
    {item.title}
  </h3>
</div>

                      <p className="text-sm text-slate-200 ml-4">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 ml-4 text-xs">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15">
                          <Users className="w-3 h-3" />
                          {item.capacity}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15">
                          <Clock3 className="w-3 h-3" />
                          {item.availability}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* View Icon */}
                  <motion.div
                    className="absolute top-4 right-4 w-10 h-10 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                  >
                    <span className="text-emerald-300 group-hover:text-white text-xl">+</span>
                  </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-3 bg-white/95 p-4 text-sm text-slate-700 backdrop-blur-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">From</p>
                    <p className="font-semibold text-slate-900">{item.rates.hourly} / hour</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

     

        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row">
            <span>
              Showing {currentPage * ITEMS_PER_PAGE + 1}-{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredItems.length)} of{" "}
              {filteredItems.length} spaces
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <div className="text-xs font-semibold text-slate-500">
                Page {currentPage + 1} / {totalPages}
              </div>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-auto max-h-90vh rounded-3xl overflow-hidden bg-white border border-slate-200"
            >
              {/* Modal Image */}
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-12 space-y-8 bg-white">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      {selectedItem.availability}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {selectedItem.location}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    {selectedItem.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Capacity", value: selectedItem.capacity, icon: Users },
                    { label: "Lead time", value: selectedItem.bookingLeadTime, icon: Clock3 },
                    { label: "Rating", value: `${selectedItem.rating.toFixed(1)} / 5`, icon: CalendarCheck2 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="text-sm font-semibold text-slate-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rates */}
                <div className="rounded-3xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                    <p className="text-sm font-semibold">Flexible billing</p>
                    <p className="text-xs text-white/60">Match your stay with hourly, day, or monthly plans</p>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white">
                    {Object.entries(selectedItem.rates).map(([term, value]) => (
                      <div key={term} className="p-4 text-center">
                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{term}</p>
                        <p className="text-lg font-semibold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Included amenities
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedItem.amenities.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-3">
                    {selectedItem.bookingLink ? (
                      <Link
                        href={selectedItem.bookingLink}
                        className="flex-1 text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                      >
                        Book instantly
                      </Link>
                    ) : (
                      <button className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                        Book instantly
                      </button>
                    )}
                    <button className="flex-1 border border-slate-300 text-slate-900 font-semibold py-4 rounded-xl hover:border-emerald-400 hover:text-emerald-600 transition-all duration-300">
                      Schedule a tour
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 text-xs text-slate-500">
                    <p>Need custom layout or enterprise pricing? <span className="text-emerald-600 font-semibold">Talk to workspace advisor</span></p>
                    <p>Concierge response within 15 mins between 8am - 8pm.</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 border border-slate-200 rounded-full flex items-center justify-center text-slate-900 hover:bg-emerald-500 hover:border-emerald-400 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <X size={20} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
