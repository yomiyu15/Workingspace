"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const amenities = [
  { title: "High-Speed WiFi", image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80" },
  { title: "Meeting Rooms", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80" },
  { title: "Coffee & Lounge", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80" },
  { title: "Phone Booths", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80" },
  { title: "24/7 Access", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80" },
  { title: "Event Space", image: "https://images.unsplash.com/photo-1515165562835-c3b8c1c1cc2d?auto=format&fit=crop&w=900&q=80" },
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
    <section className="py-20 sm:py-24 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 sm:mb-16 max-w-4xl">
          <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Amenities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Modern comforts for productive coworking
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            Modern design and comfortable, all-inclusive luxury. With our extensive range of amenities—from outdoor terraces to lounges and wellness spaces—you’ll love your time here.
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scrollTrack("left")}
                className="p-2 rounded-full border border-border hover:border-primary/70 hover:bg-muted transition-colors"
                aria-label="Scroll amenities left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollTrack("right")}
                className="p-2 rounded-full border border-border hover:border-primary/70 hover:bg-muted transition-colors"
                aria-label="Scroll amenities right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
          >
            {amenities.map((item) => (
              <div
                key={item.title}
                className="relative group overflow-hidden rounded-2xl shadow-md shadow-black/10 min-w-[240px] sm:min-w-[300px] lg:min-w-[340px] snap-center"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-sm bg-amber-400 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-md">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}