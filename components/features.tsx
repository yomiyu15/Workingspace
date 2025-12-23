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
    title: "Flexible workspaces",
    description: "Choose from hot desks, dedicated desks, or private offices tailored to your needs.",
    icon: "Laptop",
  },
  {
    title: "High-speed internet",
    description: "Lightning-fast fiber optic connectivity to keep you productive all day long.",
    icon: "Wifi",
  },
  {
    title: "Meeting rooms",
    description: "Professional spaces equipped with modern tech for your team collaborations.",
    icon: "Users",
  },
  {
    title: "24/7 access",
    description: "Work on your schedule with round-the-clock secure access to your workspace.",
    icon: "Clock",
  },
  {
    title: "Community events",
    description: "Network and grow with regular workshops, talks, and social gatherings.",
    icon: "Calendar",
  },
  {
    title: "Prime location",
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
    <section className="relative py-16 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - Consistent with Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-xl">
            <span className="text-primary text-[11px] font-semibold tracking-wide mb-2 block">
              The experience
            </span>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">
              Why WorkSpace Hub?
            </h3>
            <p className="text-slate-500 text-[14px] leading-relaxed mt-2">
              Modern, secure, and flexible workspaces designed for the next generation of builders.
            </p>
          </div>
          
          {/* Status Label - Sharp Corners */}
          <div className="border border-slate-200 bg-white px-4 py-2 text-[12px] font-medium text-slate-500 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live network updates
          </div>
        </motion.div>

        {/* Features Grid - Consistent with Gallery Card Styles */}
        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = resolveIcon(feature.icon)
            return (
              <AnimatedItem key={`${feature.title}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col p-8 bg-white border border-slate-200 transition-all duration-300 h-full hover:shadow-xl hover:border-primary/20"
                >
                  {/* Icon Container - Sharp & Minimal */}
                  <div className="w-12 h-12 border border-slate-100 bg-slate-50 flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary/5 group-hover:border-primary/10">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-slate-400 group-hover:text-primary transition-colors">
                      <span className="w-1 h-1 bg-slate-300 group-hover:bg-primary" />
                      Included in all plans
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