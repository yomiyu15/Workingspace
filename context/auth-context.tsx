"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

import apiClient from "@/lib/api-client"
import { SESSION_HEARTBEAT_MS, SESSION_TIMEOUT_MS } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  username: string
  role: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isBootstrapped: boolean
  login: (username: string, password: string) => Promise<void>
  logout: (options?: { silent?: boolean }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_KEY = "user"
const TOKEN_KEY = "token"
const LAST_ACTIVE_KEY = "lastActive"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isBootstrapped, setIsBootstrapped] = useState(false)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(LAST_ACTIVE_KEY)
    setUser(null)
  }

  const logout = ({ silent }: { silent?: boolean } = {}) => {
    clearSession()
    if (!silent) {
      toast({
        title: "Signed out",
        description: "You have been securely logged out.",
      })
    }
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  const hydrateUser = () => {
    const storedUser = localStorage.getItem(USER_KEY)
    const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY) || "0")
    const now = Date.now()

    if (storedUser && now - lastActive <= SESSION_TIMEOUT_MS) {
      setUser(JSON.parse(storedUser))
      localStorage.setItem(LAST_ACTIVE_KEY, now.toString())
    } else if (storedUser) {
      logout({ silent: true })
      toast({
        title: "Session expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      })
    }
    setIsBootstrapped(true)
  }

  useEffect(() => {
    hydrateUser()
  }, [])

  useEffect(() => {
    if (!user) return

    const handleActivity = () => {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString())
    }

    window.addEventListener("click", handleActivity)
    window.addEventListener("keydown", handleActivity)

    return () => {
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("keydown", handleActivity)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
        sessionTimerRef.current = null
      }
      return
    }

    sessionTimerRef.current = setInterval(() => {
      const lastActive = Number(localStorage.getItem(LAST_ACTIVE_KEY) || "0")
      const now = Date.now()
      if (now - lastActive > SESSION_TIMEOUT_MS) {
        logout({ silent: true })
        toast({
          title: "Session expired",
          description: "You were logged out after being inactive.",
          variant: "destructive",
        })
      }
    }, SESSION_HEARTBEAT_MS)

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
        sessionTimerRef.current = null
      }
    }
  }, [user, toast])

  const login = async (username: string, password: string) => {
    const { data } = await apiClient.post("/admin/login", { username, password })

    const userData: User = {
      id: data.id,
      username: data.username,
      role: data.role,
      name: data.name,
    }

    setUser(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString())
    toast({
      title: "Welcome back",
      description: "You are logged in to the admin dashboard.",
    })
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isBootstrapped,
      login,
      logout,
    }),
    [user, isBootstrapped],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
