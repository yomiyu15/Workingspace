"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, Search, Filter, RefreshCw } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { Workspace, normalizeWorkspace } from "@/types/workspace"

interface Booking {
  id: number
  user_name: string
  email: string
  phone: string
  workspace?: Workspace | null
  space?: string
  start_date: string
  end_date: string
  duration_unit?: string
  total_price?: number
  currency?: string
  status: string
  payment_status?: string
  source?: string
}

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"]
const PAYMENT_STATUS_OPTIONS = ["manual", "paid", "refunded", "waived"]

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      const rows = Array.isArray(data) ? data : data.bookings || []
      const normalized = rows.map((row: any) => ({
        ...row,
        workspace: row.workspace ? normalizeWorkspace(row.workspace) : undefined,
      }))
      setBookings(normalized)
    } catch (err: any) {
      console.error("Failed to fetch bookings:", err)
      setError(err.message || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleStatusChange = async (id: number, updates: Partial<Pick<Booking, "status" | "payment_status">>) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Failed to update booking")
      fetchBookings()
    } catch (err: any) {
      alert(err.message || "Error updating booking")
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.space || booking.workspace?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter

      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [bookings, searchTerm, statusFilter, paymentFilter])

  const formatCurrency = (amount?: number, currency = "ETB") => {
    if (!amount) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white text-gray-900">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-1">Bookings Management</h1>
        <p className="text-gray-500 text-sm md:text-base">Track and manage all customer bookings</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, email, or workspace"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-md pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 text-gray-500">
            <Filter className="w-4 h-4" /> Filters
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All payments</option>
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
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
               
                 <th className="px-4 py-2 text-left font-medium text-gray-700">Workspace</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Dates</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Duration</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Source</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const workspaceLabel = booking.workspace?.name || booking.space || "—"
                  const durationLabel = booking.duration_unit ? booking.duration_unit.toUpperCase() : "DAY"
                  return (
                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100 transition text-xs md:text-sm">
                      <td className="px-4 py-2">
                        <p className="font-semibold text-gray-900">{booking.user_name}</p>
                        <p className="text-gray-600">{booking.email}</p>
                        <p className="text-gray-500">{booking.phone}</p>
                      </td>
                      <td className="px-4 py-2">
                        <p className="font-medium text-gray-900">{workspaceLabel}</p>
                        <p className="text-xs text-gray-500">{booking.workspace?.locationName}</p>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(booking.start_date).toLocaleDateString()} · {new Date(booking.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-700">{durationLabel}</td>
                      <td className="px-4 py-2 text-gray-600 capitalize">{booking.source || "website"}</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">
                        {formatCurrency(booking.total_price, booking.currency)}
                      </td>
                      <td className="px-4 py-2 space-y-1">
                        <span
                          className={`inline-flex w-full justify-center rounded-full px-2 py-1 text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`inline-flex w-full justify-center rounded-full px-2 py-1 text-xs font-medium ${
                            booking.payment_status === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : booking.payment_status === "refunded"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.payment_status || "manual"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex flex-col gap-2 md:flex-row">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, { status: e.target.value })}
                          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <select
                          value={booking.payment_status || "manual"}
                          onChange={(e) => handleStatusChange(booking.id, { payment_status: e.target.value })}
                          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                        >
                          {PAYMENT_STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
