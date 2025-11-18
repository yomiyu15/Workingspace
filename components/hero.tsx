"use client"

import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block px-4 py-2 bg-gray-500/20 rounded-full border border-gray-400/50 mb-6"
        >
          <p className="text-gray-200 text-sm font-medium">Welcome to Addis Ababa's Premier Workspace</p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance"
        >
          Your Workspace, Your Way
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-200 mb-4 text-pretty"
        >
          Book premium working spaces in Addis Ababa by the day or month
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-gray-300 mb-8 text-pretty"
        >
          Flexible. Affordable. Professional. Perfect for startups, freelancers, and businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg transition shadow-lg"
          >
            Book Now
          </motion.a>
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition"
          >
            View Pricing
          </motion.a>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { value: "50+", label: "Spaces Available" },
            { value: "1000+", label: "Happy Users" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-200 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
