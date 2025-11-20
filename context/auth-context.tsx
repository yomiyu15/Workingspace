"use client"
import { createContext, ReactNode, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 3 * 60 * 1000; // 3 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restore user & check session timeout
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const lastActive = Number(localStorage.getItem("lastActive") || "0");
    const now = Date.now();

    if (storedUser) {
      if (now - lastActive <= SESSION_TIMEOUT) {
        setUser(JSON.parse(storedUser));
        localStorage.setItem("lastActive", now.toString());
      } else {
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Login failed");

    const data = await res.json();

    const userData = {
      id: data.id,
      username: data.username,
      role: data.role,
      name: data.name,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    localStorage.setItem("lastActive", Date.now().toString());
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActive");
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  // Update lastActive on every user interaction
  useEffect(() => {
    const updateActivity = () => {
      if (user) localStorage.setItem("lastActive", Date.now().toString());
    };

    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);

    return () => {
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
