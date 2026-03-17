"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/app/component/AuthContext"; 
import { FaFacebook, FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth(); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
        toast.error("Vui lòng nhập email và mật khẩu.");
        return;
    }

    setIsLoading(true);

    try {
        const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Email hoặc mật khẩu không đúng.");
        }

        // Lấy thông tin user
        const userData = data.user || data;
        
        // Lưu vào Context
        login(userData); 
        
        toast.success(`Xin chào, ${userData.name || "Bạn"}!`);
        
        // --- LOGIC CHUYỂN HƯỚNG ---
        setTimeout(() => {
            if (userData.role === 'admin') {
                router.push("/admin/dashboard"); // Nếu là Admin -> Vào trang quản trị
            } else {
                router.push("/"); // Nếu là khách -> Về trang chủ
            }
        }, 1000);

    } catch (err: any) {
        toast.error(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* CỘT TRÁI: BANNER */}
        <div className="hidden md:flex md:w-1/2 bg-lime-600 relative flex-col justify-center items-center text-white p-12">
           <Image 
             src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" 
             alt="Fresh Food Login" 
             fill 
             className="object-cover opacity-20"
             unoptimized
           />
           <div className="relative z-10 text-center">
              <h2 className="text-4xl font-extrabold mb-4">Chào Mừng Trở Lại!</h2>
              <p className="text-lg text-lime-100 mb-8">Rất vui được gặp lại bạn. Cùng tiếp tục hành trình sống xanh nhé.</p>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 inline-block">
                  <p className="font-medium text-lg mb-2">Hôm nay có gì mới?</p>
                  <div className="flex -space-x-2 justify-center mb-3">
                      {[1,2,3,4].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                              <Image 
                                src={`https://i.pravatar.cc/100?img=${i+10}`} 
                                width={32} height={32} 
                                alt="user" 
                                unoptimized
                              />
                          </div>
                      ))}
                  </div>
                  <p className="text-xs text-lime-100">+100 sản phẩm mới vừa lên kệ</p>
              </div>
           </div>
           
           <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition z-20">
              <FaArrowLeft /> Trang chủ
           </Link>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
           <Link href="/" className="md:hidden absolute top-4 left-4 text-gray-500">
              <FaArrowLeft size={20} />
           </Link>

           <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập 👋</h2>
              <p className="text-gray-500 mb-8">Nhập thông tin tài khoản của bạn để tiếp tục.</p>

              <form className="space-y-5" onSubmit={handleLogin}>
                
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="admin@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
                
                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
                      <a href="#" className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline">Quên mật khẩu?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-xl shadow-lg hover:shadow-lime-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : "Đăng Nhập"}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
                  <FaGoogle className="text-red-500" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
                  <FaFacebook className="text-blue-600" /> Facebook
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="font-bold text-lime-600 hover:text-lime-700 hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}