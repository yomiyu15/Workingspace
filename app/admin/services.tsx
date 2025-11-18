// app/admin/services/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function AdminServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    fetch("http://localhost:5000/api/services", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err))
  }, [user])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      {services.length === 0 ? (
        <p>No services yet.</p>
      ) : (
        <div className="space-y-4">
          {services.map(s => (
            <div key={s.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p>Price: Br {s.price}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
