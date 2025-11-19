'use client'
import img from "../assets/dane-deaner-_-KLkj7on_c-unsplash.jpg"
import img2 from "../assets/copernico-p_kICQCOM4s-unsplash.jpg"
import img3 from "../assets/dane-deaner-_-KLkj7on_c-unsplash.jpg"
import img4 from "../assets/david-fintz-z-Jaxjj0KVY-unsplash.jpg"
import image from "../assets/alesia-kazantceva-VWcPlbHglYc-unsplash.jpg"

export function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="relative w-full h-full flex items-stretch">
        
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 relative z-20 py-16 sm:py-20 lg:py-28 px-6 sm:px-10 lg:px-22 flex flex-col justify-center bg-white">
          
          <div className="space-y-4 mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-balance leading-tight text-foreground">
              Your Workspace,{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Perfected
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mb-8">
            Discover premium coworking spaces designed for professionals. Book flexible day passes or monthly plans with world-class amenities and vibrant community.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a 
              href="#booking"
              className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full hover:shadow-lg transition-shadow text-sm"
            >
              Explore Spaces →
            </a>
            <a 
              href="#pricing"
              className="px-6 py-2 border border-primary text-primary font-semibold rounded-full hover:bg-primary/5 transition-colors text-sm"
            >
              View Pricing
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/30">
            {[
              { value: '50+', label: 'Spaces' },
              { value: '1000+', label: 'Members' },
              { value: '24/7', label: 'Access' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-visible">
          
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary to-accent"
            style={{
              borderRadius: '350px 0 0 350px',
              transform: 'translateX(40px)', // tightened spacing
            }}
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
            <div className="absolute bottom-10 right-32 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-4 gap-4">
            
            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <img src={img.src} alt="Office 1" className="w-32 h-32 rounded-2xl shadow-lg border-2 border-white/80 object-cover hover:scale-110 transition-transform duration-300" />
              <img src={img2.src} alt="Office 2" className="w-32 h-32 rounded-2xl shadow-lg border-2 border-white/80 object-cover hover:scale-110 transition-transform duration-300" />
              <img src={img3.src} alt="Office 3" className="w-32 h-32 rounded-2xl shadow-lg border-2 border-white/80 object-cover hover:scale-110 transition-transform duration-300" />
              <img src={img4.src} alt="Office 4" className="w-32 h-32 rounded-2xl shadow-lg border-2 border-white/80 object-cover hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Tall image */}
            <div className="flex-shrink-0 h-96 w-64 overflow-hidden rounded-3xl shadow-2xl border-2 border-white/80">
              <img
                src={image.src}
                alt="Premium Coworking Space"
                className="h-full w-full object-cover animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
