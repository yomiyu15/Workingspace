"use client"

import { useEffect, useState } from "react"
import { Trash, Edit, Plus } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_BASE_URL } from "@/lib/config"

type Category = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

const emptyCategory = { id: 0, name: "" }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<Category>(emptyCategory)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/categories`)
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error fetching categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Handle form changes
  const handleChange = (value: string) => {
    setFormState((prev) => ({ ...prev, name: value }))
  }

  // Submit form
  const handleSubmit = async () => {
    if (!formState.name.trim()) {
      alert("Name is required")
      return
    }
    setSubmitting(true)
    try {
      const url = editing ? `${API_BASE_URL}/categories/${formState.id}` : `${API_BASE_URL}/categories`
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to save category")
      }
      setFormState(emptyCategory)
      setEditing(false)
      fetchCategories()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Edit category
  const startEdit = (category: Category) => {
    setFormState(category)
    setEditing(true)
  }

  // Delete category
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete category")
      fetchCategories()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Manage Categories</h1>

      {/* Form */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{editing ? "Edit Category" : "Add Category"}</h2>
            {editing && (
              <Button variant="outline" size="sm" onClick={() => { setFormState(emptyCategory); setEditing(false) }}>
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Category name"
            value={formState.name}
            onChange={(e) => handleChange(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={submitting}>
            {editing ? "Update" : "Add"} <Plus className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Categories list */}
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.id} className="flex justify-between items-center p-4">
              <span>{category.name}</span>
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" onClick={() => startEdit(category)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(category.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
