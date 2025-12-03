"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Plus, Edit, Trash2, Star } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  text: string
  rating: number
  image?: string
}

const INITIAL_TESTIMONIAL = {
  name: "",
  role: "",
  company: "",
  text: "",
  rating: 5,
  image: "",
}

const resolveImageUrl = (image?: string) => {
  if (!image) return "/placeholder-user.jpg"
  if (/^https?:\/\//i.test(image)) return image
  const apiRoot = API_BASE_URL?.replace(/\/api$/, "") || ""
  const base = apiRoot.replace(/\/+$/, "")
  const path = image.startsWith("/") ? image : `/${image}`
  return `${base}${path}`
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [form, setForm] = useState(INITIAL_TESTIMONIAL)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const authHeaders = useMemo(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [])

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials`)
      if (!res.ok) throw new Error("Failed to load testimonials")
      const data = await res.json()
      setTestimonials(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Unable to load testimonials")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const resetForm = () => {
    setForm(INITIAL_TESTIMONIAL)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.text) {
      toast({
        title: "Missing information",
        description: "Name and testimonial text are required.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = { ...form, rating: Number(form.rating) }
      const url = editingId ? `${API_BASE_URL}/testimonials/${editingId}` : `${API_BASE_URL}/testimonials`
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to save testimonial")
      }

      toast({ title: editingId ? "Testimonial updated" : "Testimonial added" })
      resetForm()
      fetchTestimonials()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not save testimonial.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Unsupported file",
        description: "Please upload a JPG, PNG, WEBP, or GIF image.",
        variant: "destructive",
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Max size is 5MB.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("image", file)
    setUploadingImage(true)
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image")
      }
      setForm((prev) => ({ ...prev, image: data.url }))
      toast({ title: "Image uploaded" })
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "Could not upload image.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setForm({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || "",
      text: testimonial.text,
      rating: testimonial.rating,
      image: testimonial.image || "",
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to delete testimonial")
      }
      toast({ title: "Testimonial deleted" })
      fetchTestimonials()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not delete testimonial.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Testimonials Management</h1>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition shadow-lg shadow-gray-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{editingId ? "Add New" : "Add Testimonial"}</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Abebe Mengistu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <Input
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              placeholder="Startup Founder"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company (optional)</label>
            <Input
              value={form.company}
              onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
              placeholder="TechStart Ethiopia"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer photo</label>
            <div className="flex items-center gap-4">
              <img
                src={resolveImageUrl(form.image)}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageInputChange}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Uploading…" : "Upload photo"}
                </Button>
                {form.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs text-red-600 justify-start px-0"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                  >
                    Remove photo
                  </Button>
                )}
                <p className="text-xs text-gray-500">JPG/PNG up to 5MB. Uploaded files are stored securely.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
          <Textarea
            value={form.text}
            onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
            placeholder="Share the customer's experience..."
            className="min-h-[140px]"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">{error}</div>}

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading testimonials…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={resolveImageUrl(testimonial.image)}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition" onClick={() => handleEdit(testimonial)}>
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
