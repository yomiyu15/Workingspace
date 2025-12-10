"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BellRing,
  Calendar,
  ChevronRight,
  DollarSign,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const { logout, isAuthenticated, user, isBootstrapped } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isBootstrapped) return
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login")
    }
  }, [isAuthenticated, user, router, isBootstrapped])

  const handleLogout = () => {
    logout()
    setIsLogoutDialogOpen(false)
  }

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Bookings", href: "/admin/booking", icon: Calendar },
      { label: "Spaces", href: "/admin/spaces", icon: ImageIcon },
      { label: "Categories", href: "/admin/category", icon: ImageIcon },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
      { label: "Features", href: "/admin/features", icon: Sparkles },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
       { label: "Membership", href: "/admin/membership", icon: HelpCircle },

    ],
    [],
  )

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-600">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-slate-500">Loading admin experience…</p>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const currentPage =
    pathname === "/admin"
      ? "Dashboard"
      : pathname?.split("/").pop()?.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
        "Admin"

  const quickStats = [
    { label: "Occupancy", value: "92%", trend: "+4.1%", icon: TrendingUp },
    { label: "Avg. rating", value: "4.8", trend: "New reviews", icon: Star },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-[300px] flex-col border-r border-slate-100 bg-white/95 backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Thrive Coworking Space</p>
            <p className="text-lg font-semibold text-slate-900">Admin Suite</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:text-slate-900 md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          <Badge variant="outline" className="border-emerald-200 text-emerald-600">
            Session active · {user?.username}
          </Badge>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-md"
                      : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  <ChevronRight
                    className={`h-4 w-4 transition ${
                      isActive ? "text-emerald-500/80" : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100 p-4">
          <Button
            variant="destructive"
            className="w-full rounded-2xl bg-red-500 text-white hover:bg-red-600"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Currently viewing</p>
              <h2 className="text-2xl font-semibold text-slate-900">{currentPage}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex gap-2">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs uppercase tracking-wide text-slate-500"
                  >
                    <p className="text-[11px]">{stat.label}</p>
                    <p className="text-base font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-[11px] text-emerald-500">{stat.trend}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="rounded-full border border-slate-200 px-3 text-slate-500 hover:bg-slate-100"
              >
                <BellRing className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="md:hidden rounded-full border border-slate-200 px-3 text-slate-600"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <section className="relative flex-1 overflow-auto bg-gradient-to-br from-white via-slate-50 to-white px-4 py-8 md:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute left-10 top-20 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute bottom-10 right-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{user?.name || user?.username}</p>
                <p className="text-sm text-slate-500">Full access · Workspace orchestration</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Next review</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">14:00</p>
                <p className="text-sm text-slate-500">Bookings refresh window</p>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Status</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-700">Green</p>
                <p className="text-sm text-emerald-600">Systems nominal · auto sync on</p>
              </div>
            </div>

            <div className="relative mb-8 rounded-[32px] border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live notice</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    Auto backups completed · latency optimized.
                  </p>
                </div>
                <Button variant="secondary" className="rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white">
                  View activity log
                </Button>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl">{children}</div>
          </div>
        </section>
      </main>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="bg-white text-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out from admin?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Your secure session will close immediately. Any unsaved updates should be published
              before you proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
              Stay logged in
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              Logout now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
