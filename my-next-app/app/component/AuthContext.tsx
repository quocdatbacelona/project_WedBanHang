// Địa chỉ file: app/component/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem, User } from "@/app/types"; 

interface AuthContextType {
  user: User | null; 
  login: (userData: User) => void;
  logout: () => void;
  setUserCart: (cart: CartItem[]) => void;
  // ⬇️ BẠN ĐÃ THIẾU DÒNG NÀY:
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = "my-app-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Không thể đọc user từ localStorage:", error);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const setUserCart = (cart: CartItem[]) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, cart: cart };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // ⬇️ BẠN ĐÃ THIẾU HÀM NÀY:
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  return (
    // Nhớ thêm updateUser vào value
    <AuthContext.Provider value={{ user, login, logout, setUserCart, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
};