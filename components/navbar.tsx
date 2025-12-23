"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, LogOut, Phone, Mail, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import logo from "../public/assets/WhatsApp Image 2025-12-07 at 08.32.18.jpeg";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { scrollY } = useScroll();

  const phone = "+1 (123) 456-7890";
  const email = "info@company.com";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  const navItems = [
    { name: 'Spaces', href: '/spaces' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '#faq' },
     { name: 'Membership', href: '/membership' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)',
        boxShadow: scrolled ? '0 10px 40px rgba(15, 23, 42, 0.12)' : '0 0 0 rgba(0,0,0,0)'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-gray-100/70 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg border-2 border-gray-900 group-hover:border-gray-700 transition-all duration-300">
                <img
                  src={logo.src}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-lg text-gray-900">
                Thrive Coworking Space
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div 
                key={item.name}
                className="relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center group relative"
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * navItems.length }}
            >
              <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contactus"
                  className="ml-2 px-5 py-2.5 bg-primary text-dark-400 hover:text-amber-300 text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md shadow-amber-400/30 hover:shadow-lg hover:shadow-amber-400/50"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Auth Buttons & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'member'}</p>
                </div>
                
                <div className="h-8 w-px bg-gray-200" />
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Link
                    href={user?.role === "admin" ? "/admin" : "/bookings"}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300"
                  >
                    {user?.role === "admin" ? "Dashboard" : "My Bookings"}
                  </Link>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                <motion.button
                  onClick={() => logout()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </motion.button>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { duration: 0.3, ease: 'easeInOut' }
              }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Buttons */}
                {!isAuthenticated ? (
                  <div className="px-4 pt-4 space-y-3 border-t border-gray-100">
                    <Link
                      href="/contact"
                      className="block w-full px-4 py-2.5 text-center text-sm font-medium text-amber-400 hover:text-amber-300 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 pt-4 space-y-3 border-t border-gray-100">
                    <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600 capitalize">{user?.role || 'member'}</p>
                    </div>
                    <Link
                      href={user?.role === "admin" ? "/admin" : "/bookings"}
                      className="block w-full px-4 py-2.5 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {user?.role === "admin" ? "Admin Dashboard" : "My Bookings"}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}

                {/* Mobile Contact Info */}
                <div className="px-4 pt-4 space-y-2 border-t border-gray-100">
                  <a 
                    href={`tel:${phone.replace(/\D/g, '')}`}
                    className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2 text-gray-600" />
                    {phone}
                  </a>
                  <a 
                    href={`mailto:${email}`}
                    className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    {email}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
