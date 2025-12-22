"use client"

import { useEffect, useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'
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
    <section id="pricing" className="py-20 px-6 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header - Consistent with Gallery/Features */}
        <div className="mb-16">
          <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Membership
          </span>
         <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
            Simple, Transparent Pricing
          </h3>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
            Choose the plan that fits your work style. No hidden fees, just pure productivity in the heart of Addis.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={`${plan.name}-${index}`}
                className={`relative group flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-card border-primary/40 shadow-xl shadow-primary/5 scale-100 md:scale-[1.03]' 
                    : 'bg-card/50 border-border/50 hover:border-primary/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed h-10 line-clamp-2">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    {typeof plan.price === 'number' ? plan.price.toLocaleString() : plan.price}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    ETB / {plan.period}
                  </span>
                </div>

                <a
                  href="/booking"
                  className={`w-full py-3 rounded-xl font-bold text-[13px] text-center mb-8 flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </a>

                <div className="space-y-4">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Included Features</p>
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-1 bg-primary/10 rounded-full p-0.5">
                            <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[13px] text-muted-foreground leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback for Empty State */}
        {!loading && (error || plans.length === 0) && (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">{error || "No plans currently available."}</p>
          </div>
        )}
      </div>
    </section>
  )
}