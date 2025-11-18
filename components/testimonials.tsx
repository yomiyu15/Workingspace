"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"

export function Testimonials() {
  const testimonials = [
    {
      name: "Abebe Mengistu",
      role: "Startup Founder",
      company: "TechStart Ethiopia",
      text: "WorkSpace Hub has been perfect for our growing team. Great amenities and very affordable!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      name: "Hiwot Tadesse",
      role: "Freelance Designer",
      text: "The WiFi is fast, the environment is professional, and the staff is incredibly helpful.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      name: "Melkamu Desta",
      role: "Business Consultant",
      text: "Excellent workspace with professional infrastructure. I've been using it for 3 months and very satisfied.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ]

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">What Our Users Say</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join hundreds of professionals who trust WorkSpace Hub in Addis Ababa
          </p>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedItem key={index}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 bg-white rounded-lg border border-border shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    {testimonial.company && <p className="text-xs text-blue-600 font-medium">{testimonial.company}</p>}
                  </div>
                </div>
                <motion.div
                  className="flex gap-1 mb-3"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { scale: 0 },
                        visible: { scale: 1 },
                      }}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>
                <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  )
}
