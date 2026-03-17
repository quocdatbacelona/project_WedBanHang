// Địa chỉ file: app/(admin)/admin/orders/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Order, CartItem, SimpleUser } from "@/app/types"; // Import kiểu
import { toast, ToastContainer } from "react-toastify";
import { FaBoxes, FaUser, FaTruck } from "react-icons/fa"; // Thêm icon

// Mở rộng interface để hứng dữ liệu populate từ backend
interface OrderDetail extends Omit<Order, 'userId'> {
  shippingAddress: any;
  paymentStatus: string;
  paymentMethod: string;
  // userId giờ là object đầy đủ thông tin user để hiển thị
  userId: {
    _id: string;
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chi tiết đơn hàng
 // Trong file: app/(admin)/admin/orders/[id]/page.tsx

  // Fetch chi tiết đơn hàng
  useEffect(() => {
    // 1. Kiểm tra xem đã lấy được ID từ URL chưa
    console.log("🟢 1. ID lấy từ URL là:", id);

    if (!id) {
        console.log("🔴 Chưa có ID, đang chờ...");
        return;
    }

    console.log(`🟢 2. Bắt đầu gọi API: http://localhost:5000/api/orders/detail/${id}`);

    fetch(`http://localhost:5000/api/orders/detail/${id}`)
      .then(res => {
          console.log("🟢 3. Trạng thái API:", res.status);
          if (!res.ok) {
            // Nếu lỗi, cố gắng đọc nội dung lỗi từ server gửi về
            return res.text().then(text => { throw new Error(text || "Lỗi API") });
          }
          return res.json();
      })
      .then(data => {
          console.log("🟢 4. Dữ liệu nhận được:", data);
          setOrder(data);
      })
      .catch(err => {
          console.error("🔴 LỖI FETCH:", err);
          toast.error("Lỗi: " + err.message);
      })
      .finally(() => {
          // QUAN TRỌNG: Dù thành công hay thất bại cũng phải tắt Loading
          console.log("🟢 5. Đã chạy xong, tắt Loading.");
          setIsLoading(false); 
      });

  }, [id, router]);

  // Hàm đổi trạng thái (tái sử dụng logic cũ)
  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrder = await res.json();
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: updatedOrder.status } : null);
        toast.success(`Trạng thái cập nhật thành ${newStatus}!`);
      } else {
        throw new Error(updatedOrder.message || "Lỗi cập nhật");
      }
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Hàm xác nhận đã nhận tiền chuyển khoản
  const handlePaymentVerify = async () => {
    if (!confirm("Bạn chắc chắn đã nhận được tiền trong tài khoản ngân hàng chưa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            paymentStatus: "Paid", // Cập nhật thành Đã thanh toán
            status: "Shipped" // (Tuỳ chọn) Tự động chuyển đơn sang Đang giao luôn cho tiện
        }),
      });
      
      const updatedOrder = await res.json();
      if (res.ok) {
        setOrder(prev => prev ? { 
            ...prev, 
            paymentStatus: updatedOrder.paymentStatus,
            status: updatedOrder.status 
        } : null);
        toast.success("Đã xác nhận thanh toán thành công!");
      } else {
        throw new Error(updatedOrder.message);
      }
    } catch (err) {
       toast.error("Lỗi cập nhật thanh toán");
    }
  };

  // Hàm helper để đổi màu trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500 text-white";
      case "Shipped": return "bg-blue-500 text-white";
      case "Delivered": return "bg-green-500 text-white";
      case "Cancelled": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  if (isLoading || !order) return <div className="p-10 text-center">Đang tải chi tiết...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="text-gray-500 hover:text-gray-800 text-lg">← Quay lại</Link>
            <h1 className="text-3xl font-bold text-gray-800">Đơn hàng <span className="font-mono">#{order._id.slice(-6)}</span></h1>
        </div>
        
        {/* Bộ đổi trạng thái */}
        <select 
            value={order.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`p-3 rounded-lg text-lg font-bold shadow-md cursor-pointer ${getStatusColor(order.status)}`}
        >
            <option value="Pending">Chờ xử lý</option>
            <option value="Shipped">Đang giao</option>
            <option value="Delivered">Đã giao</option>
            <option value="Cancelled">Đã hủy</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột Trái: Sản phẩm và Tổng kết */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b font-bold text-gray-700 flex items-center gap-2"><FaBoxes /> Sản phẩm đặt mua</div>
                <div className="p-6 space-y-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 border rounded overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.price.toLocaleString()} ₫</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">x{item.quantity}</p>
                                <p className="text-lime-600 font-bold">{(item.price * item.quantity).toLocaleString()} ₫</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                    <span className="font-bold text-gray-600">Tổng tiền thanh toán</span>
                    <span className="text-2xl font-bold text-red-600">{order.totalPrice.toLocaleString()} ₫</span>
                </div>
            </div>
            
           <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Thanh toán</h3>
                <p className={`font-semibold ${order.paymentMethod === 'Cash' ? 'text-blue-600' : 'text-lime-600'}`}>
                    Phương thức: {order.paymentMethod === 'Cash' ? 'Tiền mặt (COD)' : 'Chuyển khoản Ngân hàng'}
                </p>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                    Trạng thái: <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus}</span>
                </p>

                {/* LOGIC HIỂN THỊ NÚT DUYỆT:
                    Chỉ hiện khi:
                    1. Là chuyển khoản (Transfer)
                    2. Chưa thanh toán (khác 'Paid')
                */}
                {order.paymentMethod === "Transfer" && order.paymentStatus !== "Paid" && (
                    <button 
                        onClick={handlePaymentVerify}
                        className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition font-bold text-sm"
                    >
                     Xác nhận đã nhận tiền
                    </button>
                )}
            </div>  
        </div>

        {/* Cột Phải: Thông tin khách hàng & Địa chỉ */}
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><FaUser /> Thông tin người mua</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-gray-500">Họ tên:</p>
                        <p className="font-semibold">{order.shippingAddress?.fullName || order.userId?.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Số điện thoại:</p>
                        <p className="font-semibold">{order.shippingAddress?.phone || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email tài khoản:</p>
                        <p className="font-semibold">{order.userId?.email}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2"><FaTruck /> Địa chỉ giao hàng</h3>
                <p className="text-gray-700 leading-relaxed">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}