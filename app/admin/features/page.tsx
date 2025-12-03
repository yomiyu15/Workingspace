"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Plus, Edit, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface Feature {
  id: number
  title: string
  description: string
  icon?: string
}

const INITIAL_FEATURE = {
  title: "",
  description: "",
  icon: "",
}

export default function AdminFeatures() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [form, setForm] = useState(INITIAL_FEATURE)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const authHeaders = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const fetchFeatures = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/features`)
      if (!res.ok) throw new Error("Failed to load features")
      const data = await res.json()
      setFeatures(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Unable to load features")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeatures()
  }, [fetchFeatures])

  const resetForm = () => {
    setForm(INITIAL_FEATURE)
    setEditingId(null)
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!form.title || !form.description) {
    toast({
      title: "Missing information",
      description: "Title and description are required.",
      variant: "destructive",
    })
    return
  }

  setSubmitting(true)
  try {
    const url = editingId ? `${API_BASE_URL}/features/${editingId}` : `${API_BASE_URL}/features`
    const method = editingId ? "PUT" : "POST"

    // Create a Headers object
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) headers.set("Authorization", `Bearer ${token}`)

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Failed to save feature")
    }

    toast({
      title: editingId ? "Feature updated" : "Feature added",
    })
    resetForm()
    fetchFeatures()
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Could not save feature.",
      variant: "destructive",
    })
  } finally {
    setSubmitting(false)
  }
}

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id)
    setForm({
      title: feature.title,
      description: feature.description,
      icon: feature.icon || "",
    })
  }

 const handleDelete = async (id: number) => {
  if (!confirm("Delete this feature?")) return
  try {
    const headers = new Headers()
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) headers.set("Authorization", `Bearer ${token}`)

    const res = await fetch(`${API_BASE_URL}/features/${id}`, {
      method: "DELETE",
      headers,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Failed to delete feature")
    }

    toast({ title: "Feature deleted" })
    fetchFeatures()
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Could not delete feature.",
      variant: "destructive",
    })
  }
}


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Features Management</h1>
          <p className="text-gray-600">Manage workspace features and benefits</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{editingId ? "Add New" : "Add Feature"}</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Flexible Booking"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Lucide name)</label>
            <Input
              value={form.icon}
              onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
              placeholder="Clock, MapPin, Sparkles..."
            />
          </div>
        </div>
        <label className="block text-sm font-medium text-gray-700">Short description</label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the benefit"
          className="min-h-[120px]"
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {editingId ? "Update Feature" : "Add Feature"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading features…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-indigo-50 rounded-lg transition" onClick={() => handleEdit(feature)}>
                    <Edit className="w-4 h-4 text-indigo-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition" onClick={() => handleDelete(feature.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              {feature.icon && (
                <p className="text-xs text-gray-400 mt-3">Icon: {feature.icon}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
