"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <span className="font-bold text-lg text-gray-800">WorkSpace Hub</span>
                <p className="text-xs text-gray-500">Addis Ababa</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {["Spaces", "Pricing", "FAQ"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ color: "#06b6d4" }}
                className="text-gray-700 hover:text-cyan-500 transition font-medium text-sm"
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/bookings"}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-semibold text-sm"
                  >
                    {user.role === "admin" ? "Admin Panel" : "My Bookings"}
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 hover:bg-red-100 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </motion.button>
              </div>
            ) : null}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2"
            >
              {isOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-6 space-y-3 pb-4 border-t border-gray-200 pt-4"
          >
            {["Spaces", "Pricing", "FAQ"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                whileHover={{ x: 5 }}
                className="block text-gray-700 hover:text-cyan-500 font-medium transition"
              >
                {item}
              </motion.a>
            ))}
            {isAuthenticated && (
              <motion.button
                onClick={logout}
                whileHover={{ x: 5 }}
                className="w-full text-left text-red-500 hover:text-red-400 font-semibold"
              >
                Logout
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
