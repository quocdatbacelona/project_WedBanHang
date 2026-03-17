"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/component/Breadcrumb";
import { FaLeaf, FaSeedling, FaShippingFast, FaCheckCircle, FaHeart, FaUsers, FaAward } from "react-icons/fa";

export default function IntroductionPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Giới thiệu" },
  ];

  const features = [
    {
      icon: <FaCheckCircle className="text-4xl text-white" />,
      title: "Chuẩn VietGAP",
      desc: "100% nông sản có nguồn gốc rõ ràng, quy trình trồng trọt được kiểm soát nghiêm ngặt.",
      bg: "bg-green-500"
    },
    {
      icon: <FaLeaf className="text-4xl text-white" />,
      title: "Tươi Ngon 100%",
      desc: "Cam kết không chất bảo quản, rau củ được thu hoạch và vận chuyển trong ngày.",
      bg: "bg-lime-500"
    },
    {
      icon: <FaShippingFast className="text-4xl text-white" />,
      title: "Giao Siêu Tốc",
      desc: "Đội ngũ shipper chuyên nghiệp đảm bảo thực phẩm luôn tươi khi đến tay bạn.",
      bg: "bg-emerald-500"
    },
    {
      icon: <FaUsers className="text-4xl text-white" />,
      title: "Hỗ Trợ 24/7",
      desc: "Luôn lắng nghe và giải quyết mọi khiếu nại của khách hàng ngay lập tức.",
      bg: "bg-teal-500"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-700">
      
      {/* 1. HERO SECTION (Banner Tràn Viền) */}
      <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Ảnh nền */}
        <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop" 
                alt="GreenPlus Farm Banner" 
                fill 
                className="object-cover"
                priority
                unoptimized // <--- SỬA LỖI: Cho phép tải ảnh ngoài mà không cần config
            />
            {/* Lớp phủ tối màu để nổi chữ */}
            <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Nội dung Banner */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fadeIn">
            <span className="bg-lime-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-4 inline-block shadow-lg">
                Về GreenPlus
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                Mang Thiên Nhiên <br/> Vào Bữa Ăn Của Bạn
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-8 font-light">
                Hành trình kết nối nông sản sạch từ những nông trại tâm huyết đến bàn ăn của mọi gia đình Việt.
            </p>
        </div>
        
        {/* Đường cong trang trí */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg className="relative block w-full h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
            </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* 2. CÂU CHUYỆN THƯƠNG HIỆU */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Hình ảnh (Collage) */}
            <div className="relative">
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white z-10">
                    <Image 
                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000" 
                        alt="Nông dân thu hoạch" 
                        fill 
                        className="object-cover hover:scale-105 transition duration-700"
                        unoptimized // <--- SỬA LỖI
                    />
                </div>
                {/* Ảnh phụ trang trí */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 hidden md:block">
                    <Image 
                        src="https://giadinh.mediacdn.vn/zoom/740_463/2017/phanbietraucuqua-1499228262649.jpg" 
                        alt="Rau sạch" 
                        fill 
                        className="object-cover"
                        unoptimized // <--- SỬA LỖI
                    />
                </div>
                {/* Họa tiết lá */}
                <FaLeaf className="absolute -top-10 -left-10 text-8xl text-lime-200 opacity-50 rotate-45 z-0"/>
            </div>

            {/* Nội dung */}
            <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                    Từ Nông Trại <span className="text-lime-600">Xanh</span> <br/> Đến Cuộc Sống <span className="text-green-600">Lành</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    <strong className="text-green-700">GreenPlus</strong> được thành lập với một niềm tin đơn giản: <em className="text-gray-800">"Thực phẩm sạch không phải là sự xa xỉ, mà là quyền lợi cơ bản của mỗi người."</em>
                </p>
                <p className="text-gray-600 leading-relaxed">
                    Chúng tôi không chỉ bán rau củ, chúng tôi trao gửi sự an tâm. Mỗi sản phẩm tại GreenPlus đều được tuyển chọn kỹ lưỡng từ các nông trại đạt chuẩn VietGAP, nơi người nông dân canh tác bằng cả trái tim, nói không với hóa chất độc hại.
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-lime-100 p-3 rounded-full text-lime-600"><FaAward size={24}/></div>
                        <div>
                            <h4 className="font-bold text-gray-800">10+ Năm</h4>
                            <p className="text-sm text-gray-500">Kinh nghiệm</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-full text-green-600"><FaUsers size={24}/></div>
                        <div>
                            <h4 className="font-bold text-gray-800">50.000+</h4>
                            <p className="text-sm text-gray-500">Khách hàng tin dùng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. GIÁ TRỊ CỐT LÕI (Cards Nổi bật) */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-lime-200 rounded-full blur-3xl opacity-30"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-30"></div>

         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Cam Kết Vàng</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Chúng tôi đặt chất lượng và sức khỏe người tiêu dùng lên hàng đầu.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${item.bg} group-hover:scale-110 transition duration-300`}>
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 4. CTA (Call to Action) */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-linear-to-r from-lime-600 to-green-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Họa tiết */}
            <FaLeaf className="absolute top-10 right-20 text-9xl text-white opacity-10 rotate-45 animate-pulse" />
            <FaSeedling className="absolute bottom-10 left-20 text-9xl text-white opacity-10 -rotate-12" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Bắt Đầu Lối Sống Xanh Ngay Hôm Nay</h2>
                <p className="text-lime-100 text-lg mb-10">
                    Đừng chần chừ! Hãy để GreenPlus chăm sóc bữa ăn gia đình bạn bằng những sản phẩm tươi ngon nhất.
                </p>
                <Link 
                    href="/products" 
                    className="inline-block bg-white text-green-700 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-lime-50 hover:scale-105 transition duration-300"
                >
                    Đến Cửa Hàng Ngay
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
} 