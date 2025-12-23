"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BadgeCheck, ExternalLink, Star } from "lucide-react"

import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"
import { API_BASE_URL } from "@/lib/config"

type Testimonial = {
  name: string
  role: string
  company?: string
  text: string
  rating: number
  image?: string
  verified?: boolean
  source_url?: string
}

const resolveImageUrl = (image?: string) => {
  if (!image) return "/placeholder-user.jpg"
  if (/^https?:\/\//i.test(image)) return image
  const apiRoot = API_BASE_URL?.replace(/\/api$/, "") || ""
  const base = apiRoot.replace(/\/+$/, "")
  const path = image.startsWith("/") ? image : `/${image}`
  return `${base}${path}`
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE_URL}/testimonials`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to load testimonials")
        const data = await res.json()
        if (!controller.signal.aborted && Array.isArray(data)) {
          setTestimonials(
            data.map((item: any) => ({
              name: item.name,
              role: item.role,
              company: item.company,
              text: item.text,
              rating: Number(item.rating) || 5,
              image: item.image,
              verified: item.verified !== false,
              source_url: item.source_url || item.profile_url || null,
            })),
          )
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        console.error("Failed to fetch testimonials:", err)
        setError("Unable to load testimonials right now.")
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
    {/* Consistent Header Architecture */}
        <div className="mb-20">
          <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block text-center md:text-left">
            Voices
          </span>
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
            Trusted by the <span className="text-primary italic">best.</span>
          </h3>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto md:mx-0 text-center md:text-left leading-relaxed">
            Join hundreds of professionals who have redefined their work style at Thrive Coworking Space in Addis Ababa.
          </p>
        </div>

        {loading && (
          <div className="text-center text-sm text-muted-foreground py-10">Loading testimonials…</div>
        )}

        {!loading && error && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl py-4">
            {error}
          </div>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center text-sm text-muted-foreground bg-muted/20 border border-muted rounded-xl py-6">
            No testimonials have been published yet. Please add some from the admin dashboard.
          </div>
        )}

      {!loading && testimonials.length > 0 && (
  <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
    {testimonials.map((testimonial, index) => (
      <AnimatedItem key={`${testimonial.name}-${index}`} className="h-full">
        <motion.div
          whileHover={{ y: -10, boxShadow: "0 24px 45px -12px rgba(15, 23, 42, 0.35)" }}
          transition={{ type: "spring", stiffness: 300 }}
          // Removed manual minHeight logic to allow flex-stretch to work
          className="p-6 bg-white rounded-2xl border border-border shadow-md hover:shadow-xl transition h-full flex flex-col"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.img
              src={resolveImageUrl(testimonial.image)}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
              whileHover={{ scale: 1.1 }}
            />
            <div>
              <p className="font-semibold text-slate-900">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              {testimonial.company && (
                <p className="text-xs text-blue-600 font-medium">{testimonial.company}</p>
              )}
              {testimonial.verified && (
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <BadgeCheck className="w-3 h-3" /> Verified Member
                </p>
              )}
            </div>
          </div>

          <motion.div
            className="flex gap-1 mb-3"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {Array.from({ length: Math.max(1, Math.min(5, testimonial.rating)) }).map((_, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { scale: 0 },
                  visible: { scale: 1 },
                }}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>

          {/* flex-grow ensures this section fills the remaining space */}
          <p className="text-sm text-muted-foreground italic flex-grow">
            "{testimonial.text}"
          </p>

          {testimonial.source_url && (
            <a
              href={testimonial.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              View profile <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </motion.div>
      </AnimatedItem>
    ))}
  </AnimatedStagger>
)}
        
        
      </div>
      
    </section>
  )
}
