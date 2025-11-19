"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ImageIcon, Plus, Edit, Trash2 } from "lucide-react"

interface GalleryItem {
  id: number
  title: string
  category: string
  image: string
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, using static data. Replace with API call when backend is ready
    setItems([
      { id: 1, title: "Private Office - Premium", category: "private", image: "/private-office-workspace-addis-ababa-professional.jpg" },
      { id: 2, title: "Hot Desk Area", category: "hot-desk", image: "/hot-desk-coworking-space-collaborative-work.jpg" },
      { id: 3, title: "Board Meeting Room", category: "meeting", image: "/meeting-room-conference-table-professional.jpg" },
      { id: 4, title: "Event & Workshop Space", category: "event", image: "/event-space-workshop-conference-room.jpg" },
      { id: 5, title: "Executive Office Suite", category: "private", image: "/executive-office-suite-luxury-workspace.jpg" },
      { id: 6, title: "Open Workspace", category: "hot-desk", image: "/open-workspace-desk-coworking-collaborative.jpg" },
    ])
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Gallery Management</h1>
          <p className="text-gray-600">Manage workspace images and gallery items</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Item</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3 animate-spin">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full" />
            </div>
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <div className="aspect-video bg-gray-100 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-medium">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                    Delete
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

