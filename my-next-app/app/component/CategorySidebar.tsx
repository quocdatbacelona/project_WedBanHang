"use client"
import React from "react";
import Link from "next/link";
import { FaArrowAltCircleRight } from "react-icons/fa";

// 👇 Đã cập nhật slug chuẩn khớp 100% với trang Sản Phẩm
const categories = [

  { name: "Rau sạch", slug: "rau-cu" },
  { name: "Thịt tươi", slug: "do-an-vat" },
  { name: "Hoa quả tươi", slug: "trai-cay" },
  { name: "Hải sản tươi", slug: "hai-san" },
  { name: "Rau Đà Lạt", slug: "rau-cu" }, 
  { name: "Rau Đà Nẵng", slug: "rau-cu" },
  { name: "Trái cây", slug: "trai-cay" },
  { name: "Xem thêm", slug: "all" },
];

export default function CategorySidebar() {
  return (
    <aside className="border border-[#EBEBEB] rounded-xl border-t-0 hidden md:block bg-white">
      <h2 className="bg-lime-600 text-white text-lg font-bold px-4 py-3 rounded-xl uppercase shadow-sm">
        DANH MỤC
      </h2>
      <ul className="divide-y px-4">
        {categories.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-2 py-3 cursor-pointer border-b-[#EBEBEB] group"
          >
            <FaArrowAltCircleRight className="text-lime-600 group-hover:translate-x-1 transition-transform" />
            
            {/* 👇 Đảm bảo ném thẳng sang trang /products kèm theo category */}
            <Link 
              href={item.slug === "all" ? "/products" : `/products?category=${item.slug}`} 
              className="text-[#363636] group-hover:text-lime-700 no-underline font-medium w-full block"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}