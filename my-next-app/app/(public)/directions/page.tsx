"use client";

import React, { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaDirections, FaSearch, FaLocationArrow, FaStoreAlt } from 'react-icons/fa';
import Breadcrumb from '@/app/component/Breadcrumb';

// 1. Định nghĩa dữ liệu
interface Store {
  id: number;
  name: string;
  address: string;
  district: string;
  phone: string;
  hours: string;
}

const storeLocations: Store[] = [
  {
    id: 1,
    name: "Green Plus - Nguyễn Văn Linh",
    address: "254 Nguyễn Văn Linh, Thạc Gián, Thanh Khê, Đà Nẵng",
    district: "Thanh Khê",
    phone: "0905 123 456",
    hours: "07:00 - 22:00",
  },
  {
    id: 2,
    name: "Green Plus - Hòa Khánh",
    address: "120 Hoàng Minh Thảo, Hoà Khánh Nam, Liên Chiểu, Đà Nẵng",
    district: "Liên Chiểu",
    phone: "0905 987 654",
    hours: "08:00 - 21:30",
  },
  {
    id: 3,
    name: "Green Plus - Cẩm Lệ",
    address: "78 Phan Văn Trị, Khuê Trung, Cẩm Lệ, Đà Nẵng",
    district: "Cẩm Lệ",
    phone: "0935 555 888",
    hours: "07:30 - 21:00",
  },
  {
    id: 4,
    name: "Green Plus - Quang Trung",
    address: "03 Quang Trung, Hải Châu 1, Hải Châu, Đà Nẵng",
    district: "Hải Châu",
    phone: "0236 3650 403",
    hours: "08:00 - 22:00",
  }
];

