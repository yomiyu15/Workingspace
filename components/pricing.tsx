'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

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
    return features
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
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
          setPlans(
            data.map((plan: any) => ({
              name: plan.name,
              price: plan.price,
              period: plan.period,
              description: plan.description,
              features: normalizeFeatures(plan.features),
              popular: Boolean(plan.popular),
            })),
          )
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        console.error('Failed to fetch pricing:', err)
        setError('Unable to load pricing plans right now.')
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
    <section id="pricing" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h4 className="text-3xl md:text-4xl font-bold text-center mb-3 text-balance bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Affordable Pricing Plans
          </h4>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-sm md:text-base">
            All prices in Ethiopian Birr (ETB). Choose the plan that fits your work style and budget.
          </p>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground text-sm py-10">Loading pricing plans…</div>
        )}

        {!loading && error && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl py-4">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="text-center text-sm text-muted-foreground bg-muted/20 border border-muted rounded-xl py-6">
            Pricing plans have not been published yet. Please add them from the admin dashboard.
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={`${plan.name}-${index}`}
                className="flex animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div
                  className={`rounded-xl overflow-hidden transition flex flex-col w-full shadow-lg hover:shadow-2xl ${
                    plan.popular
                      ? 'ring-2 ring-accent md:scale-105 bg-gradient-to-br from-accent/10 to-primary/10'
                      : 'bg-card'
                  }`}
                >
                  <div className="p-6 flex flex-col flex-1">
                    {plan.popular && (
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-accent to-primary text-primary-foreground text-xs font-semibold rounded-full mb-3 w-fit">
                        Most Popular
                      </div>
                    )}

                    <div className="flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

                      <div className="mb-5 flex items-baseline gap-2">
                        <span className="text-3xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        <span className="text-xs text-muted-foreground">ETB</span>
                        <span className="text-xs text-muted-foreground">{plan.period}</span>
                      </div>

                      <a
                        href="/#booking"
                        className={`w-full py-3 rounded-lg font-bold mb-6 text-sm text-center inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-accent to-primary text-primary-foreground hover:shadow-lg'
                            : 'border-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/60'
                        }`}
                      >
                        Book Now
                      </a>

                      <div className="space-y-3 flex-1">
                        <div className="max-h-40 overflow-y-auto pr-2">
                          {plan.features.map((feature, idx) => (
                            <div
                              key={`${feature}-${idx}`}
                              className="flex items-start gap-3 py-1 animate-fade-in"
                              style={{ animationDelay: `${0.05 * idx}s` }}
                            >
                              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 font-bold" />
                              <span className="text-sm text-foreground leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
