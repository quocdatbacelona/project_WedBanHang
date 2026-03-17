"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/component/AuthContext";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBoxOpen, FaEye, FaArrowLeft, FaTag } from "react-icons/fa";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/orders/my-orders/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Lỗi tải lịch sử đơn hàng");
          setIsLoading(false);
        });
    }
  }, [user]);

  if (!user) return null;

  if (isLoading) return <div className="p-10 text-center text-gray-500">Đang tải đơn hàng...</div>;

  return (
    <div className="max-w-6xl mx-auto  px-4">
      <ToastContainer />
      
      <div className="flex items-center gap-4 mb-8">
        
        <h1 className="text-3xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed">
          <FaBoxOpen className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào.</p>
          <Link href="/products" className="text-lime-600 font-bold hover:underline mt-2 inline-block">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Mã đơn</th>
                <th className="p-4 font-semibold text-gray-600">Ngày đặt</th>
                <th className="p-4 font-semibold text-gray-600">Tổng tiền</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  {/* Cột Mã Đơn */}
                  <td className="p-4">
                    <span className="font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</span>
                    {/* Hiển thị icon Coupon nếu có */}
                    {order.couponCode && (
                        <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <FaTag /> {order.couponCode}
                        </div>
                    )}
                  </td>

                  {/* Cột Ngày đặt */}
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    <br />
                    <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </td>

                  {/* Cột Tổng tiền (LOGIC HIỂN THỊ GIẢM GIÁ Ở ĐÂY) */}
                  <td className="p-4">
                    {order.discountAmount > 0 ? (
                        <div>
                            {/* Giá cũ gạch ngang */}
                            <span className="text-gray-400 text-xs line-through block">
                                {order.totalPrice.toLocaleString()} ₫
                            </span>
                            {/* Giá mới màu đỏ */}
                            <span className="text-red-600 font-bold text-lg">
                                {order.finalPrice ? order.finalPrice.toLocaleString() : order.totalPrice.toLocaleString()} ₫
                            </span>
                        </div>
                    ) : (
                        // Không giảm giá thì hiện bình thường
                        <span className="font-bold text-gray-800">
                            {order.totalPrice.toLocaleString()} ₫
                        </span>
                    )}
                  </td>

                  {/* Cột Trạng thái */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-block
                        ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                          order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.status === "Pending" ? "Chờ xử lý" :
                       order.status === "Shipped" ? "Đang giao" :
                       order.status === "Delivered" ? "Giao thành công" :
                       order.status === "Cancelled" ? "Đã hủy" : order.status}
                    </span>
                  </td>

                  {/* Nút xem chi tiết (Tùy chọn nếu bạn làm trang chi tiết cho user) */}
                  <td className="p-4 text-center">
                   <Link 
    href={`/account/orders/${order._id}`} 
    className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-full inline-block transition"
    title="Xem chi tiết đơn hàng"
  >
      <FaEye />
  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}