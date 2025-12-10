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
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.7751666166916!2d38.71471241524784!3d9.013060892529103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b853a71c07f7d%3A0xc4f6d8b30f4063b1!2sThrive%20Coworking%20Space!5e0!3m2!1sen!2set!4v1702015202!5m2!1sen!2set",
    mapLink: "https://www.google.com/maps/contrib/102030795905177538691/place/ChIJF-cCZtSHSxYRegys6vVlrKM/@9.0130609,38.7169007,1199m/data=!3m1!1e3!4m6!1m5!8m4!1e1!2s102030795905177538691!3m1!1e1?hl=en-GB&entry=ttu"
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
              {/* Embedded Google Map */}
              <div className="h-96 w-full">
                <iframe
                  src={location.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Thrive Coworking Space Map"
                ></iframe>
              </div>

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
