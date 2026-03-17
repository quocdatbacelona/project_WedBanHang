// Địa chỉ file: app/admin/orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Order, SimpleUser } from "@/app/types"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Thêm icon Search
import { FaEye, FaBoxOpen, FaChevronLeft, FaChevronRight, FaTimes, FaUser, FaMapMarkerAlt, FaPhoneAlt, FaMoneyBillWave, FaSearch } from "react-icons/fa";

// Định nghĩa kiểu dữ liệu mở rộng cho hiển thị
interface PopulatedOrder extends Omit<Order, 'userId'> {
  userId: SimpleUser;
  finalPrice?: number;
  discountAmount?: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PopulatedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE PHÂN TRANG & TÌM KIẾM ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State tìm kiếm
  const limit = 10;

  // --- STATE MODAL CHI TIẾT ---
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PopulatedOrder | null>(null);

  // 1. Fetch Orders (Có search & debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          // Tạo query string
          const query = new URLSearchParams({
            page: currentPage.toString(),
            limit: limit.toString(),
            search: searchTerm,
          });

          const res = await fetch(`http://localhost:5000/api/orders?${query.toString()}`, {
            cache: "no-store",
          });
          
          if (!res.ok) throw new Error("Không thể tải đơn hàng");
          
          const responseData = await res.json();
          
