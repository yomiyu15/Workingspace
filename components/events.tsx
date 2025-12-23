"use client"

import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Users, Sparkles } from 'lucide-react'
import Image from 'next/image'

const upcomingEvents = [
  {
    date: "Dec 28",
    time: "6:00 PM",
    title: "Founder's Networking Night",
    category: "Networking",
    location: "Main Lounge",
    image: "/events/networking.jpg", // Replace with your actual paths
    description: "Connect with the brightest minds in Addis Ababa's tech and creative ecosystem."
  },
  {
    date: "Jan 05",
    time: "2:00 PM",
    title: "Digital Strategy Workshop",
    category: "Learning",
    location: "Meeting Room A",
    image: "/events/workshop.jpg",
    description: "A deep dive into scaling your digital presence in the East African market."
  },
  {
    date: "Jan 12",
    time: "4:30 PM",
    title: "Community Coffee Hangout",
    category: "Social",
    location: "The Terrace",
    image: "/events/coffee.jpg",
    description: "An informal gathering for members to share ideas over Ethiopia's finest specialty coffee."
  }
]

export function Events() {
  return (
    <section id="events" className="py-24 px-6 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Perfectly consistent with Features & Gallery */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              Community
            </span>
 <h3 className="text-2xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
              Events & <span className="text-primary">Connections.</span>
            </h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              We host regular events to help members learn, grow, and build valuable connections in the heart of the city.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Users className="w-4 h-4" />
            <span>{upcomingEvents.length} Upcoming Events</span>
          </div>
        </div>

        {/* Events - horizontal carousel on mobile, grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-thin scrollbar-thumb-muted-foreground/30">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer flex-shrink-0 min-w-[260px] sm:min-w-[280px] lg:min-w-0"
            >
              {/* Image Container - Matches Gallery style */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-muted">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                {/* Fallback for Image - replace src with actual event image */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
                
                {/* Date Badge - Floating "Fancy" style */}
                <div className="absolute top-4 left-4 z-30 px-3 py-2 bg-background/90 backdrop-blur-md rounded-xl border border-border shadow-xl text-center min-w-[60px]">
                  <span className="block text-xs font-black text-primary uppercase leading-none">{event.date.split(' ')[0]}</span>
                  <span className="block text-lg font-bold text-foreground tracking-tighter">{event.date.split(' ')[1]}</span>
                </div>

                <div className="absolute bottom-4 left-4 z-30">
                   <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
                     {event.category}
                   </span>
                </div>
              </div>

              {/* Content - Matches Features font hierarchy */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    {event.location}
                  </div>
                </div>

                <h4 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {event.description}
                </p>

                <div className="pt-2">
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground group/link">
                    RSVP Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 text-primary" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Footer Box */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-muted/30 border border-border flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h5 className="text-xl font-bold mb-1">Host your own event?</h5>
              <p className="text-sm text-muted-foreground">Our spaces are available for private workshops and corporate mixers.</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-foreground text-background font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors whitespace-nowrap">
            Inquire About Hosting
          </button>
        </motion.div>
      </div>
    </section>
  )
}