"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { FaFacebook, FaGoogle, FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Ẩn/Hiện mật khẩu
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !phone || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setIsLoading(true); // Bắt đầu loading

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      toast.success("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => {
        router.push("/login"); 
      }, 2000);

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Đã xảy ra một lỗi không xác định.");
      }
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* CỘT TRÁI: BANNER (Nhấn mạnh lợi ích) */}
        <div className="hidden md:flex md:w-1/2 bg-lime-600 relative flex-col justify-center items-center text-white p-12">
           <Image 
             src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" 
             alt="Fresh Food Register" 
             fill 
             className="object-cover opacity-20"
             unoptimized
           />
           <div className="relative z-10 text-center">
              <h2 className="text-4xl font-extrabold mb-4">Gia Nhập GreenPlus</h2>
              <p className="text-lg text-lime-100 mb-8">Trở thành thành viên ngay hôm nay để nhận hàng ngàn ưu đãi độc quyền.</p>
              
              <ul className="text-left space-y-3 text-sm font-medium inline-block bg-black/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                 <li className="flex items-center gap-3"><span className="bg-white text-lime-600 rounded-full p-1 text-xs font-bold">✓</span> Tích điểm đổi quà</li>
                 <li className="flex items-center gap-3"><span className="bg-white text-lime-600 rounded-full p-1 text-xs font-bold">✓</span> Miễn phí vận chuyển</li>
                 <li className="flex items-center gap-3"><span className="bg-white text-lime-600 rounded-full p-1 text-xs font-bold">✓</span> Nhận voucher sinh nhật</li>
              </ul>
           </div>
           
           <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition z-20">
              <FaArrowLeft /> Trang chủ
           </Link>
        </div>

        {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
           <Link href="/" className="md:hidden absolute top-4 left-4 text-gray-500">
              <FaArrowLeft size={20} />
           </Link>

           <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản mới 🚀</h2>
              <p className="text-gray-500 mb-8">Điền thông tin bên dưới để bắt đầu hành trình sống xanh.</p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
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

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
                
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Tạo mật khẩu mạnh..."
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
                  ) : "Đăng Ký Ngay"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Hoặc đăng ký với</span>
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

              {/* Footer Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link href="/login" className="font-bold text-lime-600 hover:text-lime-700 hover:underline">
                  Đăng nhập tại đây
                </Link>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}