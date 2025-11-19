'use client'

import { Check } from 'lucide-react'

export function Pricing() {
  const plans = [
    {
      name: "Daily Pass",
      price: "150",
      period: "per day",
      description: "Perfect for short-term needs",
      features: [
        "High-speed WiFi & Internet",
        "Comfortable Desk & Chair",
        "Coffee, Tea & Water",
        "Free Parking",
        "No Contract Required",
        "Access 7 AM - 6 PM",
      ],
    },
    {
      name: "Weekly Pass",
      price: "600",
      period: "per week",
      description: "Great for project-based work",
      features: [
        "Everything in Daily",
        "Priority Desk Selection",
        "Lounge & Rest Area Access",
        "2 Free Meeting Hours/Week",
        "Mail & Package Service",
        "Extended Hours (7 AM - 8 PM)",
      ],
      popular: true,
    },
    {
      name: "Monthly Pass",
      price: "2000",
      period: "per month",
      description: "Ideal for regular workers",
      features: [
        "Everything in Weekly",
        "Dedicated Desk Option",
        "Unlimited Meeting Rooms",
        "Private Locker Storage",
        "Printing Allowance (100 pages)",
        "24/7 Access",
        "Networking Events Access",
      ],
    },
  ]

  return (
    <section id="pricing" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h4 className="text-3xl md:text-4xl font-bold text-center mb-3 text-balance bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Affordable Pricing Plans
          </h4>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-sm md:text-base">
            All prices in Ethiopian Birr (ETB). Choose the plan that fits your work style and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex animate-fade-in hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div
                className={`rounded-xl overflow-hidden transition flex flex-col w-full shadow-lg hover:shadow-2xl ${
                  plan.popular
                    ? "ring-2 ring-accent md:scale-105 bg-gradient-to-br from-accent/10 to-primary/10"
                    : "bg-card"
                }`}
              >
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-accent to-primary text-primary-foreground text-xs font-semibold rounded-full mb-3 w-fit">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-5 flex items-baseline gap-2">
                      <span className="text-3xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">ETB</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>

                    <button
                      className={`w-full py-3 rounded-lg font-bold mb-6 text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                        plan.popular
                          ? "bg-gradient-to-r from-accent to-primary text-primary-foreground hover:shadow-lg"
                          : "border-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/60"
                      }`}
                    >
                      Book Now
                    </button>

                    {/* Features list */}
                    <div className="space-y-3 flex-1">
                      <div className="max-h-40 overflow-y-auto pr-2">
                        {plan.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 py-1 animate-fade-in"
                            style={{ animationDelay: `${0.05 * idx}s` }}
                          >
                            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 font-bold" />
                            <span className="text-sm text-foreground leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
