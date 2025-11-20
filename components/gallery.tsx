"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from 'lucide-react'

const galleryCategories = [
  { id: "all", name: "All Spaces" },
  { id: "private", name: "Private Offices" },
  { id: "meeting", name: "Meeting Rooms" },
  { id: "hot-desk", name: "Hot Desks" },
  { id: "event", name: "Event Spaces" },
]

const galleryItems = [
  { id: 1, category: "private", title: "Private Office - Premium", image: "/premium-private-office-workspace.jpg" },
  { id: 2, category: "hot-desk", title: "Hot Desk Area", image: "/collaborative-hot-desk-coworking.jpg" },
  { id: 3, category: "meeting", title: "Board Meeting Room", image: "/professional-meeting-room-conference.jpg" },
  { id: 4, category: "event", title: "Event & Workshop Space", image: "/modern-event-space-workshop.jpg" },
  { id: 5, category: "private", title: "Executive Office Suite", image: "/luxury-executive-office-suite.jpg" },
  { id: 6, category: "hot-desk", title: "Open Workspace", image: "/open-collaborative-desk-workspace.jpg" },
]

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null)

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <section className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-6 backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 text-sm font-medium">Gallery</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-slate-900">
            <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Explore Our Spaces
            </span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Flexible workspaces designed for productivity, collaboration, and creativity
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
        >
          {galleryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all text-sm ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  duration: 0.,
                  delay: idx * 0.08,
                  type: "spring",
                  stiffness: 100,
                }}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                style={{
                  gridRow: idx === 1 ? 'span 2' : undefined,
                  gridColumn: idx === 4 ? 'span 2' : undefined,
                }}
              >
                {/* Image Container */}
                <div className="relative w-full h-80 md:h-96 overflow-hidden bg-slate-200">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-50 group-hover:opacity-40 transition-opacity duration-300"></div>

                  {/* Accent Border on Hover */}
                  <div className="absolute inset-0 border border-emerald-400/0 group-hover:border-emerald-400/40 transition-colors duration-300 rounded-2xl pointer-events-none"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full"></div>
                        <h3 className="font-bold text-lg md:text-xl">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-200 ml-4">
                        Premium workspace designed for excellence
                      </p>
                    </motion.div>
                  </div>

                  {/* View Icon */}
                  <motion.div
                    className="absolute top-4 right-4 w-10 h-10 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                  >
                    <span className="text-emerald-300 group-hover:text-white text-xl">+</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-auto max-h-90vh rounded-3xl overflow-hidden bg-white border border-slate-200"
            >
              {/* Modal Image */}
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {selectedItem.title}
                </h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Experience premium workspace designed for modern professionals. Perfect for focused work, collaboration, and innovation.
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {['High Speed WiFi', 'Meeting Rooms', 'Parking', 'Coffee Bar', 'Quiet Zone', 'Lounge'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                  Book a Tour
                </button>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 border border-slate-200 rounded-full flex items-center justify-center text-slate-900 hover:bg-emerald-500 hover:border-emerald-400 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <X size={20} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
