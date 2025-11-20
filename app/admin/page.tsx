"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Settings, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from 'next/navigation'

export default function AdminHome() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
      return
    }
    setLoading(false)
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-1"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Welcome back, {user?.username || "Admin"}!
        </h1>
        <p className="text-sm md:text-base text-gray-600 font-medium">
          Manage your workspace, bookings, and services from your admin dashboard.
        </p>
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Stat Card 1 */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Quick Overview</p>
          <h3 className="text-xl font-bold text-gray-900">Manage Everything</h3>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            Access all your admin tools in one place to manage bookings, services, pricing, and more.
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Real-time Updates</p>
          <h3 className="text-xl font-bold text-gray-900">Stay Connected</h3>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            Monitor workspace activities and stay updated with all booking and service changes.
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Full Control</p>
          <h3 className="text-xl font-bold text-gray-900">Easy Management</h3>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            Intuitive tools designed to help you manage your workspace efficiently.
          </p>
        </div>
      </motion.div>

      {/* Main Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Link
          href="/admin/booking"
          className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-300"
        >
          <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition">
                  Bookings
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                View and manage all customer bookings, update statuses, and handle confirmations.
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-gray-600 font-medium group-hover:gap-2 transition-all">
            <span>Manage Bookings</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-300"
        >
          <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition">
                  Services
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Manage workspaces, pricing, and service offerings for your customers.
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-gray-600 font-medium group-hover:gap-2 transition-all">
            <span>Manage Services</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </motion.div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-700 rounded-xl p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-1">Need Help?</h3>
        <p className="text-sm text-gray-100 mb-3">
          Explore documentation and guides to manage your workspace effectively.
        </p>
        <button className="bg-white text-gray-700 px-4 py-1.5 rounded-md font-medium hover:bg-gray-100 transition">
          View Documentation
        </button>
      </motion.div>
    </div>
  )
}
