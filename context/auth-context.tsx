"use client"
import { createContext, ReactNode, useContext, useState, useEffect } from "react";

interface User {
  name: ReactNode; id: number; username: string; role: string; 
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally validate token with backend or restore user from token
      // For now, we'll just check if token exists
      // You may want to add token validation here
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
    localStorage.setItem("token", data.token);
    setUser({
      id: data.id, username: data.username, role: data.role,
      name: undefined
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Redirect to home page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

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
