"use client"

import Link from "next/link"
import { Sparkles, ArrowRight, MapPin, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-white pt-24 lg:pt-0">
      {/* LEFT CONTENT SIDE */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full lg:w-[48%] px-6 md:px-16 lg:px-20 flex flex-col justify-center"
      >
        <div className="space-y-8 max-w-xl">
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] uppercase tracking-[0.2em] font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Premium Workspace in Addis
          </motion.div>

          {/* Headline with Staggered Entry */}
          <div className="relative">
            <h1 className="relative text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[0.9]">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                Work.
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block"
              >
                Connect.
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block"
              >
                Thrive.
              </motion.span>
            </h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-light"
          >
            Premium coworking and private offices in Addis Ababa. Flexible memberships, 
            instant booking, and everything you need to grow your business.
          </motion.p>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link href="/booking" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Book a Tour
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full px-8 h-14 text-base font-semibold border-border/50 hover:bg-muted/80 transition-all duration-300 hover:-translate-y-0.5 bg-transparent"
              >
                View Memberships
              </Button>
            </Link>
          </motion.div>

          {/* Quick Info Tag */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="pt-10 flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Bole, Addis Ababa</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">High-Speed Fiber</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT IMAGE SIDE */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-10 hidden lg:block"
        style={{
          clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        <div className="relative w-full h-full group">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1600"
            alt="Modern Office Design"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-20" />
          
          {/* NEW "LIVE AVAILABILITY" CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-16 right-16 p-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[240px]"
          >
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Availability</span>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
             </div>
             
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Private Offices</span>
                    <span className="text-sm font-bold text-primary">2 Left</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="h-full bg-primary" 
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Dedicated Desks</span>
                    <span className="text-sm font-bold text-primary">Available</span>
                </div>
             </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -z-10" />
    </section>
  )
}