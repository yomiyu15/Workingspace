"use client"

import Link from "next/link"
import { Sparkles, Heart, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroProps {
  client?: string;
}

export function Hero({ client }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20 pb-16">
      
      {/* Background Polish */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        {/* Floating geometric accents */}
        <div className="absolute top-1/3 left-[5%] w-24 h-24 rounded-3xl border border-primary/20 bg-background/60 rotate-3" />
        <div className="absolute bottom-[12%] right-[8%] w-16 h-16 rounded-full border border-accent/30 bg-background/70 -rotate-6" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Content (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col space-y-8 lg:pr-6">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Workspace
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
                Work. Connect. <br />
                <span className="text-primary italic">Thrive.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Premium coworking and private offices in Addis Ababa—flexible, fast to book, and ready for your next big move.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/booking">
                <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-transform duration-300 hover:scale-105">
                  Book a Tour
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-border hover:bg-muted/60 transition-all duration-300 hover:-translate-y-0.5">
                  View Memberships
                </Button>
              </Link>
            </div>

            {/* Social Proof & Trust */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/100?img=${i+20}`} 
                        alt="member" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">2,718+ Professionals</span>
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold">Joined this month</span>
                </div>
              </div>
              
              <div className="hidden sm:block h-8 w-[1px] bg-border/60" />

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-lg font-bold text-foreground">12</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Cities</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">24/7</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Access</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Bento Grid (6 Columns) */}
          <div className="lg:col-span-6 relative lg:pt-10">
            <div className="relative grid grid-cols-12 gap-4 h-[500px] lg:h-[600px]">
              
              {/* Main Large Image */}
              <div className="col-span-8 row-span-12 relative rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Coworking space" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Smaller Top Image */}
              <div className="col-span-4 row-span-5 relative rounded-2xl overflow-hidden shadow-xl mt-8">
                 <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" 
                    className="w-full h-full object-cover" 
                    alt="Meeting room" 
                 />
              </div>

              {/* Decorative Floating Card */}
              <div className="col-span-4 row-span-4 self-end bg-card/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl z-20 -translate-x-12 mb-12">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">Verified Space</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Fully equipped with high-speed fiber & ergonomic seating.
                </p>
              </div>

              {/* Abstract Heart Icon Overlay */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-background rounded-2xl border border-border shadow-2xl flex items-center justify-center z-30 rotate-12">
                 <Heart className="w-10 h-10 text-primary fill-primary/10" />
              </div>
            </div>

            {/* Background Glow for Images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 rounded-full blur-[100px] -z-10" />
          </div>

        </div>
      </div>
    </section>
  )
}