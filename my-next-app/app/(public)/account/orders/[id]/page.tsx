"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/component/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaReceipt, FaTag } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface OrderDetail {
  _id: string;
  items: any[];
  totalPrice: number;
  finalPrice?: number; // Giá sau giảm
  discountAmount?: number; // Số tiền giảm
  couponCode?: string; // Mã giảm giá
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  createdAt: string;
}

export default function UserOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/orders/detail/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
          return res.json();
        })
        .then((data) => {
          // Bảo mật: Kiểm tra xem đơn này có phải của user đang đăng nhập không
          if (user && data.userId._id !== user.id) {
             toast.error("Bạn không có quyền xem đơn hàng này!");
             router.push("/account/orders");
             return;
          }
          setOrder(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          // toast.error("Lỗi tải chi tiết đơn hàng");
          setIsLoading(false);
        });
    }
  }, [id, user, router]);

  if (isLoading) return <div className="p-10 text-center text-gray-500">Đang tải chi tiết...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Không tìm thấy đơn hàng.</div>;

  // Helper đổi màu trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto  px-4">
      <ToastContainer />
      
      {/* Header & Nút Quay lại */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/account/orders" className="flex items-center gap-2 text-gray-600 hover:text-lime-600 transition font-medium">
           <FaArrowLeft /> Quay lại danh sách
        </Link>
        <div className="text-right">
           <p className="text-sm text-gray-500">Mã đơn hàng</p>
           <h1 className="text-xl font-bold text-gray-800">#{order._id.slice(-6).toUpperCase()}</h1>
        </div>
      </div>

      {/* Trạng thái đơn hàng */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <p className="text-gray-500 text-sm mb-1">Ngày đặt hàng</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-gray-500 text-sm mb-1">Trạng thái</p>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                   {order.status === "Pending" ? "Chờ xử lý" : 
                    order.status === "Shipped" ? "Đang giao hàng" : 
                    order.status === "Delivered" ? "Giao thành công" : order.status}
                </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* CỘT TRÁI: Sản phẩm */}
         <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaBoxOpen className="text-lime-600"/> Sản phẩm</h3>
               <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                     <div key={idx} className="flex gap-4 border-b last:border-0 pb-4 last:pb-0">
                        <div className="relative w-20 h-20 border rounded-lg overflow-hidden shrink-0">
                           <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                           <p className="font-bold text-gray-800 line-clamp-2">{item.name}</p>
                           <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lime-600">{(item.price * item.quantity).toLocaleString()} ₫</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Chi tiết thanh toán */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FaReceipt className="text-lime-600"/> Thanh toán</h3>
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                     <span>Tổng tiền hàng</span>
                     <span>{order.totalPrice.toLocaleString()} ₫</span>
                  </div>
                  
                  {/* Hiển thị Coupon nếu có */}
                  {order.discountAmount && order.discountAmount > 0 ? (
                     <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded">
                        <span className="flex items-center gap-1"><FaTag /> Voucher ({order.couponCode})</span>
                        <span className="font-bold">- {order.discountAmount.toLocaleString()} ₫</span>
                     </div>
                  ) : null}

                  <div className="flex justify-between text-gray-600">
                     <span>Phí vận chuyển</span>
                     <span>Miễn phí</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-2 flex justify-between items-center">
                     <span className="font-bold text-gray-800 text-lg">Thành tiền</span>
                     <span className="font-bold text-xl text-red-600">
                        {order.finalPrice ? order.finalPrice.toLocaleString() : order.totalPrice.toLocaleString()} ₫
                     </span>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                      <p className="text-gray-600 mb-1">Phương thức thanh toán:</p>
                      <p className="font-semibold text-gray-800">
                          {order.paymentMethod === "Transfer" ? "Chuyển khoản Ngân hàng" : "Thanh toán khi nhận hàng (COD)"}
                      </p>
                      <p className={`mt-2 text-sm font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                          {order.paymentStatus === 'Paid' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
                      </p>
                  </div>
               </div>
            </div>
         </div>

         {/* CỘT PHẢI: Thông tin giao hàng */}
         <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6">
               <h3 className="font-bold text-lg mb-4 border-b pb-2">Thông tin nhận hàng</h3>
               <div className="space-y-4">
                  <div>
                     <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FaUser /> Người nhận</p>
                     <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FaPhoneAlt /> Điện thoại</p>
                     <p className="font-semibold">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-500 mb-1 flex items-center gap-2"><FaMapMarkerAlt /> Địa chỉ</p>
                     <p className="font-semibold text-gray-800 leading-relaxed">
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                     </p>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
import { FaUser, FaBoxOpen } from "react-icons/fa";