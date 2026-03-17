"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f4f4f4] text-gray-700">
      {/* Nội dung chính */}
      <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Liên hệ */}
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold border-l-4 border-green-600 pl-2">
            Liên hệ
          </h3>
          <p className="text-sm">
            Chúng tôi chuyên cung cấp các sản phẩm thực phẩm sạch, an toàn cho
            sức khỏe con người.
          </p>
          <ul className="grid gap-2 text-sm">
            <li className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <i className="fa-solid fa-location-dot text-green-600 mt-1"></i>
              <span>483 Tôn Đức Thắng, Liên Chiểu, Đà Nẵng</span>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <i className="fa-solid fa-phone text-green-600 mt-1"></i>
              <div>
                <Link href="#" className="text-green-700 font-semibold">
                  1900 6750
                </Link>
                <p>Thứ 2 - Chủ nhật: 9:00 - 18:00</p>
              </div>
            </li>
            <li className="grid grid-cols-[auto_1fr] gap-2 items-start">
              <i className="fa-solid fa-envelope text-green-600 mt-1"></i>
              <Link href="#" className="hover:underline">
                support@sapo.vn
              </Link>
            </li>
          </ul>
        </div>

        {/* Danh mục */}
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold border-l-4 border-green-600 pl-2">
            Danh mục
          </h3>
          <ul className="grid gap-2 text-sm">
            {["Trang chủ", "Sản phẩm", "Giới thiệu", "Tin tức", "Liên hệ", "Chỉ đường"].map(
              (item) => (
                <li
                  key={item}
                  className="grid grid-cols-[auto_1fr] gap-2 items-center"
                >
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <Link href="#" className="hover:text-green-700">
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold border-l-4 border-green-600 pl-2">
            Hỗ trợ khách hàng
          </h3>
          <ul className="grid gap-2 text-sm">
            {[
              "Chính sách đổi trả",
              "Bảo mật thông tin",
              "Hướng dẫn mua hàng",
              "Thanh toán",
              "Giao hàng",
              "Liên hệ hỗ trợ",
            ].map((item) => (
              <li
                key={item}
                className="grid grid-cols-[auto_1fr] gap-2 items-center"
              >
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                <Link href="#" className="hover:text-green-700">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kết nối */}
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold border-l-4 border-green-600 pl-2">
            Kết nối với GREEN Plus
          </h3>
          <div className="grid grid-cols-3 gap-3 w-max">
            {[
              { icon: "facebook-f", color: "bg-[#3b5998]" },
              { icon: "instagram", color: "bg-[#e4405f]" },
              { icon: "youtube", color: "bg-[#ff0000]" },
            ].map((item, index) => (
              <Link
                key={index}
                href="#"
                className={`w-9 h-9 flex items-center justify-center text-white rounded-full hover:opacity-90 ${item.color}`}
              >
                <i className={`fa-brands fa-${item.icon}`}></i>
              </Link>
            ))}
          </div>
          <p className="text-sm mt-2">
            Theo dõi để cập nhật ưu đãi mới nhất.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-green-700 text-white text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center justify-between py-3 px-6 gap-4">
          <span className="text-center md:text-left">
            © Bản quyền thuộc về <b>GREEN Plus</b> | Cung cấp bởi{" "}
            <Link href="#" className="underline">
              Sapo
            </Link>
          </span>
          <ul className="flex flex-wrap justify-center md:justify-end gap-4">
            {["Trang chủ", "Sản phẩm", "Giới thiệu", "Tin tức", "Liên hệ", "Chỉ đường"].map(
              (item) => (
                <li key={item}>
                  <Link href="#" className="hover:underline">
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
