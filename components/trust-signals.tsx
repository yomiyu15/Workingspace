"use client"

import { motion } from "framer-motion"
import { Building2, ShieldCheck, Star, Users2 } from "lucide-react"

const metrics = [
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Average member rating",
    detail: "Based on 320+ verified reviews",
  },
  {
    icon: Users2,
    value: "1,200+",
    label: "Professionals hosted",
    detail: "Teams across tech, finance & NGO sectors",
  },
  {
    icon: Building2,
    value: "18",
    label: "Active hubs in Addis Ababa",
    detail: "From Bole to Kazanchis",
  },
  {
    icon: ShieldCheck,
    value: "99.5%",
    label: "On-time support SLA",
    detail: "Concierge + on-site IT coverage",
  },
]

const partners = ["EthioTech Labs", "Dashen Bank", "Blue Nile Growth", "Addis Creatives", "Shega Media", "Habesha Capital"]

export function TrustSignals() {
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
              Why teams choose WorkSpace Hub
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              Trusted by growing startups and enterprise task forces across Addis Ababa
            </h2>
            <p className="mt-3 text-slate-600">
              From launch-week war rooms to long-term satellite offices, we provide audited spaces, monitored uptime, and
              concierge-style support so your team can focus on meaningful work.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            {metrics.slice(0, 2).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} delay={index * 0.1} compact />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} delay={index * 0.08} />
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 text-center">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm text-sm font-semibold text-slate-500 tracking-wide"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type MetricCardProps = {
  metric: (typeof metrics)[number]
  delay?: number
  compact?: boolean
}

function MetricCard({ metric, delay = 0, compact = false }: MetricCardProps) {
  const Icon = metric.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ${
        compact ? "max-w-[220px]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="p-3 rounded-xl bg-slate-900 text-white shadow-inner">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{metric.label}</p>
        </div>
      </div>
      {!compact && <p className="mt-3 text-sm text-slate-600">{metric.detail}</p>}
    </motion.div>
  )
}


