"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, XCircle, Calendar, Search, Filter, MoreVertical } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Booking {
  id: number
  user_name: string
  email: string
  phone: string
  space: string
  start_date: string
  end_date: string
  total_price: number
  status: string
  created_at: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${API_BASE}/bookings`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        // Some APIs return { bookings: [...] }, some just return an array
        setBookings(Array.isArray(data) ? data : data.bookings || [])
      } catch (err: any) {
        console.error("Failed to fetch bookings:", err)
        setError(err.message || "Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.space.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />
      default:
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-700 border border-amber-200"
      default:
        return "bg-red-100 text-red-700 border border-red-200"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white text-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-gray-500">Track and manage all customer bookings</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or space..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3 animate-spin">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full" />
            </div>
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && !error && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No bookings found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredBookings.length > 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Space</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{booking.user_name}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                      <p className="text-sm text-gray-500">{booking.phone}</p>
                    </td>
                    <td className="px-6 py-4">{booking.space}</td>
                    <td className="px-6 py-4">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">${booking.total_price}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
