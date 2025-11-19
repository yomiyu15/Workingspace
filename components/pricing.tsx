"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { AnimatedStagger, AnimatedItem } from "./animation-wrapper"

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
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
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
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
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
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    },
  ]

  return (
    <section id="pricing" className="py-12 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-balance">
            Affordable Pricing Plans
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto text-sm md:text-base">
            All prices in Ethiopian Birr (ETB). Choose the plan that fits your work style and budget.
          </p>
        </motion.div>

        <AnimatedStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => (
            <AnimatedItem key={index} className="flex">
              <motion.div
                whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.12)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`rounded-lg overflow-hidden transition flex flex-col w-full ${
                  plan.popular ? "ring-2 ring-blue-600 md:scale-105" : ""
                }`}
              >
                {/* Image */}
                <motion.div
                  className="h-32 bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url("${plan.image}")` }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <div className="p-4 bg-white flex flex-col flex-1 min-h-0">
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-2 w-fit"
                    >
                      Most Popular
                    </motion.div>
                  )}
                  
                  <div className="flex flex-col flex-1 min-h-0">
                    <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{plan.description}</p>

                    {/* Price with ETB */}
                    <div className="mb-4 flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">ETB</span>
                      <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-2 rounded-lg font-semibold mb-4 text-sm transition ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Book Now
                    </motion.button>

                    <motion.div
                      className="space-y-1.5 flex-1 overflow-hidden"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
                      }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <div className="max-h-32 overflow-y-auto pr-2">
                        {plan.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                            className="flex items-start gap-2 py-0.5"
                          >
                            <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs leading-tight">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  )
}