"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Plus, Edit, Trash2 } from "lucide-react"

export default function AdminFeatures() {
  const [features, setFeatures] = useState([
    { id: 1, title: "Flexible Booking", description: "Book for a day, week, or month. No long-term contracts needed.", icon: "Clock" },
    { id: 2, title: "Prime Locations", description: "Strategic locations across Addis Ababa. Easy access via public transport.", icon: "MapPin" },
    { id: 3, title: "Professional Community", description: "Network with entrepreneurs, freelancers, and business professionals.", icon: "Users" },
    { id: 4, title: "Verified Spaces", description: "All spaces inspected and equipped with essential modern facilities.", icon: "CheckCircle2" },
    { id: 5, title: "High-Speed Internet", description: "Reliable WiFi connectivity with backup for uninterrupted work.", icon: "Wifi" },
    { id: 6, title: "Secure & Safe", description: "24/7 security, lockers, and professional management for peace of mind.", icon: "Shield" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Features Management</h1>
          <p className="text-gray-600">Manage workspace features and benefits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Feature</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-indigo-50 rounded-lg transition">
                  <Edit className="w-4 h-4 text-indigo-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

