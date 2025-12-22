"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, Search, Filter, RefreshCw, Mail, Phone, User, ExternalLink } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { Workspace, normalizeWorkspace } from "@/types/workspace"

interface Booking {
  id: number
  user_name: string
  email: string
  phone: string
  workspace?: Workspace | null
  start_date: string
  end_date: string
  start_time?: string | null
  end_time?: string | null
  duration_unit?: string
  total_price?: number
  subtotal?: number
  tax_amount?: number
  discount_amount?: number
  currency?: string
  status: string
  payment_status?: string
  source?: string
  reference_code?: string
  created_at: string
  notes?: string
}

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"]
const PAYMENT_STATUS_OPTIONS = ["manual", "paid", "refunded", "pending", "failed", "waived"]

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      })
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please log in again.")
        }
        throw new Error(`Failed to fetch: ${res.status}`)
      }
      
      const data = await res.json()
      // Handle both array response and object with bookings property
      const rows = Array.isArray(data) ? data : data.bookings || data.data || []
      
      const normalized = rows.map((row: any) => ({
        ...row,
        workspace: row.workspace ? normalizeWorkspace(row.workspace) : undefined,
        // Ensure all required fields have defaults
        user_name: row.user_name || row.customer_name || "Unknown",
        email: row.email || row.customer_email || "",
        phone: row.phone || row.customer_phone || "",
        status: row.status || "pending",
        payment_status: row.payment_status || "manual",
        total_price: row.total_price || 0,
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

  const handleStatusChange = async (
    id: number, 
    updates: Partial<Pick<Booking, "status" | "payment_status" | "notes">>
  ) => {
    setUpdatingId(id)
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
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || `Update failed: ${res.status}`)
      }
      
      const result = await res.json()
      fetchBookings() // Refresh the list
    } catch (err: any) {
      alert(err.message || "Error updating booking")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    
    setUpdatingId(id)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          cancellation_reason: "Cancelled by admin"
        }),
      })
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || `Cancellation failed: ${res.status}`)
      }
      
      fetchBookings() // Refresh the list
    } catch (err: any) {
      alert(err.message || "Error cancelling booking")
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone?.includes(searchTerm) ||
        booking.reference_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.workspace?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      const matchesPayment = paymentFilter === "all" || booking.payment_status === paymentFilter

      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [bookings, searchTerm, statusFilter, paymentFilter])

  const formatCurrency = (amount?: number, currency = "ETB") => {
    if (!amount && amount !== 0) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "ETB",
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return ""
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "completed": return "bg-blue-100 text-blue-800"
      default: return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "paid": return "bg-emerald-100 text-emerald-800"
      case "refunded": return "bg-indigo-100 text-indigo-800"
      case "failed": return "bg-red-100 text-red-800"
      case "pending": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const totalRevenue = useMemo(() => {
    return filteredBookings
      .filter(b => b.payment_status === "paid")
      .reduce((sum, booking) => sum + (booking.total_price || 0), 0)
  }, [filteredBookings])

  const pendingBookings = useMemo(() => {
    return filteredBookings.filter(b => b.status === "pending").length
  }, [filteredBookings])

  const openDetailsModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
              <p className="text-gray-600">Manage and track all customer bookings</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Revenue (Paid)</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Payments</option>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 text-red-400">!</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
              <p className="text-gray-500">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && !error && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || paymentFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No bookings have been made yet"}
            </p>
            {(searchTerm || statusFilter !== "all" || paymentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPaymentFilter("all")
                }}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && filteredBookings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workspace
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {booking.email}
                            </div>
                            {booking.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {booking.phone}
                              </div>
                            )}
                            {booking.reference_code && (
                              <div className="text-xs text-gray-400 mt-1">
                                Ref: {booking.reference_code}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {booking.workspace?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.workspace?.locationName}
                        </div>
                        {booking.duration_unit && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                            {booking.duration_unit.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </div>
                        {(booking.start_time || booking.end_time) && (
                          <div className="text-sm text-gray-500">
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(booking.total_price, booking.currency)}
                        </div>
                        {booking.discount_amount && booking.discount_amount > 0 && (
                          <div className="text-xs text-emerald-600">
                            Discount: {formatCurrency(booking.discount_amount)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                            {booking.payment_status || "manual"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openDetailsModal(booking)}
                            className="text-gray-600 hover:text-gray-900 text-left flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Details
                          </button>
                          <div className="flex gap-2">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, { status: e.target.value })}
                              disabled={updatingId === booking.id}
                              className="text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
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
                              disabled={updatingId === booking.id}
                              className="text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                            >
                              {PAYMENT_STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={updatingId === booking.id}
                              className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">CUSTOMER INFORMATION</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedBooking.user_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedBooking.email}</p>
                      </div>
                      {selectedBooking.phone && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{selectedBooking.phone}</p>
                        </div>
                      )}
                      {selectedBooking.reference_code && (
                        <div>
                          <p className="text-sm text-gray-600">Reference Code</p>
                          <p className="font-medium font-mono">{selectedBooking.reference_code}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">BOOKING DETAILS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Workspace</p>
                        <p className="font-medium">{selectedBooking.workspace?.name || "N/A"}</p>
                        <p className="text-sm text-gray-500">{selectedBooking.workspace?.locationName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{selectedBooking.duration_unit?.toUpperCase() || "DAY"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dates</p>
                        <p className="font-medium">
                          {formatDate(selectedBooking.start_date)} - {formatDate(selectedBooking.end_date)}
                        </p>
                      </div>
                      {(selectedBooking.start_time || selectedBooking.end_time) && (
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">
                            {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Source</p>
                        <p className="font-medium capitalize">{selectedBooking.source || "website"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">
                          {new Date(selectedBooking.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">PAYMENT INFORMATION</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {selectedBooking.subtotal && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCurrency(selectedBooking.subtotal)}</span>
                          </div>
                        )}
                        {selectedBooking.discount_amount && selectedBooking.discount_amount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(selectedBooking.discount_amount)}</span>
                          </div>
                        )}
                        {selectedBooking.tax_amount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>{formatCurrency(selectedBooking.tax_amount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>{formatCurrency(selectedBooking.total_price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">STATUS</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Booking Status</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                            {selectedBooking.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedBooking.payment_status)}`}>
                            {selectedBooking.payment_status || "manual"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedBooking.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">NOTES</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}