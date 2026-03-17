"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaStore, FaLock, FaCreditCard, FaSave, FaCamera, 
  FaEye, FaEyeSlash, FaCheckCircle
} from "react-icons/fa";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- 1. DỮ LIỆU MẶC ĐỊNH (Dùng khi chưa có gì trong LocalStorage) ---
  const defaultGeneral = {
    storeName: "FreshFood Market",
    phone: "0909 123 456",
    email: "admin@freshfood.com",
    address: "123 Đường Nguyễn Hoàng, Tam Kỳ, Quảng Nam",
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200",
    description: "Cung cấp thực phẩm sạch, rau củ quả tươi ngon chuẩn VietGAP."
  };

  const defaultPayment = {
    shippingFee: 30000,
    freeShipThreshold: 500000,
    bankName: "MB Bank",
    bankNumber: "9999999999",
    bankOwner: "CONG TY FRESH FOOD"
  };

  const [generalInfo, setGeneralInfo] = useState(defaultGeneral);
  const [paymentConfig, setPaymentConfig] = useState(defaultPayment);

  // --- 2. LOAD DỮ LIỆU TỪ STORAGE KHI VÀO TRANG ---
  useEffect(() => {
    // Nếu có Backend thì gọi API ở đây. Hiện tại dùng LocalStorage.
    const savedGeneral = localStorage.getItem("admin_general_settings");
    const savedPayment = localStorage.getItem("admin_payment_settings");

    if (savedGeneral) {
        setGeneralInfo(JSON.parse(savedGeneral));
    }
    if (savedPayment) {
        setPaymentConfig(JSON.parse(savedPayment));
    }
  }, []);

  // --- 3. XỬ LÝ LƯU (CẬP NHẬT THẬT) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
        // Lưu vào trình duyệt (Giả lập Database)
        if (activeTab === "general") {
            localStorage.setItem("admin_general_settings", JSON.stringify(generalInfo));
        } else if (activeTab === "payment") {
            localStorage.setItem("admin_payment_settings", JSON.stringify(paymentConfig));
        }

        // Nếu có Backend, bạn bỏ comment dòng này:
        /*
        await fetch("http://localhost:5000/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(activeTab === 'general' ? generalInfo : paymentConfig)
        });
        */

        // Giả lập delay mạng
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Đã lưu thay đổi thành công!", { 
                icon: <FaCheckCircle className="text-green-500"/> 
            });
        }, 800);

    } catch (error) {
        setIsSaving(false);
        toast.error("Lỗi khi lưu cài đặt");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* === SIDEBAR (w-60 ~ 240px) === */}
          <div className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sticky top-6">
              <nav className="space-y-1">
                {[
                  { id: "general", label: "Thông tin chung", icon: FaStore, color: "text-green-600", bg: "bg-green-50" },
                  { id: "payment", label: "Vận chuyển & TT", icon: FaCreditCard, color: "text-blue-600", bg: "bg-blue-50" },
                  { id: "security", label: "Bảo mật & Admin", icon: FaLock, color: "text-red-600", bg: "bg-red-50" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      activeTab === tab.id 
                        ? `${tab.bg} ${tab.color} shadow-sm` 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              <div className="mt-4 pt-4 border-t border-gray-100 px-2">
                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Phiên bản</p>
                 <div className="text-xs text-gray-500">v1.2.0</div>
              </div>
            </div>
          </div>

          {/* === MAIN CONTENT === */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fadeIn min-h-[500px]">
              
              {/* TAB 1: THÔNG TIN CHUNG (CHIA 3/7) */}
              {activeTab === "general" && (
                <form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
                  
                  {/* CỘT TRÁI (30%) - LOGO */}
                  <div className="w-full lg:w-[30%] flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm">Logo cửa hàng</h3>
                    <div className="relative group cursor-pointer mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
                           <Image src={generalInfo.logo} alt="Logo" width={128} height={128} className="w-full h-full object-cover" unoptimized />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaCamera className="text-white text-xl"/>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 px-4">
                        Hỗ trợ định dạng .PNG, .JPG. <br/> Dung lượng tối đa 2MB.
                    </p>
                    <button type="button" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold transition w-full">
                        Tải ảnh mới
                    </button>
                  </div>

                  {/* CỘT PHẢI (70%) - FORM INPUT */}
                  <div className="w-full lg:w-[70%] space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase">Tên cửa hàng</label>
                            <input type="text" value={generalInfo.storeName} onChange={e => setGeneralInfo({...generalInfo, storeName: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase">Hotline</label>
                            <input type="text" value={generalInfo.phone} onChange={e => setGeneralInfo({...generalInfo, phone: e.target.value})}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Email liên hệ</label>
                        <input type="email" value={generalInfo.email} onChange={e => setGeneralInfo({...generalInfo, email: e.target.value})}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Địa chỉ</label>
                        <input type="text" value={generalInfo.address} onChange={e => setGeneralInfo({...generalInfo, address: e.target.value})}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase">Mô tả ngắn</label>
                        <textarea rows={3} value={generalInfo.description} onChange={e => setGeneralInfo({...generalInfo, description: e.target.value})}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm resize-none" />
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center gap-2">
                            {isSaving ? "Đang lưu..." : <><FaSave/> Lưu thay đổi</>}
                        </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: VẬN CHUYỂN & THANH TOÁN */}
              {activeTab === "payment" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                     <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <FaCreditCard className="text-blue-500"/> Cấu hình Vận chuyển
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-700">Phí ship mặc định</label>
                           <input type="number" value={paymentConfig.shippingFee} onChange={e => setPaymentConfig({...paymentConfig, shippingFee: parseInt(e.target.value)})}
                             className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-700">Freeship từ</label>
                           <input type="number" value={paymentConfig.freeShipThreshold} onChange={e => setPaymentConfig({...paymentConfig, freeShipThreshold: parseInt(e.target.value)})}
                             className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 className="font-bold text-gray-800 mb-3 text-sm">Tài khoản ngân hàng</h3>
                     {/* Preview Card */}
                     <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-5 rounded-xl text-white shadow-lg mb-5 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-lg font-bold tracking-wider">{paymentConfig.bankName}</div>
                                <FaCreditCard className="opacity-80"/>
                            </div>
                            <div className="space-y-1 mb-4">
                                <label className="text-[10px] text-gray-400 uppercase tracking-widest">Số tài khoản</label>
                                <div className="text-xl font-mono tracking-widest">{paymentConfig.bankNumber || "#### #### #### ####"}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 uppercase tracking-widest">Chủ tài khoản</label>
                                <div className="font-bold uppercase text-sm tracking-wider">{paymentConfig.bankOwner || "YOUR NAME"}</div>
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Ngân hàng</label>
                            <input type="text" value={paymentConfig.bankName} onChange={e => setPaymentConfig({...paymentConfig, bankName: e.target.value})} 
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm focus:border-blue-500"/>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Số tài khoản</label>
                            <input type="text" value={paymentConfig.bankNumber} onChange={e => setPaymentConfig({...paymentConfig, bankNumber: e.target.value})} 
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm focus:border-blue-500"/>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Chủ tài khoản</label>
                            <input type="text" value={paymentConfig.bankOwner} onChange={e => setPaymentConfig({...paymentConfig, bankOwner: e.target.value.toUpperCase()})} 
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm focus:border-blue-500"/>
                        </div>
                     </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2">
                        {isSaving ? "Đang lưu..." : <><FaSave/> Lưu cấu hình</>}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: BẢO MẬT (Giữ nguyên UI, logic xử lý riêng) */}
              {activeTab === "security" && (
                <form className="space-y-6">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3">
                        <div className="bg-white p-2 h-fit rounded-full text-red-500 shadow-sm"><FaLock size={14}/></div>
                        <div>
                            <h3 className="font-bold text-red-800 text-sm">Đổi mật khẩu Admin</h3>
                            <p className="text-xs text-red-600 mt-1">Nên thay đổi mật khẩu 3 tháng/lần.</p>
                        </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-red-500 outline-none text-sm" placeholder="••••••••"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <FaEyeSlash size={14}/> : <FaEye size={14}/>}
                                </button>
                            </div>
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Mật khẩu mới</label>
                            <input type="password" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-red-500 outline-none text-sm" placeholder="••••••••"/>
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700">Nhập lại</label>
                            <input type="password" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-red-500 outline-none text-sm" placeholder="••••••••"/>
                         </div>
                         <button type="button" onClick={() => toast.success("Đã gửi yêu cầu đổi mật khẩu!")} className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-100 mt-2">
                            Cập nhật mật khẩu
                         </button>
                    </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}