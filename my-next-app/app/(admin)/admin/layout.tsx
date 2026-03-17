"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/component/AuthContext";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/app/component/SidebarAdmin"; // Import Sidebar mới
import Header from "@/app/component/HeaderAdmin"; // Import Header mới

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Bảo mật: Kiểm tra quyền Admin
  useEffect(() => {
    if (user === null) return; 
    if (user.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang quản trị!");
      router.push("/"); 
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Header Component */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}