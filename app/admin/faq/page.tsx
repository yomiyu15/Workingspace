"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, Plus, Edit, Trash2, ChevronDown } from "lucide-react"

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "What is the minimum booking duration?",
      answer: "You can book spaces for as little as 1 day. We offer flexible daily, weekly, and monthly passes to suit your needs.",
    },
    {
      id: 2,
      question: "Can I change my booking after confirming?",
      answer: "Yes! You can modify your booking up to 24 hours before your reservation. Log into your account and click 'Edit'.",
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers, mobile money (Telebirr, M-Pesa), and card payments. All transactions are secure.",
    },
    {
      id: 4,
      question: "Is WiFi and utilities included?",
      answer: "Yes! All our workspaces include high-speed WiFi, electricity, water, and 24/7 access to common areas.",
    },
    {
      id: 5,
      question: "Do you offer discounts for long-term rentals?",
      answer: "Our monthly passes offer the best value. Additionally, we provide 10% discount for 3+ months.",
    },
    {
      id: 6,
      question: "What's your cancellation policy?",
      answer: "Cancellations made 48 hours before your booking receive a full refund. Cancellations within 48 hours are subject to a 50% fee.",
    },
  ])
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition shadow-lg shadow-gray-500/30">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add FAQ</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="flex-1 text-left flex items-center gap-3"
              >
                <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  className="ml-auto"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <div className="flex gap-1 ml-4">
                <button className="p-2 hover:bg-gray-50 rounded-lg transition">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <motion.div
              initial={false}
              animate={{
                height: openId === faq.id ? "auto" : 0,
                opacity: openId === faq.id ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-4 py-4 text-gray-700 bg-white">{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

