// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Settings, Users, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function AdminHome() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE}/bookings`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (res.ok) {
          const data = await res.json()
          const bookings = Array.isArray(data) ? data : data.bookings || []
          
          setStats({
            totalBookings: bookings.length,
            pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
            confirmedBookings: bookings.filter((b: any) => b.status === "confirmed").length,
            totalRevenue: bookings.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0),
          })
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username || "Admin"}!
        </h1>
        <p className="text-gray-600">Manage your workspace bookings and services from here.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link
          href="/admin/booking"
          className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-indigo-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                Bookings Management
              </h3>
              <p className="text-gray-600 text-sm">
                View and manage all customer bookings, update statuses, and track reservations.
              </p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition" />
          </div>
          <span className="text-indigo-600 text-sm font-medium group-hover:underline">
            Manage Bookings →
          </span>
        </Link>

        <Link
          href="/admin/services"
          className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-indigo-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                Services Management
              </h3>
              <p className="text-gray-600 text-sm">
                Manage available workspaces, pricing, and service offerings.
              </p>
            </div>
            <Settings className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 transition" />
          </div>
          <span className="text-indigo-600 text-sm font-medium group-hover:underline">
            Manage Services →
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
