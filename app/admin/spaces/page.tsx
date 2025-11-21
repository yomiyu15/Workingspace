"use client"

import { useEffect, useState } from "react"
import { Trash, Edit } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Space {
  id: number
  name: string
  price: number
  availability: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newSpace, setNewSpace] = useState({ name: "", price: 0, availability: 0 })
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchSpaces = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE}/spaces`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Failed to fetch spaces")
      const data = await res.json()
      setSpaces(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error fetching spaces")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpaces()
  }, [])

  const handleSubmit = async () => {
    if (!newSpace.name || newSpace.price <= 0 || newSpace.availability < 0) {
      alert("Please fill all fields correctly")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("token")

    try {
      const url = editingSpace ? `${API_BASE}/spaces/${editingSpace.id}` : `${API_BASE}/spaces`
      const method = editingSpace ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newSpace),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save space")
      }

      setNewSpace({ name: "", price: 0, availability: 0 })
      setEditingSpace(null)
      fetchSpaces()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this space?")) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_BASE}/spaces/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Failed to delete space")
      fetchSpaces()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const startEdit = (space: Space) => {
    setEditingSpace(space)
    setNewSpace({ name: space.name, price: space.price, availability: space.availability })
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel: Manage Spaces</h1>

      {error && (
        <Card className="mb-4 border border-red-200 bg-red-50 text-red-700">
          <CardContent>{error}</CardContent>
        </Card>
      )}

      {/* Add / Edit Form */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">{editingSpace ? "Edit Space" : "Add New Space"}</h2>
        </CardHeader>
       <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">Name</label>
    <Input
      placeholder="Enter space name"
      value={newSpace.name}
      onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">Daily Price</label>
    <Input
      type="number"
      placeholder="Enter price"
      value={newSpace.price}
      onChange={(e) => setNewSpace({ ...newSpace, price: Number(e.target.value) })}
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">Availability</label>
    <Input
      type="number"
      placeholder="Enter availability"
      value={newSpace.availability}
      onChange={(e) => setNewSpace({ ...newSpace, availability: Number(e.target.value) })}
    />
  </div>
</CardContent>

        <CardFooter className="flex gap-3">
          <Button onClick={handleSubmit} disabled={submitting} variant="default">
            {editingSpace ? "Update Space" : "Add Space"}
          </Button>
          {editingSpace && (
            <Button
              onClick={() => { setEditingSpace(null); setNewSpace({ name: "", price: 0, availability: 0 }) }}
              variant="secondary"
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Spaces List */}
      {loading ? (
        <p>Loading spaces...</p>
      ) : (
        <div className="space-y-4">
          {spaces.map((space) => (
            <Card key={space.id} className="hover:shadow-md transition">
              <CardContent className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{space.name}</h3>
                  <p>Price: <span className="font-semibold">Br {space.price}</span></p>
                  <p>Availability: <span className="font-semibold">{space.availability}</span></p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" onClick={() => startEdit(space)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(space.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
