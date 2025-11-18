"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const galleryCategories = [
  {
    id: "all",
    name: "All Spaces",
  },
  {
    id: "private",
    name: "Private Offices",
  },
  {
    id: "meeting",
    name: "Meeting Rooms",
  },
  {
    id: "hot-desk",
    name: "Hot Desks",
  },
  {
    id: "event",
    name: "Event Spaces",
  },
]

const galleryItems = [
  {
    id: 1,
    category: "private",
    title: "Private Office - Premium",
    image: "/private-office-workspace-addis-ababa-professional.jpg",
  },
  {
    id: 2,
    category: "hot-desk",
    title: "Hot Desk Area",
    image: "/hot-desk-coworking-space-collaborative-work.jpg",
  },
  {
    id: 3,
    category: "meeting",
    title: "Board Meeting Room",
    image: "/meeting-room-conference-table-professional.jpg",
  },
  {
    id: 4,
    category: "event",
    title: "Event & Workshop Space",
    image: "/event-space-workshop-conference-room.jpg",
  },
  {
    id: 5,
    category: "private",
    title: "Executive Office Suite",
    image: "/executive-office-suite-luxury-workspace.jpg",
  },
  {
    id: 6,
    category: "hot-desk",
    title: "Open Workspace",
    image: "/open-workspace-desk-coworking-collaborative.jpg",
  },
]

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredItems =
    activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <section className="py-12 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-balance">Explore Our Spaces</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover diverse workspace options tailored to your needs and work style
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {galleryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-700 border border-border hover:border-blue-400"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition"
            >
              <div className="relative h-64 overflow-hidden bg-slate-200">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
