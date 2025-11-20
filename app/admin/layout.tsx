"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Settings, LogOut, Menu, X, ChevronRight, ImageIcon, DollarSign, MessageSquare, HelpCircle, Sparkles } from 'lucide-react'
import { useAuth } from "@/context/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, isAuthenticated, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
      router.push("/login")
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/booking", icon: Calendar },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { label: "Features", href: "/admin/features", icon: Sparkles },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-xl transform transition-transform duration-300 z-40 flex flex-col rounded-r-2xl
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">WorkSpace Hub</h1>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg shadow-gray-400/30"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-6 h-6 transition ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                <span className={`flex-1 font-medium text-sm ${isActive ? "text-white" : ""}`}>{item.label}</span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition ${isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`} />
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm rounded-b-2xl">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
              {pathname === "/admin"
                ? "Dashboard"
                : pathname?.split("/").pop()
                  ? pathname.split("/").pop()!.charAt(0).toUpperCase() + pathname.split("/").pop()!.slice(1)
                  : "Admin"}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Manage your workspace content and bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">Admin</span>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10 rounded-tl-3xl">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
