"use client"

import { 
  Wifi, 
  Coffee, 
  Zap, 
  ShieldCheck, 
  Monitor, 
  Users2, 
  Clock, 
  Printer 
} from "lucide-react"

const amenities = [
  {
    title: "High-Speed WiFi",
    description: "Enterprise-grade fiber optic internet with backup redundancy.",
    icon: <Wifi className="w-6 h-6" />,
  },
  {
    title: "Artisan Coffee",
    description: "Unlimited premium coffee, specialty teas, and infused water.",
    icon: <Coffee className="w-6 h-6" />,
  },
  {
    title: "24/7 Access",
    description: "Work on your own schedule with secure keyless entry anytime.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    title: "Smart Meeting Rooms",
    description: "Fully equipped rooms with 4K displays and video conferencing.",
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    title: "Community Events",
    description: "Weekly networking mixers, workshops, and social gatherings.",
    icon: <Users2 className="w-6 h-6" />,
  },
  {
    title: "Printing Station",
    description: "Professional grade printing, scanning, and shredding services.",
    icon: <Printer className="w-6 h-6" />,
  },
]

export function Amenities() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest text-xs uppercase mb-3">
              Designed for productivity
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Everything you need to <br />
              <span className="text-primary italic">focus and grow.</span>
            </h3>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm md:text-base border-l-2 border-primary/20 pl-4">
            We've taken care of all the details so you can focus on what matters most: your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item, index) => (
            <div 
              key={index}
              className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">
                {item.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}