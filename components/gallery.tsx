"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { CalendarCheck2, Clock3, MapPin, Users, X, ArrowUpRight } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { type Workspace, normalizeWorkspace } from "@/types/workspace"

// ... types and categories remain unchanged ...
type GalleryCategory = { id: string; name: string; badge?: string }
type GalleryItem = {
  id: number; category: string; title: string; description: string; image: string;
  location: string; capacity: string; availability: string; rating: number;
  rates: { hourly: string; daily: string; monthly: string };
  amenities: string[]; tags: string[]; bookingLeadTime: string; bookingLink?: string;
}

const galleryCategories: GalleryCategory[] = [
  { id: "all", name: "All Spaces" },
  { id: "private", name: "Private Offices", badge: "Popular" },
  { id: "meeting", name: "Meeting Rooms" },
  { id: "hot-desk", name: "Hot Desks" },
  { id: "event", name: "Event Spaces" },
]

const ITEMS_PER_PAGE = 6
// ... Fallback items and helper functions (formatPrice, resolveImageUrl, workspaceToGalleryItem) remain unchanged ...
const FALLBACK_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: "private",
    title: "Private Office - Premium",
    description: "Corner office with skyline views, perfect for exec teams up to 8.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    location: "Level 18, Midtown Tower",
    capacity: "Up to 8 people",
    availability: "Available now",
    rating: 4.9,
    rates: { hourly: "Br 65", daily: "Br 420", monthly: "Br 4,900" },
    amenities: ["Dedicated concierge", "Smart access"],
    tags: ["Enterprise ready"],
    bookingLeadTime: "Instant confirmation",
  },
]
const FallbackAmenities = ["High speed WiFi", "Meeting rooms", "Coffee bar", "24/7 access"]
const formatPrice = (value?: number, suffix = "") => (!value ? "-" : `Br ${Number(value).toLocaleString()}${suffix}`)
const API_BASE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "") || API_BASE_URL
const resolveImageUrl = (value?: string) => {
  if (!value) return ""
  if (value.startsWith("http")) return value
  return `${API_BASE_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`
}
const workspaceToGalleryItem = (workspace: Workspace): GalleryItem => ({
  id: workspace.id,
  category: workspace.category || "all",
  title: workspace.name,
  description: workspace.description || "Flexible workspace tailored to ambitious teams.",
  image: workspace.images.length ? resolveImageUrl(workspace.images[0]) : "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
  location: [workspace.locationName, workspace.locationCity].filter(Boolean).join(", ") || "Addis Ababa",
  capacity: `Up to ${workspace.capacity || 0} people`,
  availability: workspace.leadTime || "Available now",
  rating: workspace.rating || 4.8,
  rates: {
    hourly: formatPrice(workspace.priceHour, "/hr"),
    daily: formatPrice(workspace.priceDay, "/day"),
    monthly: formatPrice(workspace.priceMonth, "/month"),
  },
  amenities: workspace.amenities.length ? workspace.amenities : FallbackAmenities,
  tags: workspace.tags.length ? workspace.tags : [workspace.category || "Workspace"],
  bookingLeadTime: workspace.leadTime || "Instant",
  bookingLink: `/bookings?space=${workspace.id}`,
})

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
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
        if (!response.ok) throw new Error()
        const payload = await response.json()
        if (Array.isArray(payload) && isMounted) {
          setGalleryItems(payload.map(item => workspaceToGalleryItem(normalizeWorkspace(item))))
        }
      } catch (error) {
        if (isMounted) setFetchError("Showing curated selection")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchWorkspaces()
    return () => { isMounted = false }
  }, [])

  const filteredItems = useMemo(() => 
    activeCategory === "all" ? galleryItems : galleryItems.filter(i => i.category === activeCategory)
  , [activeCategory, galleryItems])

  const paginatedItems = useMemo(() => {
    const start = page * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, page])

  return (
    <section className="relative py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header - Consistent with Features */}
        <div className="mb-12">
          <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            The Collection
          </span>
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
            Explore Our Spaces
          </h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Curated environments designed for deep focus and high-impact collaboration.
          </p>
        </div>

        {/* Categories - Lightweight Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all border ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Clean & Consistent */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer flex flex-col rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {item.bookingLeadTime}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground font-bold">Starts from</span>
                      <span className="text-sm font-bold">{item.rates.hourly}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      <Users className="w-3 h-3" />
                      {item.capacity.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination - Minimalist */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-full border border-border hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <X className="w-4 h-4 rotate-45" /> {/* Use icons instead of text for lighter feel */}
            </button>
            <span className="text-[13px] font-medium text-muted-foreground">
              {page + 1} / {Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * ITEMS_PER_PAGE >= filteredItems.length}
              className="p-2 rounded-full border border-border hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal - Modern Slide Up Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] md:rounded-3xl border-t md:border border-border shadow-2xl overflow-y-auto"
            >
              {/* Modal UI same logic as before but with reduced font sizes and cleaner paddings */}
              <div className="relative h-64 md:h-96">
                 <Image src={selectedItem.image} alt={selectedItem.title} fill className="object-cover" />
                 <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-background/50 backdrop-blur-md p-2 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 md:p-10">
                 <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">{selectedItem.location}</span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold mb-4">{selectedItem.title}</h2>
                 <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">{selectedItem.description}</p>
                 
                 <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(selectedItem.rates).map(([key, val]) => (
                      <div key={key} className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{key}</p>
                        <p className="text-sm md:text-lg font-bold">{val}</p>
                      </div>
                    ))}
                 </div>

                 <Link href={selectedItem.bookingLink || "#"} className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground h-12 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    Confirm Booking
                 </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}