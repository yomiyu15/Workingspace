"use client"

import { motion } from "framer-motion"
import bg from "../assets/copernico-cLmOptqvuFQ-unsplash.jpg"

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated colorful orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block px-5 py-2.5 bg-black/50 backdrop-blur-sm rounded-full border border-white shadow-lg mb-8"
        >
          <p className="text-white text-sm font-medium drop-shadow">Welcome to Addis Ababa's Premier Workspace</p>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-xl"
        >
          Your Workspace
        </motion.h1>

        {/* Subtitles */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-white mb-4 font-light drop-shadow"
        >
          Book premium working spaces in Addis Ababa by the day or month
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-white mb-8 drop-shadow"
        >
          Flexible. Affordable. Professional. Perfect for startups, freelancers, and businesses.
        </motion.p>

        {/* Buttons */}
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
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:bg-blue-700"
          >
            Book Now
          </motion.a>
          <motion.a
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all"
          >
            View Pricing
          </motion.a>
        </motion.div>

        {/* Stats */}
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
            <motion.div 
              key={i} 
              whileHover={{ y: -5, scale: 1.05 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white shadow-lg"
            >
              <p className="text-3xl font-bold text-white drop-shadow">{stat.value}</p>
              <p className="text-white text-sm mt-1 drop-shadow">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
