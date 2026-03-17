"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/app/component/Breadcrumb';
import CategorySidebar from '@/app/component/CategorySidebar'; 
import { FaCalendarAlt, FaArrowRight, FaNewspaper, FaLeaf } from "react-icons/fa";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tin tức từ API
  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then(res => res.json())
      .then(data => {
         setArticles(data);
         setIsLoading(false);
      })
      .catch(err => setIsLoading(false));
  }, []);

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans text-gray-700">
      
      {/* 1. HEADER BANNER (LÀM MỚI CHO ĐỒNG BỘ) */}
      <div className="relative bg-linear-to-r from-lime-600 to-green-700 h-48 md:h-64 flex items-center justify-center overflow-hidden mb-8">
         {/* Họa tiết chìm */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <FaLeaf className="absolute top-10 left-10 text-8xl text-white rotate-45" />
            <FaNewspaper className="absolute bottom-5 right-20 text-9xl text-white -rotate-12" />
         </div>
         
         <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-md">Tin Tức & Sự Kiện</h1>
            <p className="text-lime-100 text-lg md:text-xl font-light">
               Cập nhật kiến thức dinh dưỡng và thông tin khuyến mãi mới nhất
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
        <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* SIDEBAR (CARD STYLE) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2 flex items-center gap-2">
                    <FaLeaf className="text-lime-600"/> Danh mục
                </h3>
                <CategorySidebar />
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-lime-600 rounded-full inline-block"></span>
                    Bài viết mới nhất
                </h2>
                <span className="text-sm bg-white px-3 py-1 rounded-full shadow-sm text-gray-500 border border-gray-100">
                    {articles.length} bài viết
                </span>
            </div>
            
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[1,2,3,4].map(i => (
                       <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
                   ))}
               </div>
            ) : articles.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articles.map((article: any) => (
                    <article key={article._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
                      
                      {/* Ảnh bài viết */}
                      <Link href={`/news/${article._id}`} className="relative h-60 w-full overflow-hidden block">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-700"
                          unoptimized // Thêm để tránh lỗi ảnh
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition duration-300 transform translate-y-4 group-hover:translate-y-0">
                            <span className="bg-lime-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Xem ngay</span>
                        </div>
                      </Link>

                      {/* Nội dung */}
                      <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
                             <FaCalendarAlt className="text-lime-600"/>
                             {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                          
                          <Link href={`/news/${article._id}`} className="block">
                             <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-lime-600 transition line-clamp-2 leading-snug">
                                {article.title}
                             </h3>
                          </Link>
                          
                          <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                             {article.description}
                          </p>

                          <Link 
                             href={`/news/${article._id}`} 
                             className="inline-flex items-center gap-2 text-lime-700 font-bold text-sm hover:gap-3 transition-all mt-auto group/link"
                          >
                             Đọc tiếp <FaArrowRight size={12} className="group-hover/link:translate-x-1 transition"/>
                          </Link>
                      </div>
                    </article>
                  ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                  <FaNewspaper className="text-6xl text-gray-200 mb-4"/>
                  <p className="text-gray-500">Chưa có tin tức nào được đăng.</p>
               </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}