"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { jwtDecode } from "jwt-decode"; 

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: DecodedToken | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
      router.push("/dashboard");
    } catch (error) {
      console.error("Échec de connexion", error);
      throw new Error("Échec de l'authentification");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
