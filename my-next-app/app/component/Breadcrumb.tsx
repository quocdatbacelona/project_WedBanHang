// Địa chỉ file: app/component/Breadcrumb.tsx
"use client"; // (Nên là client component vì nó dùng Link)

import React from 'react';
import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa'; // (Icon mũi tên)

// 1. Định nghĩa kiểu cho MỘT item
interface BreadcrumbItem {
  label: string;
  href?: string; // Dấu ? nghĩa là href là tùy chọn
}

// 2. Định nghĩa kiểu cho TẤT CẢ props
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}


// 3. Áp dụng kiểu vào component
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="col-span-12 mt-6 flex items-center gap-2 text-gray-700">
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;

        if (isLastItem) {
          // Item cuối (trang hiện tại), in đậm
          return (
            <strong key={index} className="text-gray-900">
              {item.label}
            </strong>
          );
        }

        // Các item trước, dùng Link và icon
        return (
          <React.Fragment key={index}>
            <span>
              <Link href={item.href || "/"} className="hover:text-lime-600">
                {item.label}
              </Link>
            </span>
            <span className="text-gray-400">
              <FaAngleRight />
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}