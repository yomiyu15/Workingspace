"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Gallery } from "@/components/gallery"

export default function SpacesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="px-6 pb-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-3 block">
                Spaces
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                Find your perfect coworking space
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                Browse private offices, meeting rooms, and hot desks at Thrive. Filter by space type, capacity, and more
                directly in the catalog below.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Dynamic inventory</p>
              <p>Spaces update automatically as new options go live from the admin dashboard.</p>
            </div>
          </div>
        </section>

        {/* Reuse the existing dynamic Gallery with categories and clean imagery */}
        <Gallery />
      </main>
      <Footer />
    </div>
  )
}



