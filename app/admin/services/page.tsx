"use client"

import { useEffect, useState } from "react"
import { Loader, AlertCircle, Package } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Service {
  id: number
  name: string
  price: number
  description?: string
  created_at?: string
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/services`)
        if (!res.ok) throw new Error("Failed to fetch services")
        const data = await res.json()
        setServices(Array.isArray(data) ? data : data.services || [])
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to load services")
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-100">Services Management</h1>
        <p className="text-slate-400 mt-2">Manage and monitor all available services</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4 animate-spin border-4 border-slate-700 border-t-cyan-500">
            </div>
            <p className="text-slate-400">Loading services...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && !error && (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-16 text-center">
          <Package className="w-20 h-20 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-lg font-medium">No services yet</p>
          <p className="text-slate-500 text-sm mt-2">Start by creating your first service</p>
        </div>
      )}

      {/* Services Grid */}
      {!loading && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-950/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-xs font-medium border border-slate-600/50">
                  ID: {service.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{service.name}</h3>
              {service.description && (
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                  ${service.price}
                </span>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
