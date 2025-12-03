"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface GalleryItem {
  id: number
  title: string
  category_id: number
  category_name: string
  image_url: string
}

interface Category {
  id: number
  name: string
}

const INITIAL_FORM = {
  title: "",
  category: "",
  imageFile: null as File | null,
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(INITIAL_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const authHeaders = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  // Fetch gallery items
  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/gallery`)
      if (!res.ok) throw new Error("Failed to load gallery")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to load gallery")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch categories dynamically
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/categories`)
      if (!res.ok) throw new Error("Failed to load categories")
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
      if (data.length > 0 && !form.category) {
        setForm((prev) => ({ ...prev, category: data[0].id.toString() }))
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }, [form.category])

  useEffect(() => {
    fetchCategories()
    fetchItems()
  }, [fetchCategories, fetchItems])

  const resetForm = () => {
    setForm({
      title: "",
      category: categories[0]?.id.toString() || "",
      imageFile: null,
    })
    setEditingId(null)
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!form.title || (!form.imageFile && !editingId)) {
    toast({
      title: "Missing information",
      description: "Title and image are required.",
      variant: "destructive",
    })
    return
  }

  setSubmitting(true)
  try {
    const url = editingId ? `${API_BASE_URL}/gallery/${editingId}` : `${API_BASE_URL}/gallery`
    const method = editingId ? "PUT" : "POST"

    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("category_id", form.category)
    if (form.imageFile) formData.append("image", form.imageFile)

    // Safe headers
    const headers = new Headers()
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) headers.set("Authorization", `Bearer ${token}`)

    const res = await fetch(url, {
      method,
      headers, // TS-safe
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Failed to save gallery item")
    }

    toast({
      title: editingId ? "Gallery item updated" : "Gallery item added",
      description: editingId ? "Changes saved successfully." : "Item added to gallery.",
    })

    // Reset form & refresh gallery
    resetForm()
    fetchItems()
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to save gallery item.",
      variant: "destructive",
    })
  } finally {
    setSubmitting(false)
  }
}


  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      category: item.category_id.toString(),
      imageFile: null,
    })
  }
const handleDelete = async (id: number) => {
  if (!confirm("Delete this gallery item?")) return
  try {
    const headers = new Headers()
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) headers.set("Authorization", `Bearer ${token}`)

    const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "DELETE",
      headers, // TS-safe
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Failed to delete item")
    }

    toast({ title: "Gallery item deleted" })
    fetchItems()
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Could not delete item.",
      variant: "destructive",
    })
  }
}


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Manage workspace images and gallery items</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition shadow-lg shadow-gray-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{editingId ? "Add New" : "Add Item"}</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Executive Office Suite"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm((prev) => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
              className="w-full text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>{editingId ? "Update Item" : "Add Item"}</Button>
          {editingId && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
        </div>
      </form>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>}

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3 animate-spin">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-500 rounded-full" />
            </div>
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <div className="aspect-video bg-gray-100 relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                  {item.category_name}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                    onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
