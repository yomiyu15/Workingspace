// app/amenities/page.tsx
"use client";

import { motion } from "framer-motion";
import { Wifi, Monitor, Phone, Printer, Coffee, Sofa, ArrowRight } from "lucide-react";
import Link from "next/link";

const amenities = [
  {
    icon: <Wifi className="w-8 h-8 text-amber-600" />,
    title: "High-speed WiFi",
    description: "Blazing fast internet connection throughout the space"
  },
  {
    icon: <Monitor className="w-8 h-8 text-amber-600" />,
    title: "Conference Rooms",
    description: "Professional meeting spaces for your business needs"
  },
  {
    icon: <Phone className="w-8 h-8 text-amber-600" />,
    title: "Private Phone Booths",
    description: "Soundproof booths for calls and focused work"
  },
  {
    icon: <Printer className="w-8 h-8 text-amber-600" />,
    title: "Printing & Scanning",
    description: "High-quality printing and scanning facilities"
  },
  {
    icon: <Coffee className="w-8 h-8 text-amber-600" />,
    title: "Complimentary Refreshments",
    description: "Coffee, tea, and snacks available all day"
  },
  {
    icon: <Sofa className="w-8 h-8 text-amber-600" />,
    title: "Lounge Areas",
    description: "Comfortable spaces to relax and network"
  }
];

export default function AmenitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Our Amenities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to work productively in a comfortable environment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                {amenity.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {amenity.title}
              </h3>
              <p className="text-gray-600 text-center">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to experience our space?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of professionals and enjoy all these amenities and more.
          </p>
          <Link
            href="/contactus"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-400 hover:bg-amber-400 shadow-sm hover:shadow-md transition-all"
          >
            Book a Tour
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}