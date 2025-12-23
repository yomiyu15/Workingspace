"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"

const amenities = [
  { title: "High-speed WiFi", image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80" },
  { title: "Meeting rooms", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80" },
 
  { title: "Phone booths", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80" },
  { title: "24/7 access", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80" },
  { title: "Event space", image: "https://images.unsplash.com/photo-1515165562835-c3b8c1c1cc2d?auto=format&fit=crop&w=900&q=80" },
]

export function Amenities() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollTrack = (dir: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header - Consistent with Gallery/Pricing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary text-[11px] font-semibold tracking-wide mb-2 block">
              Amenities
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Modern comforts for productive coworking
            </h2>
            <p className="text-[14px] text-slate-500 leading-relaxed mt-3">
              From high-speed fiber to curated lounge spaces, we provide everything you need to stay focused and inspired throughout your workday.
            </p>
          </div>

          {/* Sharp Navigation Buttons */}
          <div className="flex border border-slate-200">
            <button
              onClick={() => scrollTrack("left")}
              className="p-4 border-r border-slate-200 hover:bg-slate-50 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => scrollTrack("right")}
              className="p-4 hover:bg-slate-50 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Scrolling Track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {amenities.map((item) => (
            <div
              key={item.title}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-[380px] snap-start group cursor-pointer"
            >
              {/* Image Container - Sharp edges, lift effect */}
              <div className="relative aspect-[4/3] mb-4 overflow-hidden border border-slate-200 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-primary/20">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Title - Sentence Case */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-[12px] text-slate-400 mt-1">Included in membership</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}