"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Building2, Calendar, Sparkles, Heart, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  client?: string;
}

export function Hero({ client }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background pt-24 pb-12">
      
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] animate-blob" />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-accent/10 blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Premium Workspace
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Work. Connect. <br />
                <span className="text-primary italic">Thrive.</span>
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
                Flexible coworking and private office solutions designed to help you do your best work.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/booking">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-7 h-11">
                  Book a Tour
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="rounded-full px-7 h-11 border-border">
                  View Memberships
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i+10}`} 
                      alt="member" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Join <span className="text-foreground font-bold">2,718+</span> professionals
              </p>
            </div>

            {/* Minimalist Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50 max-w-sm">
              <div>
                <div className="text-xl font-bold text-foreground">12</div>
                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Locations</div>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">24/7</div>
                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Access</div>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">100%</div>
                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Reliable</div>
              </div>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="relative lg:ml-auto">
            <div className="relative z-20 grid grid-cols-2 gap-6 items-center">
              {/* Main Workspace Image */}
              <div className="relative w-full h-[550px] lg:h-[650px] rounded-xl overflow-hidden shadow-2xl rotate-[-3deg] border-[6px] border-white dark:border-card">
                 <img 
                    src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover" 
                    alt="Coworking space" 
                 />
              </div>

              {/* Meeting Room Image */}
              <div className="relative w-full h-[450px] lg:h-[550px] rounded-xl overflow-hidden shadow-xl rotate-[4deg] border-[6px] border-white dark:border-card mt-12">
                 <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" 
                    className="w-full h-full object-cover" 
                    alt="Meeting room" 
                 />
              </div>
            </div>

            {/* Floating Heart Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Heart className="w-16 h-16 text-primary/20 fill-primary/10 rotate-12" />
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  )
}