          // Xử lý dữ liệu trả về
          if (Array.isArray(responseData)) {
              setOrders(responseData);
              setTotalOrders(responseData.length);
          } else {
              setOrders(responseData.data || []);
              if (responseData.pagination) {
                  setTotalPages(responseData.pagination.totalPages);
                  setTotalOrders(responseData.pagination.total);
                  // Cập nhật page nếu backend trả về page khác (do search)
                  if (responseData.pagination.page && responseData.pagination.page !== currentPage) {
                      // setCurrentPage(responseData.pagination.page); // Tạm tắt để tránh loop nếu backend không chuẩn
                  }
              }
          }
        } catch (err) {
          console.error(err);
          // if (err instanceof Error) toast.error(err.message); // Tắt bớt thông báo lỗi khi gõ
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }, 500); // Delay 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  // Hàm xử lý khi nhập tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1
  };

  // 2. Xử lý đổi trạng thái
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const updatedOrder = await res.json();
      if (!res.ok) throw new Error(updatedOrder.message || "Lỗi cập nhật");

      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      
      if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  // 3. Xử lý xác nhận thanh toán
  const handlePaymentVerify = async () => {
    if (!selectedOrder) return;
    if (!confirm("Bạn chắc chắn đã nhận được tiền chuyển khoản?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            paymentStatus: "Paid", 
            status: "Shipped" 
        }),
      });
      
      const updatedOrder = await res.json();
      if (res.ok) {
        const newOrderData = { ...selectedOrder, paymentStatus: updatedOrder.paymentStatus, status: updatedOrder.status };
        setSelectedOrder(newOrderData);
        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? newOrderData : o));
        toast.success("Đã xác nhận thanh toán thành công!");
      } else {
        throw new Error(updatedOrder.message);
      }
    } catch (err: any) {
       toast.error("Lỗi cập nhật thanh toán: " + err.message);
    }
  };

  // 4. Mở Modal Chi tiết
  const openDetailModal = (order: PopulatedOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // 5. Helper màu sắc
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // 6. Chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  // if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-600"></div></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* --- HEADER KHU VỰC QUẢN LÝ --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        
        {/* Left: Title & Count */}
        <div className="w-full md:w-auto">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaBoxOpen className="text-lime-600"/> Quản lý Đơn hàng
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                Tổng cộng: <b>{totalOrders}</b> đơn hàng 
                {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
            </p>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 w-full md:max-w-md mx-0 md:mx-4">
            <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lime-600 transition-colors" size={16} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Tên khách, SĐT..." 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm"
                />
            </div>
        </div>

        {/* Right: Spacer hoặc nút Filter khác (để trống cho cân đối) */}
        <div className="w-full md:w-auto hidden md:block">
            {/* Có thể thêm bộ lọc trạng thái ở đây sau này */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Mã Đơn</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Khách hàng</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Ngày đặt</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && orders.length === 0 ? (
                 <tr><td colSpan={6} className="text-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto"></div></td></tr>
            ) : orders.length > 0 ? (
                orders.map((order) => (
                <tr key={order._id} className="hover:bg-lime-50/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600" title={order._id}>#{order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.shippingAddress?.fullName || "Khách lẻ"}</div>
                        <div className="text-xs text-gray-500">{order.shippingAddress?.phone || order.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {order.discountAmount && order.discountAmount > 0 ? (
                            <div>
                                <span className="text-xs text-gray-400 line-through block">{order.totalPrice.toLocaleString()}</span>
                                <span className="text-lime-700 font-bold">{order.finalPrice?.toLocaleString()} ₫</span>
                            </div>
                        ) : (
                            <span className="text-lime-700 font-bold">{order.totalPrice.toLocaleString()} ₫</span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`py-1 px-3 rounded-full text-xs font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-lime-500 ${getStatusColor(order.status)}`}
                        >
                            <option value="Pending">Chờ xử lý</option>
                            <option value="Shipped">Đang giao</option>
                            <option value="Delivered">Đã giao</option>
                            <option value="Cancelled">Đã hủy</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                            onClick={() => openDetailModal(order)} 
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 mx-auto"
                        >
                            <FaEye /> Xem
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">
                    {searchTerm ? "Không tìm thấy đơn hàng nào khớp với từ khóa." : "Chưa có đơn hàng nào."}
                </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
            <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
                <FaChevronLeft/>
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border rounded text-sm font-medium ${currentPage === i + 1 ? 'bg-lime-600 text-white border-lime-600' : 'hover:bg-gray-50'}`}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
                <FaChevronRight/>
            </button>
        </div>
      )}

      {/* ================= MODAL CHI TIẾT ĐƠN HÀNG (Giữ nguyên) ================= */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-lime-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FaBoxOpen /> Chi tiết đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}
                    </h2>
                    <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Info */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2"><FaUser className="text-lime-600"/> Thông tin giao hàng</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500 w-24 inline-block">Người nhận:</span> <span className="font-semibold">{selectedOrder.shippingAddress?.fullName}</span></p>
                                <p><span className="text-gray-500 w-24 inline-block"><FaPhoneAlt className="inline mr-1"/> SĐT:</span> <span className="font-semibold">{selectedOrder.shippingAddress?.phone}</span></p>
                                <p className="flex items-start"><span className="text-gray-500 w-24 inline-block shrink-0"><FaMapMarkerAlt className="inline mr-1"/> Địa chỉ:</span> <span>{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</span></p>
                            </div>
                        </div>
                        {/* Payment */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2"><FaMoneyBillWave className="text-lime-600"/> Thanh toán</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500 w-28 inline-block">Phương thức:</span> 
                                    <span className="font-semibold bg-white px-2 py-0.5 rounded border">
                                        {selectedOrder.paymentMethod === 'Cash' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}
                                    </span>
                                </p>
                                <p><span className="text-gray-500 w-28 inline-block">Trạng thái TT:</span> 
                                    <span className={`font-bold ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {selectedOrder.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </p>
                                <p><span className="text-gray-500 w-28 inline-block">Trạng thái đơn:</span> 
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </p>
                                {selectedOrder.paymentMethod === "Transfer" && selectedOrder.paymentStatus !== "Paid" && (
                                    <button onClick={handlePaymentVerify} className="mt-3 w-full bg-lime-600 text-white py-1.5 rounded hover:bg-lime-700 transition font-bold text-xs">
                                        Xác nhận đã nhận tiền
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Products Table */}
                    <div className="border rounded-xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3 text-left">Sản phẩm</th>
                                    <th className="px-4 py-3 text-center">Số lượng</th>
                                    <th className="px-4 py-3 text-right">Đơn giá</th>
                                    <th className="px-4 py-3 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {selectedOrder.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <div className="relative w-10 h-10 border rounded overflow-hidden shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover"/>
                                            </div>
                                            <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">x{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-gray-600">{item.price.toLocaleString()} ₫</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-800">{(item.price * item.quantity).toLocaleString()} ₫</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-600">Tổng tiền:</td>
                                    <td className="px-4 py-3 text-right font-bold text-lime-700 text-lg">
                                        {selectedOrder.finalPrice ? selectedOrder.finalPrice.toLocaleString() : selectedOrder.totalPrice.toLocaleString()} ₫
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-end shrink-0">
                    <button onClick={() => setShowModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition">Đóng</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}