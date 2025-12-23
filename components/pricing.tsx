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
    <section id="pricing" className="relative py-24 px-6 bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 w-[360px] h-[360px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute right-0 bottom-0 w-[420px] h-[420px] bg-accent/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold uppercase tracking-[0.25em]">
              Memberships
            </span>
            <h3 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight">
              Simple, transparent pricing for every way you work
            </h3>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
              Pick a plan that matches your rhythm—whether you drop in for a day, host clients weekly, or need a private suite every month.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur px-5 py-4 text-sm text-muted-foreground shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-foreground">All plans include concierge support</div>
                <div>Fast onboarding, flexible upgrades, zero hidden fees.</div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        )}

        {!loading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {plans.map((plan, index) => {
              const isPopular = Boolean(plan.popular)
              return (
                <div
                  key={`${plan.name}-${index}`}
                  className={`relative group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isPopular
                      ? "bg-gradient-to-br from-primary/95 via-primary to-primary/90 text-primary-foreground border-primary/60 shadow-xl shadow-primary/25 scale-[1.03]"
                      : "bg-card/90 border-border/70 hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/90 text-[10px] font-semibold uppercase tracking-[0.25em] shadow-md">
                      Most popular
                    </div>
                  )}

                  <div className="p-7 flex flex-col gap-5">
                    <div className="space-y-2">
                      <h3
                        className={`text-lg md:text-xl font-semibold ${
                          isPopular ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={`text-[13px] leading-relaxed line-clamp-3 ${
                          isPopular ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {plan.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-2xl md:text-3xl font-semibold tracking-tight ${
                          isPopular ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        {typeof plan.price === "number" ? plan.price.toLocaleString() : plan.price}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase ${
                          isPopular ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        ETB / {plan.period}
                      </span>
                    </div>

                    <a
                      href="/booking"
                      className={`mt-1 w-full py-2.5 rounded-xl font-semibold text-[13px] text-center flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? "bg-background text-primary hover:bg-background/90 shadow-lg shadow-background/20"
                          : "bg-muted/60 text-foreground hover:bg-muted"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <div className="mt-3 space-y-3">
                      <p
                        className={`text-[11px] font-bold uppercase tracking-[0.25em] ${
                          isPopular ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        Included
                      </p>
                      <div className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div
                              className={`mt-0.5 rounded-full p-1 ${
                                isPopular ? "bg-background/30" : "bg-primary/10"
                              }`}
                            >
                              <Check
                                className={`w-3.5 h-3.5 ${
                                  isPopular ? "text-background" : "text-primary"
                                }`}
                              />
                            </div>
                            <span
                              className={`text-[12px] leading-snug ${
                                isPopular ? "text-primary-foreground/90" : "text-muted-foreground"
                              }`}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && (error || plans.length === 0) && (
          <div className="p-12 rounded-3xl border border-dashed border-border text-center bg-card/70">
            <p className="text-sm text-muted-foreground">{error || "No plans currently available."}</p>
          </div>
        )}
      </div>
    </section>
  )
}