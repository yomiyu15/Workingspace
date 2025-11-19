"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Settings, Users, TrendingUp, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

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
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.username || "Admin"}!
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Manage your workspace, bookings, and services from your centralized admin dashboard.
        </p>
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Stat Card 1 */}
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-8 border border-gray-100">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Quick Overview</p>
          <h3 className="text-2xl font-bold text-gray-900">Manage Everything</h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Access all your admin tools in one place to manage bookings, services, pricing, and more.
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
          <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-3">Real-time Updates</p>
          <h3 className="text-2xl font-bold text-gray-900">Stay Connected</h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Monitor your workspace activities and stay updated with all booking and service changes.
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Full Control</p>
          <h3 className="text-2xl font-bold text-gray-900">Easy Management</h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Intuitive tools designed to help you manage your workspace efficiently and effectively.
          </p>
        </div>
      </motion.div>

      {/* Main Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link
          href="/admin/booking"
          className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-gray-600 to-purple-600 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition">
                  Bookings
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                View and manage all customer bookings, update statuses, track reservations, and handle confirmations with ease.
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-6 flex items-center text-gray-600 font-semibold group-hover:gap-2 transition-all">
            <span>Manage Bookings</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg hover:border-gray-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-gray-600 to-purple-600 rounded-xl">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition">
                  Services
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Manage available workspaces, pricing, service offerings, and customize your services for customers.
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-6 flex items-center text-gray-600 font-semibold group-hover:gap-2 transition-all">
            <span>Manage Services</span>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </motion.div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-gray-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
        <p className="text-gray-100 mb-4">
          Explore our documentation and guides to learn more about managing your workspace effectively.
        </p>
        <button className="bg-white text-gray-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition">
          View Documentation
        </button>
      </motion.div>
    </div>
  )
}
