"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }

    const fetchBookings = async () => {
      const token = user?.token
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBookings(data)
    }

    fetchBookings()
  }, [user, router])

  const handleStatusChange = async (id: number, status: "approved" | "rejected") => {
    if (!user) return
    await fetch(`${API_BASE}/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status }),
    })
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-900 border-green-200"
      case "pending":
        return "bg-yellow-50 text-yellow-900 border-yellow-200"
      case "rejected":
        return "bg-red-50 text-red-900 border-red-200"
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
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <Card
            key={b.id}
            className={`p-4 ${b.status === "pending" ? "border-yellow-300 border-2" : "border"}`}
          >
            <CardHeader>
              <CardTitle>{b.user_name}</CardTitle>
              <CardDescription>{b.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p>Space: {b.space}</p>
                  <p>Total: Br {b.total_price}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={`${getStatusColor(b.status)} px-2 py-1 rounded-full flex items-center gap-1`}
                    >
                      {getStatusIcon(b.status)} {b.status}
                    </span>
                  </p>
                </div>
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(b.id, "approved")}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(b.id, "rejected")}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
