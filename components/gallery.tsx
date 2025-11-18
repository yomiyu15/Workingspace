"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const galleryCategories = [
  { id: "all", name: "All Spaces" },
  { id: "private", name: "Private Offices" },
  { id: "meeting", name: "Meeting Rooms" },
  { id: "hot-desk", name: "Hot Desks" },
  { id: "event", name: "Event Spaces" },
]

const galleryItems = [
  { id: 1, category: "private", title: "Private Office - Premium", image: "/private-office-workspace-addis-ababa-professional.jpg" },
  { id: 2, category: "hot-desk", title: "Hot Desk Area", image: "/hot-desk-coworking-space-collaborative-work.jpg" },
  { id: 3, category: "meeting", title: "Board Meeting Room", image: "/meeting-room-conference-table-professional.jpg" },
  { id: 4, category: "event", title: "Event & Workshop Space", image: "/event-space-workshop-conference-room.jpg" },
  { id: 5, category: "private", title: "Executive Office Suite", image: "/executive-office-suite-luxury-workspace.jpg" },
  { id: 6, category: "hot-desk", title: "Open Workspace", image: "/open-workspace-desk-coworking-collaborative.jpg" },
]

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Explore Our Spaces</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Flexible workspaces designed for productivity, collaboration, and creativity.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {galleryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium transition text-sm ${
                activeCategory === cat.id
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Horizontal Scroll Gallery */}
        <motion.div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          <AnimatePresence initial={false}>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex-shrink-0 w-64 h-40 sm:w-72 sm:h-48 relative rounded-lg shadow-md overflow-hidden snap-start cursor-pointer hover:shadow-xl transition"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-white font-semibold text-sm sm:text-base">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
