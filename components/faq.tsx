"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

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
      setError(null)
      try {
        const res = await fetch(`${API_BASE_URL}/faq`, { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to load FAQ")
        const data = await res.json()
        if (!controller.signal.aborted && Array.isArray(data)) {
          setFaqData(
            data
              .filter((item: any) => item.visible !== false)
              .map((item: any) => ({
                id: item.id,
                question: item.question,
                answer: item.answer,
              })),
          )
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return
        console.error("Failed to fetch FAQs:", err)
        setError("Unable to load FAQs right now.")
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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-balance">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Find answers to common questions about our workspace rental services
          </p>
        </motion.div>

        {loading && (
          <div className="text-center text-sm text-muted-foreground py-8">Loading FAQs…</div>
        )}

        {!loading && error && (
          <div className="text-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl py-4">
            {error}
          </div>
        )}

        {!loading && !error && faqData.length === 0 && (
          <div className="text-center text-sm text-muted-foreground bg-muted/20 border border-muted rounded-xl py-6">
            FAQs are not published yet. Please add them from the admin dashboard.
          </div>
        )}

        {!loading && faqData.length > 0 && (
          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqData.map((faq) => (
              <motion.div
                key={faq.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="border border-border rounded-lg overflow-hidden hover:border-blue-400 transition"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
                >
                  <h3 className="font-semibold text-left text-slate-900">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <ChevronDown className="w-5 h-5 text-blue-600" />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openId === faq.id ? "auto" : 0,
                    opacity: openId === faq.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 py-4 text-slate-600 leading-relaxed bg-white">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center"
        >
          <p className="text-slate-700 mb-3">Still have questions?</p>
          <a
            href="#contact"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Contact Our Support Team
          </a>
        </motion.div>
      </div>
    </section>
  )
}


