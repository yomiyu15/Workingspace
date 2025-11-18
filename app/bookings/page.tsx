"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Calendar } from 'lucide-react'

export default function BookingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      space: "Premium Desk",
      startDate: "2025-11-20",
      endDate: "2025-11-22",
      totalPrice: 600,
      status: "approved",
    },
    {
      id: 2,
      space: "Meeting Room",
      startDate: "2025-11-25",
      endDate: "2025-11-25",
      totalPrice: 500,
      status: "pending",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-900 border-green-200"
      case "pending":
        return "bg-yellow-50 text-yellow-900 border-yellow-200"
      default:
        return "bg-slate-50 text-slate-900 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-muted-foreground mt-2">View and manage your workspace reservations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">No bookings yet</p>
            <p className="text-slate-500 text-sm">Start by booking a workspace below</p>
          </Card>
        ) : (
          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{booking.space}</CardTitle>
                        <CardDescription>
                          {booking.startDate} to {booking.endDate}
                        </CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">Br {booking.totalPrice}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
