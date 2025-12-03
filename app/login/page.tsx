"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock, LogIn, User } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, user, isBootstrapped } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin")
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!username || !password) {
      setError("Please fill in both username and password.")
      return
    }
    setIsLoading(true)
    try {
      await login(username, password)
      router.replace("/admin")
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please verify your credentials."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isBootstrapped || (isAuthenticated && user?.role === "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-slate-200" />
          <span>Preparing your dashboard…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-12"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/10"
          >
            <Lock className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-wide text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-white/70">
            Access your workspace dashboard securely
          </p>
        </div>

        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm uppercase tracking-wide text-gray-300">Username</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 focus-within:border-white/60">
                <User className="h-4 w-4 text-white/80" />
                <input
                  type="text"
                  placeholder="admin@workspace"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError("")
                  }}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="text-sm uppercase tracking-wide text-gray-300">Password</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 focus-within:border-white/60">
                <Lock className="h-4 w-4 text-white/80" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-white/70 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-white py-4 text-base font-semibold text-black hover:bg-gray-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/5 p-4 text-xs text-white/70">
            {/* Sessions remain active for 30 minutes. You’ll be prompted to sign in again after that
            window for security. */}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
