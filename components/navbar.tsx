"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X, LogOut } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900">WorkSpace Hub</span>
              <p className="text-xs text-slate-500">Addis Ababa</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              Spaces
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">
              Pricing
            </a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition">
              FAQ
            </a>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                {user.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/bookings"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                  >
                    My Bookings
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-3 pb-4"
          >
            <a href="#" className="block text-slate-600 hover:text-slate-900">
              Spaces
            </a>
            <a href="#pricing" className="block text-slate-600 hover:text-slate-900">
              Pricing
            </a>
            <a href="#faq" className="block text-slate-600 hover:text-slate-900">
              FAQ
            </a>
            {isAuthenticated && user ? (
              <button onClick={logout} className="w-full text-left text-red-600 hover:text-red-700 font-semibold">
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="block text-blue-600 font-semibold">
                  Sign In
                </Link>
                <Link href="/signup" className="block text-blue-600 font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
