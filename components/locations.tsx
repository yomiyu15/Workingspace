"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"

export function Locations() {
  const locations = [
    {
      name: "Bole Area",
      address: "Bole Road, Near the Old Airport",
      spaces: 12,
      amenities: ["WiFi", "Parking", "Cafe"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    },
    {
      name: "Piazza Hub",
      address: "Churchill Avenue, Piazza",
      spaces: 15,
      amenities: ["High-Speed WiFi", "Meeting Rooms", "Lounge"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    },
    {
      name: "CMC Business Center",
      address: "Africa Avenue, CMC District",
      spaces: 10,
      amenities: ["WiFi", "24/7 Security", "Printing"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    },
    {
      name: "Kazanchis Premium",
      address: "Nifas Silk-Lafto, Kazanchis",
      spaces: 8,
      amenities: ["Premium WiFi", "Cafe", "Gym"],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    },
  ]

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">Our Locations in Addis Ababa</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Strategically located workspaces across Addis Ababa for maximum convenience
          </p>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <AnimatedItem key={index}>
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg transition"
              >
                <motion.div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url("${location.image}")` }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold mb-2">{location.name}</h3>
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-600 mb-3">{location.spaces} Spaces Available</p>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05 },
                      },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {location.amenities.map((amenity, idx) => (
                      <motion.span
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                      >
                        {amenity}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  )
}
