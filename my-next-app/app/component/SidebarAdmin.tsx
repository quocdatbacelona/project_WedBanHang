"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Ticket,
  Mail
} from 'lucide-react';
import { FaCog } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", href: "/admin/dashboard" },
    { icon: ShoppingCart, label: "Đơn hàng", href: "/admin/orders" },
    { icon: Package, label: "Sản phẩm", href: "/admin/products" },
    { icon: Users, label: "Khách hàng", href: "/admin/users" },
    { icon: Ticket, label: "Mã giảm giá", href: "/admin/coupons" },
    { icon: Mail, label: "Tin nhắn", href: "/admin/contacts" },
 ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        {isOpen ? (
          <span className="text-xl font-bold text-green-700 tracking-wide">FreshFood AD</span>
        ) : (
          <span className="text-xl font-bold text-green-700">FF</span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors 
                ${isActive 
                  ? 'bg-green-50 text-green-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <item.icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
        
        <div className="pt-4 border-t border-gray-100 mt-4">
           <Link href="/admin/settings" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100">
              <Settings size={20} />
              {isOpen && <span>Cài đặt </span>}
           </Link>
        </div>
      </nav>
    </aside>
  );
}