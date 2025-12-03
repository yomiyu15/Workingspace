"use client"

import { useEffect, useMemo, useState } from "react"
import { Trash, Edit, MapPin, Sparkles } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { API_BASE_URL } from "@/lib/config"
import { Workspace, normalizeWorkspace } from "@/types/workspace"

type WorkspaceForm = {
  name: string
  category: string
  description: string
  capacity: string
  inventoryCount: string
  priceHour: string
  priceDay: string
  priceMonth: string
  leadTime: string
  locationId: string
  amenities: string
  tags: string
  images: string
  isFeatured: boolean
  isActive: boolean
}

type Location = {
  id: number
  name: string
  city: string
}

const emptyForm: WorkspaceForm = {
  name: "",
  category: "private",
  description: "",
  capacity: "",
  inventoryCount: "1",
  priceHour: "",
  priceDay: "",
  priceMonth: "",
  leadTime: "Instant confirmation",
  locationId: "",
  amenities: "",
  tags: "",
  images: "",
  isFeatured: false,
  isActive: true,
}

const splitToArray = (value: string) =>
  value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)

export default function AdminSpaces() {
  const [spaces, setSpaces] = useState<Workspace[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<WorkspaceForm>(emptyForm)
  const [editingSpace, setEditingSpace] = useState<Workspace | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fetchSpaces = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Failed to fetch workspaces")
      const data = await res.json()
      setSpaces(Array.isArray(data) ? data.map((item) => normalizeWorkspace(item)) : [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error fetching spaces")
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/locations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Failed to fetch locations")
      const data = await res.json()
      setLocations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load locations:", error)
    }
  }

  useEffect(() => {
    fetchSpaces()
    fetchLocations()
  }, [])

  const handleChange = (field: keyof WorkspaceForm, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const buildPayload = () => ({
    name: formState.name,
    category: formState.category,
    description: formState.description,
    capacity: formState.capacity ? Number(formState.capacity) : null,
    inventory_count: formState.inventoryCount ? Number(formState.inventoryCount) : 1,
    price_hour: formState.priceHour ? Number(formState.priceHour) : null,
    price_day: formState.priceDay ? Number(formState.priceDay) : null,
    price_month: formState.priceMonth ? Number(formState.priceMonth) : null,
    lead_time: formState.leadTime,
    location_id: formState.locationId ? Number(formState.locationId) : null,
    amenities: splitToArray(formState.amenities),
    tags: splitToArray(formState.tags),
    images: splitToArray(formState.images),
    is_featured: formState.isFeatured,
    is_active: formState.isActive,
  })

  const handleSubmit = async () => {
    if (!formState.name || !formState.category) {
      alert("Please provide a name and category.")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("token")

    try {
      const url = editingSpace ? `${API_BASE_URL}/workspaces/${editingSpace.id}` : `${API_BASE_URL}/workspaces`
      const method = editingSpace ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(buildPayload()),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save workspace")
      }

      setFormState(emptyForm)
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
      const res = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error("Failed to delete space")
      fetchSpaces()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const startEdit = (workspace: Workspace) => {
    const fallbackLocationId =
      workspace.locationId?.toString() ||
      locations.find((loc) => loc.name === workspace.locationName || loc.id === workspace.locationId)?.id?.toString() ||
      ""
    setEditingSpace(workspace)
    setFormState({
      name: workspace.name,
      category: workspace.category || "private",
      description: workspace.description || "",
      capacity: workspace.capacity?.toString() || "",
      inventoryCount: workspace.inventoryCount?.toString() || "1",
      priceHour: workspace.priceHour?.toString() || "",
      priceDay: workspace.priceDay?.toString() || "",
      priceMonth: workspace.priceMonth?.toString() || "",
      leadTime: workspace.leadTime || "Instant confirmation",
      locationId: fallbackLocationId,
      amenities: workspace.amenities.join(", "),
      tags: workspace.tags.join(", "),
      images: workspace.images.join(", "),
      isFeatured: Boolean(workspace.isFeatured),
      isActive: workspace.isActive ?? true,
    })
  }

  const resetForm = () => {
    setFormState(emptyForm)
    setEditingSpace(null)
  }

  const imageList = useMemo(() => splitToArray(formState.images), [formState.images])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    setUploadingImage(true)
    setUploadError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.message || "Upload failed")
      }
      const nextImages = [...imageList, data.url]
      handleChange("images", nextImages.join(", "))
    } catch (err: any) {
      setUploadError(err.message || "Upload failed")
    } finally {
      setUploadingImage(false)
      event.target.value = ""
    }
  }

  const removeImage = (url: string) => {
    const next = imageList.filter((item) => item !== url)
    handleChange("images", next.join(", "))
  }

  const spacesSummary = useMemo(
    () => ({
      total: spaces.length,
      featured: spaces.filter((s) => s.isFeatured || s.tags.includes("featured")).length,
      meetingRooms: spaces.filter((s) => s.category === "meeting").length,
    }),
    [spaces],
  )

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Workspaces</h1>
        <p className="text-sm text-gray-500">
          {spacesSummary.total} spaces · {spacesSummary.featured} premium · {spacesSummary.meetingRooms} meeting rooms
        </p>
      </div>

      {error && (
        <Card className="mb-4 border border-red-200 bg-red-50 text-red-700">
          <CardContent>{error}</CardContent>
        </Card>
      )}

      {/* Add / Edit Form */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {editingSpace ? `Edit: ${editingSpace.name}` : "Add New Workspace"}
              </h2>
              <p className="text-sm text-gray-500">Syncs with the `workspaces` table</p>
            </div>
            {editingSpace && (
              <Button variant="outline" size="sm" onClick={resetForm}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input value={formState.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Ultra private suite" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={formState.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              {["private", "meeting", "hot-desk", "event"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Capacity</label>
            <Input
              type="number"
              value={formState.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              placeholder="8"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Inventory (simultaneous bookings)</label>
            <Input
              type="number"
              min={1}
              value={formState.inventoryCount}
              onChange={(e) => handleChange("inventoryCount", e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Lead time</label>
            <Input value={formState.leadTime} onChange={(e) => handleChange("leadTime", e.target.value)} placeholder="Instant confirmation" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Hourly rate (Br)</label>
            <Input type="number" value={formState.priceHour} onChange={(e) => handleChange("priceHour", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Daily rate (Br)</label>
            <Input type="number" value={formState.priceDay} onChange={(e) => handleChange("priceDay", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Monthly rate (Br)</label>
            <Input type="number" value={formState.priceMonth} onChange={(e) => handleChange("priceMonth", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <select
              value={formState.locationId}
              onChange={(e) => handleChange("locationId", e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} · {loc.city}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea
              rows={3}
              value={formState.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Premium floor with skyline views..."
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Amenities (comma or line separated)</label>
            <Textarea rows={2} value={formState.amenities} onChange={(e) => handleChange("amenities", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <Input value={formState.tags} onChange={(e) => handleChange("tags", e.target.value)} placeholder="enterprise, skyline, natural light" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Image URLs</label>
            <Textarea rows={2} value={formState.images} onChange={(e) => handleChange("images", e.target.value)} placeholder="/premium.jpg, /suite.jpg" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Upload image</label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
            {uploadingImage && <p className="text-sm text-gray-500">Uploading...</p>}
            {!!imageList.length && (
              <div className="flex flex-wrap gap-2 pt-2">
                {imageList.map((url) => (
                  <span key={url} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {url}
                    <button type="button" className="text-red-500" onClick={() => removeImage(url)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formState.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
              Active
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button onClick={handleSubmit} disabled={submitting}>
            {editingSpace ? "Update workspace" : "Add workspace"}
          </Button>
          {editingSpace && (
            <Button onClick={resetForm} variant="secondary">
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
              <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {space.isFeatured || space.tags.includes("featured") ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    ) : null}
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {space.category}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold">{space.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {space.locationName || "Unassigned"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-700">
                    <span>Capacity: <strong>{space.capacity || "Flexible"}</strong></span>
                    <span>Inventory: <strong>{space.inventoryCount || 1}</strong></span>
                    <span>Hour: <strong>{space.priceHour ? `Br ${space.priceHour}` : "-"}</strong></span>
                    <span>Day: <strong>{space.priceDay ? `Br ${space.priceDay}` : "-"}</strong></span>
                    <span>Month: <strong>{space.priceMonth ? `Br ${space.priceMonth}` : "-"}</strong></span>
                    <span>Lead time: <strong>{space.leadTime || "Instant"}</strong></span>
                  </div>
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
