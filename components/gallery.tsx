"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, X, ArrowUpRight } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { type Workspace, normalizeWorkspace } from "@/types/workspace"

type GalleryCategory = { id: string; name: string }
type GalleryItem = {
  id: number; category: string; title: string; description: string; image: string;
  location: string; capacity: string; availability: string; rating: number;
  rates: { hourly: string; daily: string; monthly: string };
  amenities: string[]; tags: string[]; bookingLeadTime: string; bookingLink?: string; inventoryCount?: number;
}

const ITEMS_PER_PAGE = 6
const FallbackAmenities = ["High speed WiFi", "Meeting rooms", "Coffee bar", "24/7 access"]

const formatPrice = (value?: number, suffix = "") => 
  (!value ? "-" : `Br ${Number(value).toLocaleString()}${suffix}`)

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
  image: workspace.images.length ? resolveImageUrl(workspace.images[0]) : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800",
  location: [workspace.locationName, workspace.locationCity].filter(Boolean).join(", ") || "Addis Ababa",
  capacity: `${workspace.capacity || 0} People`,
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
  inventoryCount: workspace.inventoryCount,
})

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    let isMounted = true
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workspaces?status=active`)
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

  const categories: GalleryCategory[] = useMemo(() => {
    const uniq = new Set<string>()
    galleryItems.forEach((item) => uniq.add(item.category || "uncategorized"))
    const sorted = Array.from(uniq).sort()
    return [{ id: "all", name: "All Spaces" }, ...sorted.map((id) => ({ id, name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) }))]
  }, [galleryItems])

  const filteredItems = useMemo(() => 
    activeCategory === "all" ? galleryItems : galleryItems.filter(i => i.category === activeCategory)
  , [activeCategory, galleryItems])

  const paginatedItems = useMemo(() => {
    const start = page * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, page])

  return (
    <section className="relative py-12 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <span className="text-primary text-[11px] font-semibold tracking-wide mb-2 block">
              Workspace Registry
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Explore our spaces
            </h2>
          </div>

          {/* Sharp Category Filter - Normal Case */}
          <div className="flex border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setPage(0); }}
                className={`px-5 py-2 text-[13px] font-medium transition-all border-r last:border-r-0 border-slate-200 ${
                  activeCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-white text-slate-500 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sharp Grid with Lift-up Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedItems.map((item) => {
              const available = (item.inventoryCount ?? 1) > 0
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => available && setSelectedItem(item)}
                  className={`group relative flex flex-col border border-slate-200 bg-white p-5 transition-all duration-300 ${
                    available 
                      ? "cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:border-primary/20" 
                      : "opacity-50"
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] mb-5 overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Body Content - Normal Case */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-primary tracking-wide capitalize">{item.category}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    
                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-6">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400">Starting from</span>
                            <span className="text-sm font-bold text-slate-900">{item.rates.daily}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                            <Users className="w-3.5 h-3.5" />
                            {item.capacity}
                        </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Pagination - Normal Case */}
        {filteredItems.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex items-center justify-center gap-10 pt-10 border-t border-slate-100">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-[13px] font-semibold text-slate-600 disabled:opacity-20 hover:text-primary transition-colors"
            >
              Previous
            </button>
            <span className="text-[12px] font-medium text-slate-400">
              Page {page + 1} of {Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
            </span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * ITEMS_PER_PAGE >= filteredItems.length}
              className="text-[13px] font-semibold text-slate-600 disabled:opacity-20 hover:text-primary transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal - Normal Case */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl h-full md:h-auto overflow-y-auto border border-slate-200 flex flex-col md:flex-row shadow-2xl"
            >
              <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                <Image src={selectedItem.image} alt={selectedItem.title} fill className="object-cover" />
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-white/90 p-2 border border-slate-200 hover:bg-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                <span className="text-primary text-[12px] font-semibold mb-2">{selectedItem.location}</span>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedItem.title}</h2>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-8">{selectedItem.description}</p>
                
                <div className="grid grid-cols-1 border border-slate-100 mb-8">
                    {Object.entries(selectedItem.rates).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <span className="text-[12px] text-slate-400 capitalize">{key} rate</span>
                        <span className="text-sm font-bold text-slate-900">{val}</span>
                      </div>
                    ))}
                </div>

                <Link href={selectedItem.bookingLink || "#"} className="mt-auto">
                    <button className="w-full h-12 bg-primary text-white text-[14px] font-bold hover:brightness-110 transition-all">
                        Confirm booking
                    </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}