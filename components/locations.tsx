"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react"

const location = {
  name: "Tor Hayiloch",
  address: "Kolfe Keranio, Addis Ababa, Ethiopia",
  phone: "+251 11 123 4567",
  hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-6PM",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.7!3d9.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnMDAuMCJOIDM4wrA0MicwMC4wIkU!5e0!3m2!1sen!2set!4v1625000000000!5m2!1sen!2set",
}

export function Locations() {
  return (
    <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Consistent Header */}
        <div className="mb-16">
          <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
            The Hub
          </span>
  <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
            Our <span className="text-primary">Location.</span>
          </h3>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
            Situated in the heart of Addis Ababa's most vibrant district, easily accessible and surrounded by amenities.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 bg-background rounded-[2.5rem] overflow-hidden border border-border shadow-2xl shadow-primary/5"
        >
          {/* Map Area */}
          <div className="lg:col-span-2 relative h-[400px] lg:h-[500px] bg-muted">
            <iframe
              src={location.mapEmbedUrl}
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              allowFullScreen
              loading="lazy"
            ></iframe>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              className="absolute bottom-6 right-6 px-4 py-2 bg-background/90 backdrop-blur-md border border-border rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Open in Maps <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Contact Info Area */}
          <div className="p-10 lg:p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-8 text-foreground tracking-tight">{location.name}</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Address</p>
                  <span className="text-sm font-medium text-foreground/80 leading-relaxed">{location.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Phone</p>
                  <span className="text-sm font-medium text-foreground/80 leading-relaxed">{location.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Access Hours</p>
                  <span className="text-sm font-medium text-foreground/80 leading-relaxed">{location.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}