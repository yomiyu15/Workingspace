// app/admin/bookings/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function AdminBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error("Error fetching bookings:", err))
  }, [user])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="p-4 bg-white rounded shadow">
              <p><strong>{b.user_name}</strong> ({b.email})</p>
              <p>Phone: {b.phone}</p>
              <p>Space: {b.space}</p>
              <p>Status: {b.status}</p>
              <p>
                Start: {new Date(b.start_date).toLocaleDateString()} - 
                End: {new Date(b.end_date).toLocaleDateString()}
              </p>
              <p>Total: Br {b.total_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
