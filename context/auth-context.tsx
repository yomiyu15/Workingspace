"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  role: "user" | "admin";
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    type: "user" | "admin"
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
    type: "user" | "admin"
  ) => {
    setIsLoading(true);
    try {
      if (type === "admin") {
        const res = await axios.post(`http://localhost:5000/api/admin/login`, {
          username,
          password,
        });

        const adminUser: User = {
          id: res.data.id,
          username: res.data.username,
          role: res.data.role,
          token: res.data.token,
        };
        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);
      } else {
        // normal user login API call
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
