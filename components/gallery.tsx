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
    <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gray-200/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-300/30 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-4 text-gray-700 text-sm font-semibold shadow-sm"
          >
            Gallery
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Explore Our Spaces
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Flexible workspaces designed for productivity, collaboration, and creativity.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4"
        >
          {galleryCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                activeCategory === cat.id
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Horizontal Carousel Gallery */}
        <motion.div 
          className="relative mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            <div className="flex gap-4 md:gap-6 px-4" style={{ width: "max-content" }}>
              <AnimatePresence mode="wait">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: idx * 0.05,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 snap-start flex-shrink-0"
                    style={{ width: "340px", height: "300px" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="font-bold text-base md:text-lg mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                      </h3>
                      <div className="w-10 h-0.5 bg-white rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75"></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Scroll hint */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <span className="hidden sm:inline">← Scroll horizontally to see more →</span>
              <span className="sm:hidden">← Swipe to see more →</span>
            </p>
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
