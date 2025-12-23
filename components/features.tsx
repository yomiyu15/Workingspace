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
    <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-0 w-[520px] h-[520px] bg-primary/6 blur-[150px]" />
        <div className="absolute right-[-15%] bottom-[-10%] w-[520px] h-[520px] bg-accent/8 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 md:mb-20"
        >
          <div>
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
              The Experience
            </span>
            <h3 className="text-2xl md:text-4xl font-bold mb-3 text-foreground tracking-tight">
              Why WorkSpace Hub?
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Modern, secure, and flexible workspaces designed for Addis Ababa's next generation of builders.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur px-4 py-3 text-[11px] font-semibold text-muted-foreground inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live updates from member feedback
          </div>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = resolveIcon(feature.icon)
            return (
              <AnimatedItem key={`${feature.title}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col p-6 rounded-2xl bg-card/80 backdrop-blur border border-border/60 hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-semibold text-foreground">
                      {feature.title}
                    </h3>

                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary" />
                      Included with every plan
                    </div>
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