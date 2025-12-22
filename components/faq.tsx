"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Plus, Minus } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"

type FAQItem = {
  id: number
  question: string
  answer: string
}

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)
  const [faqData, setFaqData] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/faq`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        if (!controller.signal.aborted) {
          setFaqData(data.filter((i: any) => i.visible !== false))
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError("Unable to load.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  return (
    <section className="py-24 px-6 bg-background border-t border-border/50">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-20">
          <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block text-center md:text-left">
           faq
          </span>
          <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
           FAQ <span className="text-primary italic"></span>
          </h3>
         
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {faqData.map((faq) => (
              <div 
                key={faq.id} 
                className={`transition-all duration-300 rounded-[1.5rem] border ${
                  openId === faq.id ? 'border-primary bg-muted/30' : 'border-border bg-card/50'
                }`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-bold text-foreground text-sm md:text-base tracking-tight">{faq.question}</span>
                  <div className={`shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}>
                    {openId === faq.id ? (
                      <Minus className="w-4 h-4 text-primary" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {/* CTA Footer - Consistent with Pricing */}
        <div className="mt-20 pt-16 border-t border-border flex flex-col items-center">
          <h3 className="text-xl md:text-3xl font-bold mb-8 tracking-tighter">Ready for a workspace that inspires?</h3>
          <a
            href="/booking"
            className="px-12 py-5 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors inline-block"
          >
            Book a private tour
          </a>
        </div>
      </div>
    </section>
  )
}