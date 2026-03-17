"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Nhận danh sách products từ trang cha để đếm số lượng
export default function ProductSidebar({ products }: { products: any[] }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  // 1. TỰ ĐỘNG ĐẾM SỐ LƯỢNG SẢN PHẨM TRONG TỪNG DANH MỤC
  const counts = {
    "all": products.length,
    "trai-cay": 0,
    "featured": 0, 
    "rau-cu": 0,
    "do-an-vat": 0,
    "hai-san": 0
  };

  products.forEach(p => {
     const cat = String(p.category || p.danhmuc?.TenDM || "").toLowerCase();
     
     const name = String(p.name || p.TenSP || "").toLowerCase();

     // Giữ logic chỉnh lại quả Hồng cho chuẩn
     let adjustedCat = cat;
     if (name.includes("hồng") && (cat.includes("vegetable") || cat.includes("rau"))) {
         adjustedCat = "fruit";
     }

     if (adjustedCat.includes("trái cây") || adjustedCat.includes("quả") || adjustedCat.includes("fruit")) counts["trai-cay"]++;
     else if (adjustedCat.includes("rau củ") || adjustedCat.includes("rau") || adjustedCat.includes("vegetable")) counts["rau-cu"]++;
     else if (adjustedCat.includes("đồ ăn vặt") || adjustedCat.includes("ăn vặt")) counts["do-an-vat"]++;
     else if (adjustedCat.includes("hải sản") || adjustedCat.includes("cá") || adjustedCat.includes("seafood")) counts["hai-san"]++;
  });

  // 2. DANH SÁCH HIỂN THỊ
  const categories = [
    { name: "Tất cả sản phẩm", slug: "all", count: counts["all"] },
    { name: "Trái cây", slug: "trai-cay", count: counts["trai-cay"] },
    { name: "Rau củ", slug: "rau-cu", count: counts["rau-cu"] },
    { name: "Đồ ăn vặt", slug: "do-an-vat", count: counts["do-an-vat"] },
    { name: "Hải sản", slug: "hai-san", count: counts["hai-san"] }
  ];

  return (
    <ul className="space-y-2">
      {categories.map((cat, idx) => {
        // Kiểm tra xem danh mục nào đang được chọn để bôi màu xanh
        const isActive = currentCategory === cat.slug || (!searchParams.get("category") && cat.slug === "all");
        
        return (
          <li key={idx}>
            {/* 👇 Dùng the Link để đổi URL, giúp trang Sản phẩm tự động bắt tín hiệu */}
            <Link
              href={cat.slug === "all" ? "/products" : `/products?category=${cat.slug}`}
              className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-lime-50 text-lime-700 font-bold border-l-4 border-lime-500" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-lime-600 hover:pl-5"
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                isActive ? "bg-lime-200 text-lime-800" : "bg-gray-100 text-gray-500"
              }`}>
                {cat.count}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}