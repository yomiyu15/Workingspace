'use client'

import { useEffect, useState } from "react"
import { Calendar, Search, Filter } from "lucide-react"

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
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

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
    return (
      booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.space.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white text-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-1">Bookings Management</h1>
        <p className="text-gray-500 text-sm md:text-base">Track and manage all customer bookings</p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or space..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-700">
          Error: {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2 animate-spin">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full" />
            </div>
            <p className="text-gray-500 text-sm">Loading bookings...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && !error && (
        <div className="bg-gray-50 rounded-md border border-gray-200 p-8 text-center text-sm">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No bookings found</p>
          <p className="text-gray-400">Try adjusting your search term</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredBookings.length > 0 && (
        <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm text-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100 text-xs md:text-sm">
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Space</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Dates</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100 transition text-xs md:text-sm">
                    <td className="px-4 py-2 font-medium text-gray-900">{booking.user_name}</td>
                    <td className="px-4 py-2 text-gray-700">{booking.email}</td>
                    <td className="px-4 py-2 text-gray-700">{booking.phone}</td>
                    <td className="px-4 py-2">{booking.space}</td>
                    <td className="px-4 py-2">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-900">${booking.total_price}</td>
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
