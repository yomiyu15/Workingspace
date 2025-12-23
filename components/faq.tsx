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
    <section className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Consistent with Gallery/Pricing */}
        <div className="mb-16 max-w-2xl">
          <span className="text-primary text-[11px] font-semibold tracking-wide mb-2 block">
            Common questions
          </span>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            Answers to your coworking questions
          </h3>
          <p className="text-[14px] text-slate-500 leading-relaxed mt-3">
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
                    className="w-full py-8 flex items-center justify-between text-left transition-colors hover:text-primary"
                  >
                    <span className="font-bold text-slate-900 text-base md:text-lg tracking-tight">
                      {faq.question}
                    </span>
                    <div className="shrink-0 ml-4">
                      {openId === faq.id ? (
                        <Minus className="w-5 h-5 text-primary" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
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
                        <div className="pb-8 text-[14px] text-slate-500 leading-relaxed max-w-3xl">
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

        {/* CTA Footer - Consistent Sharp Style */}
        <div className="mt-20 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Ready for a workspace that inspires?
            </h3>
            <p className="text-slate-500 text-sm">Join a community of ambitious creators and professionals.</p>
          </div>
          
          <a
            href="/booking"
            className="group flex items-center justify-center gap-3 px-10 h-14 bg-black text-white font-bold text-[13px] hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
          >
            Book a private tour
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}