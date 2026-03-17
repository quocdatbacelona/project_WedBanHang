"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/app/component/Breadcrumb';
import CategorySidebar from '@/app/component/CategorySidebar';
import { FaCalendarAlt, FaUser, FaTag, FaClock } from "react-icons/fa";

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState([]); // Tin liên quan
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // 1. Lấy chi tiết bài viết hiện tại
      fetch(`http://localhost:5000/api/news/${id}`)
        .then(res => {
           if(!res.ok) throw new Error("Không tìm thấy");
           return res.json();
        })
        .then(data => {
           setArticle(data);
           setIsLoading(false);
        })
        .catch(err => setIsLoading(false));

      // 2. Lấy danh sách tin khác (để làm phần "Tin liên quan")
      fetch("http://localhost:5000/api/news")
        .then(res => res.json())
        .then(data => {
            // Lọc bỏ bài hiện tại và lấy 3 bài khác
            const others = data.filter((item: any) => item._id !== id).slice(0, 3);
            setRelatedNews(others);
        });
    }
  }, [id]);

  if (isLoading) return <div className="py-20 text-center text-gray-500">Đang tải nội dung...</div>;
  if (!article) return <div className="py-20 text-center text-red-500">Bài viết không tồn tại.</div>;

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/news" },
    { label: article.title }, // Tiêu đề bài viết hiện tại
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 ">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-12 gap-8 mt-8">
          
          {/* CỘT TRÁI: SIDEBAR */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
             <CategorySidebar />
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            
            {/* 1. Phần Header bài viết */}
            <div className="bg-white p-8 rounded-t-2xl border-b border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                    {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-lime-600"/> 
                        {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaUser className="text-lime-600"/> Admin
                    </span>
                    <span className="flex items-center gap-2">
                        <FaClock className="text-lime-600"/> 5 phút đọc
                    </span>
                </div>
            </div>

            {/* 2. Ảnh bìa & Nội dung */}
            <div className="bg-white px-8 pb-8 rounded-b-2xl shadow-sm mb-8">
                {/* Ảnh đại diện lớn */}
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg mt-4">
                     <Image 
                        src={article.image} 
                        alt={article.title} 
                        fill 
                        className="object-cover"
                     />
                </div>

                {/* Mô tả ngắn (In đậm) */}
                <div className="bg-lime-50 p-4 rounded-lg border-l-4 border-lime-600 text-gray-700 italic font-medium mb-6">
                    {article.description}
                </div>

                {/* NỘI DUNG CHI TIẾT */}
                {/* class 'whitespace-pre-line' giúp hiển thị xuống dòng đúng như lúc nhập trong Admin */}
                <div className="prose max-w-none text-gray-800 leading-relaxed text-lg whitespace-pre-line">
                    {article.content}
                </div>

                {/* Tags (Giả lập) */}
                <div className="mt-8 pt-6 border-t flex items-center gap-2">
                    <FaTag className="text-gray-400" />
                    <span className="text-gray-500 text-sm">Tags:</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 hover:bg-lime-100 hover:text-lime-700 cursor-pointer transition">Nông nghiệp sạch</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 hover:bg-lime-100 hover:text-lime-700 cursor-pointer transition">Mẹo vặt</span>
                </div>
            </div>

            {/* 3. Bài viết liên quan */}
            {relatedNews.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-lime-600 pl-3">
                        Bài viết khác
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedNews.map((item: any) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
                                <Link href={`/news/${item._id}`}>
                                    <div className="relative h-40 w-full overflow-hidden">
                                        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-800 line-clamp-2 group-hover:text-lime-600 transition mb-2 text-sm h-10">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <FaCalendarAlt /> {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}