// Địa chỉ file: app/account/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/component/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaCamera, FaSave } from "react-icons/fa";
// Thêm: Import useRouter
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, updateUser } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Dùng để chuyển trang
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "", 
    city: "Đà Nẵng"
  });

  // Load dữ liệu cũ (để người dùng không phải nhập lại)
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "", 
        email: user.email,
        phone: user.phone || "",
        address: user.address || "", 
        city: user.city || "Đà Nẵng"
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateUser(data.user);
      
      // 1. Hiện Toast thành công
      toast.success("Lưu thông tin thành công! Đang quay lại giỏ hàng...");

      // 2. Đợi 1.5s rồi chuyển về Giỏ hàng
      setTimeout(() => {
        router.push("/cart");
      }, 1500);

    } catch (err) {
       if (err instanceof Error) toast.error(err.message);
    } finally {
       setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
        {/* ToastContainer bắt buộc phải có để hiện toast */}
        <ToastContainer position="top-right" autoClose={1500} />
        
        <div className="h-32 bg-linear-to-r from-lime-500 to-green-600 relative rounded-t-lg mb-12">
           <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                 <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-4xl relative overflow-hidden group cursor-pointer">
                    <FaUser />
                    <div className="absolute inset-0 bg-black bg-opacity-40 hidden group-hover:flex items-center justify-center text-white text-xl">
                       <FaCamera />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 ml-2">Thông tin giao hàng</h2>

        <form onSubmit={handleUpdate} className="space-y-6 px-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Họ tên */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" required placeholder="Ví dụ: Nguyễn Văn A"/>
               </div>

               {/* Số điện thoại */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" required placeholder="090..."/>
               </div>

               {/* Email (Không cho sửa) */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email} disabled className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"/>
               </div>

               {/* Tỉnh thành */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh thành <span className="text-red-500">*</span></label>
                  <select name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none">
                     <option value="Đà Nẵng">Đà Nẵng</option>
                     <option value="Hà Nội">Hà Nội</option>
                     <option value="TP. HCM">TP. HCM</option>
                     <option value="Cần Thơ">Cần Thơ</option>
                  </select>
               </div>

               {/* Địa chỉ cụ thể */}
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ cụ thể <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" 
                    required 
                    placeholder="Số nhà, tên đường, phường/xã..."
                  />
               </div>
           </div>

           <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="flex items-center gap-2 bg-lime-600 text-white px-8 py-3 rounded-lg hover:bg-lime-700 transition font-bold shadow-sm disabled:opacity-70"
              >
                 <FaSave /> {isLoading ? "Đang lưu..." : "Lưu & Quay lại Giỏ hàng"}
              </button>
           </div>
        </form>
    </div>
  );
}