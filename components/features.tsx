"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"
import { API_BASE_URL } from "@/lib/config"

type FeatureItem = {
  title: string
  description: string
  icon?: string
}

const LOCAL_FEATURES: FeatureItem[] = [
  {
    icon: "Clock",
    title: "Flexible Booking",
    description: "Book for a day, week, or month. No long-term contracts needed.",
  },
  {
    icon: "MapPin",
    title: "Prime Locations",
    description: "Strategic locations across Addis Ababa. Easy access via public transport.",
  },
  {
    icon: "Users",
    title: "Professional Community",
    description: "Network with entrepreneurs, freelancers, and business professionals.",
  },
  {
    icon: "CheckCircle2",
    title: "Verified Spaces",
    description: "All spaces inspected and equipped with essential modern facilities.",
  },
  {
    icon: "Wifi",
    title: "High-Speed Internet",
    description: "Reliable WiFi connectivity with backup for uninterrupted work.",
  },
  {
    icon: "Shield",
    title: "Secure & Safe",
    description: "24/7 security, lockers, and professional management for peace of mind.",
  },
]

const resolveIcon = (name?: string): LucideIcon => {
  if (name && (LucideIcons as Record<string, LucideIcon>)[name]) {
    return (LucideIcons as Record<string, LucideIcon>)[name]
  }
  return LucideIcons.Sparkles
}

export function Features() {
  const [features, setFeatures] = useState<FeatureItem[]>(LOCAL_FEATURES)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/features`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to load features")
        const data = await res.json()
        if (!controller.signal.aborted && Array.isArray(data) && data.length) {
          setFeatures(
            data.map((item: FeatureItem) => ({
              title: item.title,
              description: item.description,
              icon: item.icon,
            })),
          )
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        console.error("Failed to fetch features:", err)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">Why Choose WorkSpace Hub?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover what makes us Addis Ababa's most trusted workspace platform
          </p>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = resolveIcon(feature.icon)
            return (
              <AnimatedItem key={`${feature.title}-${index}`}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col p-6 border border-border rounded-lg hover:shadow-lg transition"
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              </AnimatedItem>
            )
          })}
        </AnimatedStagger>
      </div>
    </section>
  )
}