export default function DirectionsPage() {
  const [selectedStore, setSelectedStore] = useState<Store>(storeLocations[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/"  },
    { label: "Hệ thống cửa hàng" }, 
  ];

  // Lọc cửa hàng theo tìm kiếm
  const filteredStores = useMemo(() => {
    return storeLocations.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Nhóm cửa hàng đã lọc theo Quận
  const storesByDistrict = useMemo(() => {
    return filteredStores.reduce((acc, store) => {
      if (!acc[store.district]) acc[store.district] = [];
      acc[store.district].push(store);
      return acc;
    }, {} as { [key: string]: Store[] });
  }, [filteredStores]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans text-gray-700">
      
      {/* 1. HEADER BANNER */}
      <div className="relative bg-linear-to-r from-lime-600 to-green-700 h-48 md:h-64 flex items-center justify-center overflow-hidden mb-8">
         {/* Họa tiết trang trí */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <FaStoreAlt className="absolute top-10 left-20 text-9xl text-white -rotate-12" />
            <FaMapMarkerAlt className="absolute bottom-5 right-20 text-8xl text-white rotate-12" />
         </div>
         
         <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md">Hệ Thống Cửa Hàng</h1>
            <p className="text-lime-100 text-lg md:text-xl font-light">
               Tìm kiếm cửa hàng GreenPlus gần bạn nhất
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
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Breadcrumb items={breadcrumbItems} />
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input 
                    type="text" 
                    placeholder="Tìm theo tên đường, quận..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm focus:border-lime-500 focus:ring-2 focus:ring-lime-200 outline-none transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

          {/* === CỘT TRÁI: DANH SÁCH (Scrollable) === */}
          <div className="lg:col-span-4 flex flex-col h-[600px] lg:sticky lg:top-24">
            <div className="bg-white p-4 rounded-t-2xl shadow-sm border-b border-gray-100 flex justify-between items-center">
               <span className="font-bold text-gray-800 flex items-center gap-2">
                  <FaStoreAlt className="text-lime-600"/> Danh sách cửa hàng
               </span>
               <span className="text-xs font-bold bg-lime-100 text-lime-700 px-2 py-1 rounded-full">{filteredStores.length} địa điểm</span>
            </div>
            
            <div className="bg-white p-4 rounded-b-2xl shadow-sm border border-gray-100 flex-1 overflow-y-auto custom-scrollbar">
               {Object.keys(storesByDistrict).length > 0 ? (
                 Object.keys(storesByDistrict).map((district) => (
                   <div key={district} className="mb-6 last:mb-0">
                     <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3 px-1 border-l-2 border-lime-500 pl-2">
                       Quận {district}
                     </h3>
                     <div className="space-y-3">
                       {storesByDistrict[district].map((store) => (
                         <div
                           key={store.id}
                           onClick={() => setSelectedStore(store)}
                           className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group
                             ${selectedStore.id === store.id 
                               ? 'border-lime-500 bg-lime-50 shadow-md ring-1 ring-lime-500' 
                               : 'border-gray-100 hover:border-lime-300 hover:shadow-md bg-white'
                             }
                           `}
                         >
                           <div className="flex justify-between items-start">
                               <div>
                                   <p className={`font-bold text-sm mb-1 ${selectedStore.id === store.id ? 'text-lime-800' : 'text-gray-800'}`}>
                                     {store.name}
                                   </p>
                                   <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex items-center gap-1">
                                      <FaMapMarkerAlt size={10}/> {store.address}
                                   </p>
                                   <div className="flex items-center gap-3">
                                      <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${selectedStore.id === store.id ? 'bg-white border-lime-200 text-lime-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                         <FaClock size={10}/> {store.hours}
                                      </span>
                                   </div>
                               </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-10 text-gray-400">
                    <p>Không tìm thấy cửa hàng nào phù hợp.</p>
                 </div>
               )}
            </div>
          </div>

          {/* === CỘT PHẢI: BẢN ĐỒ & CHI TIẾT (Sticky) === */}
          <div className="lg:col-span-8 h-fit lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
               
               {/* 1. Bản đồ Google Maps (Embed Dynamic) */}
               <div className="relative w-full h-[350px] md:h-[450px] bg-gray-100 group">
                 <iframe
                   className="w-full h-full"
                   // Tự động tạo map từ địa chỉ
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                   loading="lazy"
                   style={{ border: 0 }}
                   allowFullScreen
                 ></iframe>
                 
                 {/* Nút mở app */}
                 <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 hover:bg-lime-600 hover:text-white transition transform hover:scale-105"
                 >
                    <FaLocationArrow /> Mở Google Maps
                 </a>
               </div>

               {/* 2. Thông tin chi tiết */}
               <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
                      <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedStore.name}</h2>
                          <p className="text-gray-500 text-sm flex items-center gap-2">
                             <FaMapMarkerAlt className="text-lime-600"/> {selectedStore.address}
                          </p>
                      </div>
                      <div className="flex gap-3">
                          <a href={`tel:${selectedStore.phone}`} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-3 rounded-xl font-bold hover:bg-blue-100 transition shadow-sm">
                              <FaPhoneAlt size={16}/> <span className="hidden sm:inline">Gọi điện</span>
                          </a>
                          <a 
                             href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`}
                             target="_blank" 
                             rel="noreferrer"
                             className="flex items-center gap-2 bg-lime-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-lime-700 shadow-lg shadow-lime-200 transition"
                          >
                              <FaDirections size={18}/> Chỉ đường
                          </a>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                              <FaClock size={20}/>
                          </div>
                          <div>
                              <p className="font-bold text-gray-700 text-base">Giờ mở cửa</p>
                              <p className="text-gray-600 mt-1 font-medium">{selectedStore.hours}</p>
                              <p className="text-xs text-green-600 mt-1 font-bold bg-green-50 inline-block px-2 py-0.5 rounded">● Đang mở cửa</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                              <FaPhoneAlt size={18}/>
                          </div>
                          <div>
                              <p className="font-bold text-gray-700 text-base">Liên hệ</p>
                              <p className="text-gray-600 mt-1 font-mono text-lg">{selectedStore.phone}</p>
                              <p className="text-xs text-gray-400 mt-1">Hỗ trợ đặt hàng 24/7</p>
                          </div>
                      </div>
                  </div>
               </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}