"use client";

import { Menu, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/app/component/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left: Toggle Button */}
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
        <Menu size={20} />
      </button>

      

      {/* Right: User Info & Actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 relative hover:bg-gray-100 rounded-full text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l pl-4 ml-2">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-700">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-xs text-green-600 font-medium">Administrator</p>
           </div>
           <div className="w-9 h-9 bg-linear-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition">
              {user?.email?.[0].toUpperCase() || 'A'}
           </div>
           <button onClick={handleLogout} title="Đăng xuất" className="text-gray-400 hover:text-red-500 ml-1">
              <LogOut size={18} />
           </button>
        </div>
      </div>
    </header>
  );
}