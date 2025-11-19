"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react"

export default function AdminPricing() {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Daily Pass",
      price: "150",
      period: "per day",
      description: "Perfect for short-term needs",
      features: ["High-speed WiFi", "Comfortable Desk & Chair", "Coffee, Tea & Water"],
      popular: false,
    },
    {
      id: 2,
      name: "Weekly Pass",
      price: "600",
      period: "per week",
      description: "Great for project-based work",
      features: ["Everything in Daily", "Priority Desk Selection", "2 Free Meeting Hours/Week"],
      popular: true,
    },
    {
      id: 3,
      name: "Monthly Pass",
      price: "2000",
      period: "per month",
      description: "Ideal for regular workers",
      features: ["Everything in Weekly", "Dedicated Desk Option", "Unlimited Meeting Rooms", "24/7 Access"],
      popular: false,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pricing Management</h1>
          <p className="text-gray-600">Manage pricing plans and packages</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border-2 ${plan.popular ? "border-indigo-500 shadow-lg" : "border-gray-200"} overflow-hidden hover:shadow-xl transition`}
          >
            {plan.popular && (
              <div className="bg-indigo-600 text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">ETB {plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

