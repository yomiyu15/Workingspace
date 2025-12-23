"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, ArrowRight } from "lucide-react"
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
    <section className="py-16 md:py-24 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Responsive text sizes */}
        <div className="mb-12 md:mb-20 max-w-2xl">
          <span className="text-primary text-[10px] md:text-[11px] font-semibold tracking-wide mb-2 block uppercase">
            Common questions
          </span>
          <h3 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Answers to your coworking questions
          </h3>
          <p className="text-[13px] md:text-[15px] text-slate-500 leading-relaxed mt-4">
            Everything you need to know about memberships, day passes, meeting rooms, and how the Hub works.
          </p>
        </div>

        {/* FAQ List - Sharp Grid Style */}
        <div className="border-t border-slate-200">
          {loading ? (
            <div className="space-y-4 pt-6">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 border border-slate-100 animate-pulse" />)}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {faqData.map((faq) => (
                <div key={faq.id} className="group">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full py-6 md:py-10 flex items-start justify-between text-left transition-colors hover:text-primary gap-4"
                  >
                    <span className="font-bold text-slate-900 text-sm md:text-xl tracking-tight leading-snug">
                      {faq.question}
                    </span>
                    <div className="shrink-0 mt-1">
                      {openId === faq.id ? (
                        <Minus className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-primary transition-colors" />
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
                        <div className="pb-8 md:pb-12 text-[13px] md:text-[16px] text-slate-500 leading-relaxed max-w-4xl">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Footer - Responsive Flex Direction */}
        <div className="mt-16 md:mt-24 pt-12 md:pt-20 border-t border-slate-100 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10">
          <div className="text-center lg:text-left max-w-xl">
            <h3 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Ready for a workspace that inspires?
            </h3>
            <p className="text-slate-500 text-sm md:text-base">Join a community of ambitious creators and professionals in a space designed for focus.</p>
          </div>
          
          <a
            href="/booking"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 md:px-12 h-14 md:h-16 bg-black text-white font-bold text-[12px] md:text-[13px] hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 whitespace-nowrap"
          >
            Book a private tour
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}