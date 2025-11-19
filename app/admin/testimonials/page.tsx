"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Plus, Edit, Trash2, Star } from "lucide-react"

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Abebe Mengistu",
      role: "Startup Founder",
      company: "TechStart Ethiopia",
      text: "WorkSpace Hub has been perfect for our growing team. Great amenities and very affordable!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Hiwot Tadesse",
      role: "Freelance Designer",
      text: "The WiFi is fast, the environment is professional, and the staff is incredibly helpful.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Melkamu Desta",
      role: "Business Consultant",
      text: "Excellent workspace with professional infrastructure. I've been using it for 3 months and very satisfied.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Testimonials Management</h1>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Testimonial</span>
        </button>
      </div>

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
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-indigo-50 rounded-lg transition">
                  <Edit className="w-4 h-4 text-indigo-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-700 italic">"{testimonial.text}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

