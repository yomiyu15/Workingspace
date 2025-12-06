"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"

export function Locations() {
  const location = {
    name: "Thrive Coworking Space",
    address: "Torhayloch, KolfeKeranio, Addis Ababa",
    spaces: 12,
    amenities: ["WiFi", "Parking", "Cafe", "Meeting Rooms"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    mapLink: "https://www.google.com/maps/contrib/102030795905177538691/place/ChIJF-cCZtSHSxYRegys6vVlrKM/@9.0130609,38.7169007,1199m/data=!3m1!1e3!4m6!1m5!8m4!1e1!2s102030795905177538691!3m1!1e1?hl=en-GB&entry=ttu",
  }

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-balance">
            Our Location in Addis Ababa
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Strategically located workspace for maximum convenience
          </p>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 gap-8">
          <AnimatedItem>
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
                  <a
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {location.address}
                  </a>
                </div>
                <p className="text-sm font-semibold text-blue-600 mb-3">
                  {location.spaces} Spaces Available
                </p>
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
        </AnimatedStagger>
      </div>
    </section>
  )
}
