"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import * as LucideIcons from "lucide-react"

import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"
import { API_BASE_URL } from "@/lib/config"

interface FeatureItem {
  title: string
  description: string
  icon: keyof typeof LucideIcons
}

const LOCAL_FEATURES: FeatureItem[] = [
  {
    title: "Flexible Workspaces",
    description: "Choose from hot desks, dedicated desks, or private offices tailored to your needs.",
    icon: "Laptop",
  },
  {
    title: "High-Speed Internet",
    description: "Lightning-fast fiber optic connectivity to keep you productive all day long.",
    icon: "Wifi",
  },
  {
    title: "Meeting Rooms",
    description: "Professional spaces equipped with modern tech for your team collaborations.",
    icon: "Users",
  },
  {
    title: "24/7 Access",
    description: "Work on your schedule with round-the-clock secure access to your workspace.",
    icon: "Clock",
  },
  {
    title: "Community Events",
    description: "Network and grow with regular workshops, talks, and social gatherings.",
    icon: "Calendar",
  },
  {
    title: "Prime Location",
    description: "Conveniently located in the heart of the city with easy access to transport.",
    icon: "MapPin",
  },
]

function resolveIcon(iconName: keyof typeof LucideIcons) {
  const Icon = LucideIcons[iconName] as React.ComponentType<React.SVGProps<SVGSVGElement>>
  return Icon || LucideIcons.HelpCircle
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
    <section className="relative py-20 px-6 overflow-hidden bg-background">
      {/* Soft radial glow for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left mb-16 md:mb-20"
        >
          <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            The Experience
          </span>
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
            Why WorkSpace Hub?
          </h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Modern, secure, and flexible workspaces designed for Addis Ababa's next generation of builders.
          </p>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {features.map((feature, index) => {
            const Icon = resolveIcon(feature.icon)
            return (
              <AnimatedItem key={`${feature.title}-${index}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group relative flex flex-col p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 h-full overflow-hidden"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="w-10 h-10 mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <h3 className="text-base font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    
                    <p className="text-[13px] text-muted-foreground leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatedItem>
            )
          })}
        </AnimatedStagger>
      </div>
    </section>
  )
}