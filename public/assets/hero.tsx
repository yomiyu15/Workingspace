'use client'

export function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      
      <div className="relative w-full h-full flex items-center">
        
        {/* LEFT SECTION: Text content on white background */}
        <div className="w-full lg:w-1/2 relative z-20 px-6 sm:px-12 py-12 sm:py-20 flex flex-col justify-center bg-background">
          
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 w-fit animate-fade-in mb-6" style={{ animationDelay: '0.2s' }}>
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/15 to-primary/15 border border-accent/40">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">✨ Premium Workspace</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="space-y-4 animate-fade-in mb-6" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-balance leading-tight text-foreground">
              Your Workspace,{' '}
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Perfected
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Discover premium coworking spaces designed for professionals. Book flexible day passes or monthly plans with world-class amenities and vibrant community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <a
              href="#booking"
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-accent to-primary text-primary-foreground font-bold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base hover:scale-105 hover:-translate-y-0.5"
            >
              Explore Spaces
              <span className="inline-block animate-arrow">→</span>
            </a>
            <a
              href="#pricing"
              className="px-6 sm:px-8 py-3 border-2 border-accent/40 text-foreground font-bold rounded-lg hover:bg-accent/10 hover:border-accent/60 transition-all duration-300 text-sm sm:text-base hover:scale-105 hover:-translate-y-0.5"
            >
              View Pricing
            </a>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/40 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
              { value: '50+', label: 'Spaces', icon: '🏢' },
              { value: '1000+', label: 'Members', icon: '👥' },
              { value: '24/7', label: 'Access', icon: '⏰' },
            ].map((stat, index) => (
              <div key={index} className="hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-xl sm:text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION: Blue curved background with image */}
        <div className="hidden lg:flex w-1/2 h-screen relative items-center justify-end overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent rounded-tl-full rounded-bl-full" />

          {/* Decorative blob animations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute bottom-0 -left-32 w-56 h-56 bg-primary-foreground rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-2" />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-end pr-12">
            <div className="relative animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              {/* Gradient border effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent to-primary rounded-2xl opacity-40 blur-xl" />
              
              {/* Image container */}
              <div className="relative bg-background rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-2 w-80 h-96">
                <img
                  src="/modern-premium-coworking-workspace-office-interior.jpg"
                  alt="Modern Premium Workspace"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Floating benefits card */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-br from-accent to-primary rounded-xl p-5 shadow-xl max-w-sm backdrop-blur-md animate-scale-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: '0.8s' }}
              >
                <p className="text-primary-foreground text-xs font-bold mb-3 uppercase tracking-wide">Why Choose Us?</p>
                <div className="grid grid-cols-3 gap-2">
                  {['24/7 Access', 'Premium Amenities', 'Flexible Booking'].map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs text-primary-foreground/90 font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in z-30"
        style={{ animationDelay: '1s' }}
      >
        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Scroll to explore</p>
        <div
          className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-1.5 backdrop-blur-sm animate-bounce-scroll"
        >
          <div
            className="w-1 h-1 bg-accent rounded-full animate-bounce-dot"
          />
        </div>
      </div>
    </section>
  )
}
