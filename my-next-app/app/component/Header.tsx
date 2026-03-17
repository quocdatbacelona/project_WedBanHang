"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/component/cart";
import { useAuth } from "@/app/component/AuthContext";
import {  FaCarrot, FaAppleAlt, FaFish, FaDrumstickBite, FaSeedling } from "react-icons/fa";
// Icons
import { 
  FaShoppingCart, FaSearch, FaSignOutAlt, FaUser, 
  FaPhoneAlt, FaMapMarkerAlt, FaChevronDown, 
  FaTruck, FaHeadset, FaClock 
} from "react-icons/fa";

export default function Header() {
  const { items } = useCart();
  const safeItems = Array.isArray(items) ? items : [];
  const totalItems = safeItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const { user, logout } = useAuth();
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const displayName = user?.fullName || user?.email?.split('@')[0] || "Khách hàng";
  const firstLetter = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/products?search=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="w-full bg-white font-sans shadow-sm z-50 relative">
      
      {/* ==============================================
          1. TOP BAR (Màu xám nhạt tinh tế hơn)
      =============================================== */}
      <div className="bg-slate-50 text-slate-600 text-[13px] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between">
          
          {/* Trái: Liên hệ - Dùng màu xanh đậm hơn để dễ đọc */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 hover:text-lime-700 transition cursor-pointer group">
              <FaPhoneAlt className="text-lime-600 group-hover:scale-110 transition-transform" size={12} />
              <span>Hotline: <b className="text-slate-800">1900 6789</b></span>
            </div>
            <div className="flex items-center gap-2 hover:text-lime-700 transition cursor-pointer group">
              <FaMapMarkerAlt className="text-lime-600 group-hover:scale-110 transition-transform" size={12} />
              <span className="truncate max-w-[200px]">483 Tôn Đức Thắng, Đà Nẵng</span>
            </div>
          </div>

          {/* Phải: User Menu */}
          <div className="flex items-center gap-4 ml-auto">
            {!user ? (
              <div className="flex items-center gap-3 font-medium text-slate-600">
                <Link href="/register" className="hover:text-lime-700 transition">Đăng ký</Link>
                <span className="text-gray-300">|</span>
                <Link href="/login" className="hover:text-lime-700 transition">Đăng nhập</Link>
              </div>
            ) : (
              <div className="relative group z-50">
                <button className="flex items-center gap-2 hover:text-lime-700 transition focus:outline-none py-2">
                  <div className="w-6 h-6 bg-linear-to-br from-lime-500 to-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    {firstLetter}
                  </div>
                  <span className="font-semibold max-w-[100px] truncate text-slate-700">{displayName}</span>
                  <FaChevronDown size={10} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300"/>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full w-52 bg-white shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 mb-1">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tài khoản</p>
                    <p className="font-bold text-gray-800 truncate text-sm mt-1">{displayName}</p>
                  </div>
                  <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-lime-50 hover:text-lime-700 transition">
                    <FaUser size={14} className="text-gray-400"/> Hồ sơ cá nhân
                  </Link>
                  <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-lime-50 hover:text-lime-700 transition">
                     <FaTruck size={14} className="text-gray-400"/> Đơn mua
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition text-left mt-1 border-t border-gray-50">
                    <FaSignOutAlt size={14}/> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==============================================
          2. MIDDLE HEADER
      =============================================== */}
      <div className="bg-white py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo */}
           <Link href="/" className="shrink-0 hover:opacity-90 transition transform hover:scale-105 duration-300">
  <Image 
    src="/img/logomoi.jpg" 
    alt="FreshFood Market Logo" 
    width={110}  // Tăng kích thước gốc để ảnh nét hơn
    height={110} 
    className="object-contain h-20 w-auto rounded-xl" // Sửa h-14 thành h-24 (hoặc h-28 nếu muốn to nữa)
    priority 
  />
</Link>

            {/* Policies - Màu icon đồng bộ với màu chủ đạo mới */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { icon: <FaTruck size={18}/>, title: "Miễn phí vận chuyển", desc: "Bán kính 100km" },
                { icon: <FaHeadset size={18}/>, title: "Hỗ trợ 24/7", desc: "Hotline: 1900 1009" },
                { icon: <FaClock size={18}/>, title: "Giờ làm việc", desc: "T2 - T7 Giờ hành chính" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center group-hover:bg-lime-600 group-hover:text-white transition-all duration-300 shadow-sm border border-lime-100">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm group-hover:text-lime-700 transition">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Button - Viền bo tròn mềm mại hơn */}
            <Link href="/cart" className="group relative flex items-center gap-3 bg-white border-2 border-lime-600 text-lime-700 px-6 py-2 rounded-full hover:bg-lime-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
               <FaShoppingCart className="text-xl group-hover:animate-bounce" />
               <div className="text-left leading-none">
                  <span className="block text-[11px] opacity-80 font-medium uppercase tracking-wide">Giỏ hàng</span>
                  <span className="font-bold text-sm">{totalItems} sản phẩm</span>
               </div>
               {totalItems > 0 && (
                 <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                   {totalItems > 99 ? '99+' : totalItems}
                 </span>
               )}
            </Link>
          </div>
        </div>
      </div>

      {/* ==============================================
          3. NAVBAR - ĐIỂM NHẤN CHÍNH (GRADIENT)
      =============================================== */}
      <nav className="sticky top-0 z-40 shadow-lg">
        {/* Dùng Gradient từ Lime-600 sang Green-600 để tạo chiều sâu và khớp với banner */}
        <div className="bg-linear-to-r from-[#65a30d] to-[#4d7c0f] w-full"> 
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              
              {/* Menu Links */}
              <ul className="flex items-center gap-1 text-white font-semibold text-[15px] h-full tracking-wide">
                <li>
                    <Link href="/" className="px-5 h-full flex items-center hover:bg-white/20 transition rounded-t-md">Trang Chủ</Link>
                </li>
                
                {/* Dropdown Sản Phẩm */}
                  <li className="group relative h-full flex items-center">
                  {/* 1. Nút Menu */}
                  <Link 
                    href="/products" 
                    className="px-4 flex items-center gap-1.5  text-white font-semibold  hover:bg-white/20 transition rounded-t-md"
                  >
                    Sản phẩm 
                    <FaChevronDown size={10} className="transition-transform duration-300 group-hover:-rotate-180 opacity-70"/>
                  </Link>

                  {/* 2. Dropdown Content (Dạng danh sách dọc) */}
                  <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-xl border border-gray-100 border-t-4 border-t-lime-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50 py-2">
                    
                    {/* Mũi tên nhỏ chỉ lên (Trang trí) */}
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-lime-600 transform rotate-45"></div>

                    <div className="relative bg-white rounded-xl overflow-hidden">
                      {[
                        { name: 'Rau Củ Sạch', icon: <FaCarrot/>, slug: 'vegetable', sub: 'Rau hữu cơ tươi ngon' },
                        { name: 'Trái Cây', icon: <FaAppleAlt/>, slug: 'fruit', sub: 'Trái cây nội & ngoại nhập' },
                        { name: 'Thịt Tươi', icon: <FaDrumstickBite/>, slug: 'meat', sub: 'Thịt heo, bò, gà sạch' },
                        { name: 'Hải Sản', icon: <FaFish/>, slug: 'seafood', sub: 'Cá tôm đánh bắt ngày' },
                        { name: 'Đồ Khô', icon: <FaSeedling/>, slug: 'dry-food', sub: 'Gạo, hạt, gia vị' },
                      ].map((item, index) => (
                        <Link 
                          key={index} 
                          href={`/products?category=${item.slug}`}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-lime-50 transition-colors group/item border-b border-gray-50 last:border-0"
                        >
                          {/* Icon tròn */}
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover/item:bg-lime-100 group-hover/item:text-lime-600 transition-colors shrink-0">
                            {item.icon}
                          </div>
                          
                          {/* Text */}
                          <div>
                            <p className="font-bold text-gray-700 text-sm group-hover/item:text-lime-700 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-gray-400 font-normal">
                              {item.sub}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>

                <li className="hidden md:block">
                    <Link href="/introduction" className="px-5 h-full flex items-center hover:bg-white/20 transition rounded-t-md">Giới thiệu</Link>
                </li>
                <li className="hidden md:block">
                    <Link href="/news" className="px-5 h-full flex items-center hover:bg-white/20 transition rounded-t-md">Tin tức</Link>
                </li>
                <li>
                    <Link href="/contact" className="px-5 h-full flex items-center hover:bg-white/20 transition rounded-t-md">Liên hệ</Link>
                </li>
                <li>
                    <Link href="/directions" className="px-5 h-full flex items-center hover:bg-white/20 transition rounded-t-md">Chỉ đường</Link>
                </li>
              </ul>

              {/* Search Box - Thiết kế Glassmorphism nhẹ */}
              <form onSubmit={handleSearch} className="relative hidden md:block w-72">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className="w-full pl-4 pr-12 py-2.5 rounded-full text-sm outline-none bg-white/10 border border-white/30 text-white placeholder-white/70 focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 transition-all shadow-inner backdrop-blur-sm"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-lime-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-lime-100 transition shadow-sm"
                >
                  <FaSearch size={12} />
                </button>
              </form>

            </div>
          </div>
        </div>
      </nav>

    </div>
  );
}