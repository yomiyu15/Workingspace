"use client"

import { useEffect, useState } from 'react'
import { Check, ArrowRight, Info } from 'lucide-react'
import { API_BASE_URL } from '@/lib/config'

type PricingPlan = {
  name: string
  price: string | number
  period: string
  description: string
  features: string[]
  popular?: boolean
}

const normalizeFeatures = (features: unknown): string[] => {
  if (Array.isArray(features)) {
    return features.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))).filter(Boolean)
  }
  if (typeof features === 'string') {
    return features.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
  }
  return []
}

export function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE_URL}/pricing`, { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to load pricing')
        const data = await res.json()
        if (!controller.signal.aborted && Array.isArray(data)) {
          setPlans(data.map((plan: any) => ({
            name: plan.name,
            price: plan.price,
            period: plan.period,
            description: plan.description,
            features: normalizeFeatures(plan.features),
            popular: Boolean(plan.popular),
          })))
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError('Unable to load pricing.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <section id="pricing" className="relative py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-primary text-[11px] font-semibold tracking-wide mb-2 block">
              Membership plans
            </span>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Simple pricing for every way you work
            </h3>
            <p className="text-slate-500 text-[14px] leading-relaxed mt-3">
              Choose a plan that fits your schedule. No hidden fees, just flexible workspace solutions.
            </p>
          </div>
          
          <div className="border border-slate-200 bg-white p-5 flex items-start gap-4 max-w-sm">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-600 leading-snug">
              <span className="font-bold text-slate-900 block mb-1">Concierge support</span>
              All plans include fast onboarding and access to our member network.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-slate-50 border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Pricing Grid - White/Light Theme */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-slate-200">
            {plans.map((plan, index) => {
              const isPopular = Boolean(plan.popular)
              return (
                <div
                  key={`${plan.name}-${index}`}
                  className={`relative flex flex-col p-10 border-r border-b border-slate-200 transition-all duration-300 ${
                    isPopular 
                    ? "bg-slate-50 shadow-inner" 
                    : "bg-white hover:bg-slate-50/50"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                      Most popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </h4>
                    <p className="text-[13px] text-slate-500 leading-relaxed h-10 line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-bold text-slate-900 tracking-tighter">
                      {typeof plan.price === "number" ? plan.price.toLocaleString() : plan.price}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      ETB / {plan.period}
                    </span>
                  </div>

                  <a
                    href="/booking"
                    className={`flex items-center justify-center gap-2 h-12 text-[13px] font-bold border transition-all mb-10 ${
                      isPopular
                        ? "bg-primary text-white border-primary hover:bg-primary/90"
                        : "bg-white text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    Select this plan
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Plan features
                    </p>
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                          <span className="text-[13px] text-slate-600 leading-tight">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && (error || plans.length === 0) && (
          <div className="p-16 border border-slate-200 text-center text-slate-500 text-sm">
            Pricing details are currently unavailable.
          </div>
        )}
      </div>
    </section>
  )
}