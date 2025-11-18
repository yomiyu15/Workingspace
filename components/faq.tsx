"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from 'lucide-react'

const faqData = [
  {
    id: 1,
    question: "What is the minimum booking duration?",
    answer:
      "You can book spaces for as little as 1 day. We offer flexible daily, weekly, and monthly passes to suit your needs. Single-day bookings include the option to choose specific hours.",
  },
  {
    id: 2,
    question: "Can I change my booking after confirming?",
    answer:
      "Yes! You can modify your booking up to 24 hours before your reservation. Log into your account, go to 'My Bookings', and click 'Edit'. Changes are subject to availability.",
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, mobile money (Telebirr, M-Pesa), and card payments. All transactions are secure and encrypted. You'll receive an invoice immediately after booking.",
  },
  {
    id: 4,
    question: "Is WiFi and utilities included?",
    answer:
      "Yes! All our workspaces include high-speed WiFi, electricity, water, and 24/7 access to common areas. Premium desks also include a complimentary coffee machine.",
  },
  {
    id: 5,
    question: "Do you offer discounts for long-term rentals?",
    answer:
      "Our monthly passes offer the best value. Additionally, we provide 10% discount for 3+ months and 15% for 6+ months. Contact us for custom packages.",
  },
  {
    id: 6,
    question: "What's your cancellation policy?",
    answer:
      "Cancellations made 48 hours before your booking receive a full refund. Cancellations within 48 hours are subject to a 50% cancellation fee. No-shows are non-refundable.",
  },
]

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

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
