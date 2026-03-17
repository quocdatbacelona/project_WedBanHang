"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Import thêm các icon cần thiết cho UX
import { FaFacebook, FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/app/component/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State để ẩn/hiện mật khẩu
  const [isLoading, setIsLoading] = useState(false); // State loading
  
  const router = useRouter();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Bắt đầu loading

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      login(data.user); 
      toast.success("Đăng nhập thành công!"); 
      
      // Đợi 1 chút để người dùng thấy thông báo rồi mới chuyển
      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin/dashboard"); 
        } else {
          router.push("/"); 
        }
      }, 1000);

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Đã xảy ra lỗi không xác định.");
      }
      setIsLoading(false); // Tắt loading nếu lỗi
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Container chính: Card đổ bóng, bo tròn */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* CỘT TRÁI: ẢNH BANNER (Ẩn trên mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-lime-600 relative flex-col justify-center items-center text-white p-12">
           {/* Ảnh nền mờ hoặc Pattern */}
           <Image 
             src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" 
             alt="Fresh Food" 
             fill 
             className="object-cover opacity-20"
             unoptimized
           />
           <div className="relative z-10 text-center">
              <h2 className="text-4xl font-extrabold mb-4">FreshFood</h2>
              <p className="text-lg text-lime-100 mb-8">Thực phẩm sạch cho mọi nhà. Tươi ngon, an toàn và giao hàng nhanh chóng.</p>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
           </div>
           
           {/* Nút quay lại trang chủ */}
           <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition z-20">
              <FaArrowLeft /> Trang chủ
           </Link>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
           {/* Nút quay lại (cho mobile) */}
           <Link href="/" className="md:hidden absolute top-4 left-4 text-gray-500">
              <FaArrowLeft size={20} />
           </Link>

           <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng trở lại! 👋</h2>
              <p className="text-gray-500 mb-8">Vui lòng nhập thông tin để đăng nhập.</p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
                
                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
                    <Link href="/forgot-password"
                      className="text-sm text-lime-600 hover:text-lime-700 font-medium"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"} // Logic ẩn hiện
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                      required
                    />
                    {/* Nút mắt Ẩn/Hiện */}
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Nút Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-lime-600 hover:bg-lime-700 text-white font-bold rounded-xl shadow-lg hover:shadow-lime-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : "Đăng Nhập"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập với</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
                  <FaGoogle className="text-red-500" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
                  <FaFacebook className="text-blue-600" /> Facebook
                </button>
              </div>

              {/* Register Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
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