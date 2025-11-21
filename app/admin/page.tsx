"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Welcome, {user?.username || "Admin"}!
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
        </div>

        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-900">Updates</h3>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border">
          <h3 className="text-lg font-semibold text-gray-900">Controls</h3>
        </div>
      </motion.div>

      {/* Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Link
          href="/admin/booking"
          className="group relative overflow-hidden rounded-xl bg-white border p-6 transition hover:shadow-md"
        >
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Bookings</h3>
            </div>
          </div>
          <div className="flex items-center text-gray-600 font-medium group-hover:gap-2 transition-all mt-4">
            <span>Open</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="group relative overflow-hidden rounded-xl bg-white border p-6 transition hover:shadow-md"
        >
          <div className="relative z-10 flex items-center gap-2 mb-2">
            <div className="p-2 bg-gray-700 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Services</h3>
          </div>
          <div className="flex items-center text-gray-600 font-medium group-hover:gap-2 transition-all mt-4">
            <span>Open</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </Link>
      </motion.div>

      {/* Help box simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-700 rounded-xl p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-2">Help</h3>
        <button className="bg-white text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-100 transition">
          Documentation
        </button>
      </motion.div>
    </div>
  );
}
