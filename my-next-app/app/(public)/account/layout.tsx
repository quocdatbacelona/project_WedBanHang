// Địa chỉ file: app/account/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/component/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaLock, FaHistory } from "react-icons/fa";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Để biết đang ở trang nào mà active menu

  if (!user) {
     // Nếu chưa có user, return null để useEffect trong page con xử lý redirect
     return null; 
  }

  // Hàm kiểm tra active link
  const isActive = (path: string) => pathname === path ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50";

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* === SIDEBAR (Dùng chung) === */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24"> {/* sticky để trượt theo */}
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
               <div className="w-10 h-10 bg-lime-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.email[0].toUpperCase()}
               </div>
               <div className="overflow-hidden">
                 <p className="font-bold text-gray-800 truncate">Tài khoản của tôi</p>
                 <p className="text-xs text-gray-500 truncate">{user.email}</p>
               </div>
            </div>
            
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <Link href="/account" className={`flex items-center gap-3 p-3 rounded-lg ${isActive('/account')}`}>
                    <FaUser /> Thông tin tài khoản
                  </Link>
                </li>
                <li>
                  <Link href="/account/password" className={`flex items-center gap-3 p-3 rounded-lg ${isActive('/account/password')}`}>
                    <FaLock /> Đổi mật khẩu
                  </Link>
                </li>
                <li>
                  <Link href="/account/orders" className={`flex items-center gap-3 p-3 rounded-lg ${isActive('/account/orders')}`}>
                    <FaHistory /> Lịch sử đơn hàng
                  </Link>
                </li>
                <li className="border-t mt-2 pt-2">
                   <button 
                      onClick={() => { logout(); router.push("/"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 transition"
                   >
                      Đăng xuất
                   </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* === NỘI DUNG THAY ĐỔI (Children) === */}
        <div className="w-full md:w-3/4">
            {children}
        </div>

      </div>
    </div>
  );
}