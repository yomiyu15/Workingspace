'use client'

import Link from 'next/link'

interface HeroProps {
  client?: 'tour' | 'membership'
}

export function Hero({ client }: HeroProps) {
  const primaryButton = client === 'membership' 
    ? { text: 'View Memberships →', href: '#pricing' } 
    : { text: 'Book a Tour →', href: '/booking' }

  // Use public folder paths
  const images = [
    '/assets/dane-deaner-_-KLkj7on_c-unsplash.jpg',
    '/assets/copernico-p_kICQCOM4s-unsplash.jpg',
    '/assets/dane-deaner-_-KLkj7on_c-unsplash.jpg',
    '/assets/david-fintz-z-Jaxjj0KVY-unsplash.jpg'
  ]
  const mainImage = '/assets/alesia-kazantceva-VWcPlbHglYc-unsplash.jpg'

  return (
  <section className="relative w-full min-50vh-screen bg-white overflow-hidden pt-20">

      <div className="relative w-full h-full flex items-stretch">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-1/2 relative z-20 py-16 sm:py-20 lg:py-28 px-6 sm:px-10 lg:px-22 flex flex-col justify-center bg-white">
          {/* Floating Badge */}
          <div className="absolute -top-3 left-6 px-4 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full border border-primary/20">
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">🚀 Now Open in Bole</span>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-balance leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Work. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text">Connect.</span> Thrive.
              </h1>
              <div className="absolute -bottom-4 left-0 w-24 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl relative pl-4 border-l-2 border-primary/20">
              <span className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-full"></span>
              Flexible coworking spaces and private office solutions thoughtfully designed to empower you and your team to focus, collaborate, and achieve your best work every day.
            </p>
          </div>
          
           <div className="flex flex-wrap gap-4 my-8">
    <Link 
      href={primaryButton.href}
      className={client === 'membership' 
        ? "px-6 py-2 border border-yellow-600 text-yellow-600 font-semibold rounded-full hover:bg-yellow-600/10 transition-colors text-sm" 
        : "px-6 py-2 bg-black text-yellow-600 font-semibold rounded-full hover:shadow-lg transition-shadow text-sm"
      }
    >
      {primaryButton.text}
    </Link>

    <a 
      href={client === 'membership' ? '/booking' : '#pricing'}
      className={client === 'membership'
        ? "px-6 py-2 bg-yellow-600 text-black font-semibold rounded-full hover:shadow-lg transition-colors text-sm"
        : "px-6 py-2 border border-yellow-600 text-yellow-600 font-semibold rounded-full hover:bg-yellow-600/10 transition-colors text-sm"
      }
    >
      {client === 'membership' ? 'Book a Tour →' : 'View Memberships →'}
    </a>
  </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-border/10 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"></div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '50+', label: 'Spaces', icon: '🏢' },
                { value: '1K+', label: 'Members', icon: '👥' },
                { value: '24/7', label: 'Access', icon: '🔑' }
              ].map((stat, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                    <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mt-1.5 pl-7">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
      {/* RIGHT SECTION */}
<div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-visible">

  {/* NEW YELLOW GRADIENT */}
  <div 
    className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 p-8 text-white"
    style={{ borderRadius: '350px 0 0 350px', transform: 'translateX(40px)' }} 
  />

  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
    <div className="absolute bottom-10 right-32 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
  </div>

  <div className="relative z-10 w-full h-full flex items-center justify-center px-4 gap-4">
    <div className="grid grid-cols-2 gap-3 flex-shrink-0">
      {images.map((src, idx) => (
        <img key={idx} src={src} alt={`Office ${idx + 1}`} className="w-32 h-32 rounded-2xl shadow-lg border-2 border-white/80 object-cover hover:scale-110 transition-transform duration-300" />
      ))}
    </div>
    <div className="flex-shrink-0 h-96 w-64 overflow-hidden rounded-3xl shadow-2xl border-2 border-white/80">
      <img src={mainImage} alt="Premium Coworking Space" className="h-full w-full object-cover animate-fade-in" />
    </div>
  </div>
</div>

      </div>
    </section>
  )
}
