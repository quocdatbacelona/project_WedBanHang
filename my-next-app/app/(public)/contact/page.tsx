"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaPaperPlane, FaFacebook, FaInstagram, FaTwitter, FaLeaf, FaHeadset } from "react-icons/fa";
import Breadcrumb from "@/app/component/Breadcrumb";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Liên Hệ" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      toast.error("Email phải là địa chỉ @gmail.com hợp lệ!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.");
      setFormData({ name: "", email: "", phone: "", message: "" }); 

    } catch (err: any) {
      toast.error(err.message || "Lỗi kết nối server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans text-gray-700">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* 1. HEADER BANNER (LÀM MỚI) */}
      <div className="relative bg-linear-to-r from-lime-600 to-green-700 h-52 md:h-72 flex items-center justify-center overflow-hidden mb-10">
         {/* Họa tiết trang trí */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <FaLeaf className="absolute top-10 left-20 text-9xl text-white animate-bounce-slow" />
            <FaHeadset className="absolute bottom-5 right-20 text-8xl text-white -rotate-12" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl opacity-20"></div>
         </div>
         
         <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Liên Hệ Hỗ Trợ</h1>
            <p className="text-lime-100 text-lg md:text-xl font-light max-w-2xl mx-auto">
               Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn 24/7.
            </p>
         </div>

         {/* Đường cong đáy */}
         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-[30px] md:h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
            </svg>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 border border-gray-100">
           
           {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ (Nền xanh) */}
           <div className="bg-linear-to-br from-lime-600 to-green-700 p-10 text-white flex flex-col justify-between relative overflow-hidden">
             {/* Họa tiết */}
             <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

             <div className="relative z-10">
                 <h2 className="text-2xl font-bold mb-6 border-b border-lime-400 pb-4 inline-block">Thông tin liên lạc</h2>
                 <p className="text-lime-100 mb-8 text-sm leading-relaxed">
                    Đừng ngần ngại liên hệ với chúng tôi qua các kênh dưới đây hoặc ghé thăm cửa hàng trực tiếp.
                 </p>

                 <div className="space-y-8">
                    <div className="flex items-start gap-4 group">
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-lime-600 transition duration-300">
                          <FaMapMarkerAlt className="text-xl" />
                       </div>
                       <div>
                          <p className="font-bold text-lg">Địa chỉ</p>
                          <p className="text-lime-100 text-sm">Motel Building, 408 Tôn Đức Thắng, Đà Nẵng</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-lime-600 transition duration-300">
                          <FaPhoneAlt className="text-xl" />
                       </div>
                       <div>
                          <p className="font-bold text-lg">Điện thoại</p>
                          <p className="text-lime-100 text-sm hover:underline cursor-pointer font-mono text-lg">1900 6789</p>
                          <p className="text-xs text-lime-200 mt-1">08:00 - 22:00 (Hàng ngày)</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                       <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-lime-600 transition duration-300">
                          <FaEnvelope className="text-xl" />
                       </div>
                       <div>
                          <p className="font-bold text-lg">Email</p>
                          <p className="text-lime-100 text-sm hover:underline cursor-pointer">support@freshfood.com</p>
                       </div>
                    </div>
                 </div>
             </div>

             {/* Social Links */}
             <div className="relative z-10 mt-12 pt-6 border-t border-lime-500/30">
                 <p className="text-sm font-semibold mb-4 text-lime-200 uppercase tracking-wider">Mạng xã hội</p>
                 <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full border border-lime-400 flex items-center justify-center hover:bg-white hover:text-lime-700 transition hover:-translate-y-1"><FaFacebook /></a>
                    <a href="#" className="w-10 h-10 rounded-full border border-lime-400 flex items-center justify-center hover:bg-white hover:text-lime-700 transition hover:-translate-y-1"><FaInstagram /></a>
                    <a href="#" className="w-10 h-10 rounded-full border border-lime-400 flex items-center justify-center hover:bg-white hover:text-lime-700 transition hover:-translate-y-1"><FaTwitter /></a>
                 </div>
             </div>
           </div>

           {/* CỘT PHẢI: FORM GỬI TIN NHẮN (Nền trắng) */}
           <div className="lg:col-span-2 p-8 md:p-12 bg-white">
             <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gửi tin nhắn cho chúng tôi</h2>
                <p className="text-gray-500 text-sm">Nếu bạn có thắc mắc về đơn hàng hoặc sản phẩm, vui lòng để lại lời nhắn.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700">Họ và tên</label>
                       <input 
                          type="text" name="name" value={formData.name} onChange={handleChange} 
                          placeholder="Nhập tên của bạn"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 outline-none transition bg-gray-50 focus:bg-white"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                       <input 
                          type="text" name="phone" value={formData.phone} onChange={handleChange} 
                          placeholder="Ví dụ: 0901234567"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 outline-none transition bg-gray-50 focus:bg-white"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email (@gmail.com)</label>
                    <input 
                       type="email" name="email" value={formData.email} onChange={handleChange} 
                       placeholder="example@gmail.com"
                       className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 outline-none transition bg-gray-50 focus:bg-white"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nội dung tin nhắn</label>
                    <textarea 
                       name="message" value={formData.message} onChange={handleChange}
                       placeholder="Bạn cần hỗ trợ vấn đề gì?..."
                       rows={5}
                       className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 outline-none transition bg-gray-50 focus:bg-white resize-none"
                    ></textarea>
                 </div>

                 <div className="pt-4">
                    <button 
                       type="submit" 
                       disabled={isLoading}
                       className="w-full md:w-auto bg-linear-to-r from-lime-600 to-green-700 text-white font-bold py-4 px-10 rounded-xl hover:shadow-lg hover:shadow-lime-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                       {isLoading ? (
                          <>
                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                             Đang gửi...
                          </>
                       ) : (
                          <>
                             Gửi tin nhắn <FaPaperPlane className="text-sm" />
                          </>
                       )}
                    </button>
                 </div>
             </form>
           </div>

        </div>

        {/* MAP SECTION */}
        <div className="mt-16 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
           <div className="rounded-2xl overflow-hidden h-[450px] w-full relative group">
              <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.126585865244!2d108.16263597576013!3d16.058919639712677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421922bfa4ed2f%3A0x38854940c0a29355!2zNDA4IFTDtG4gxJDhu6ljIFRo4bqvbmcsIEhvw6AgTWluaCwgTGnDqm4gQ2hp4buDdSwgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1751654070543!5m2!1svi!2s"
                 className="absolute inset-0 w-full h-full border-0 grayscale group-hover:grayscale-0 transition duration-700"
                 allowFullScreen
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-xs font-bold text-gray-700 pointer-events-none">
                 📍 Trụ sở chính
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}