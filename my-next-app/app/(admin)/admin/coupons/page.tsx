"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Thêm các icon cần thiết
import { 
  FaTrash, FaTicketAlt, FaSearch, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaPlus 
} from "react-icons/fa";

export default function AdminCouponPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE TÌM KIẾM & PHÂN TRANG ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5; // Yêu cầu: 5 item mỗi trang

  // --- STATE MODAL XÓA ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // --- STATE FORM ---
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minOrderValue: 0,
    expiryDate: "",
    usageLimit: 100
  });

  // 1. Fetch dữ liệu (Search + Pagination)
  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        search: searchTerm,
      });

      const res = await fetch(`http://localhost:5000/api/coupons?${query.toString()}`, { cache: "no-store" });
      const responseData = await res.json();

      if (Array.isArray(responseData)) {
         setCoupons(responseData);
         setTotalItems(responseData.length);
      } else {
         setCoupons(responseData.data || []);
         if (responseData.pagination) {
            setTotalPages(responseData.pagination.totalPages);
            setTotalItems(responseData.pagination.total);
         }
      }
    } catch (err) {
      toast.error("Lỗi tải danh sách mã");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce Search & Fetch when page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoupons();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  // 2. Xử lý tạo mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      toast.success("Tạo mã giảm giá thành công!");
      setFormData({ ...formData, code: "", discountValue: "" });
      fetchCoupons(); // Reload lại list
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 3. Mở Modal Xóa
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // 4. Thực hiện xóa
  const executeDelete = async () => {
    if (!deleteId) return;
    try {
        await fetch(`http://localhost:5000/api/coupons/${deleteId}`, { method: "DELETE" });
        toast.success("Đã xóa mã!");
        fetchCoupons(); // Reload lại list
    } catch (err) {
        toast.error("Lỗi khi xóa");
    } finally {
        setShowDeleteModal(false);
        setDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaTicketAlt className="text-blue-600" /> Quản lý Mã Giảm Giá
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT: FORM TẠO MÃ === */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-6">
          <h2 className="font-bold text-lg mb-4 text-blue-600 flex items-center gap-2">
             <FaPlus/> Thêm mã mới
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Code (VD: TET2025)</label>
              <input type="text" className="w-full border p-2 rounded uppercase font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm</label>
                <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
                  <option value="percent">Theo %</option>
                  <option value="amount">Số tiền (VNĐ)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm</label>
                <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: 10"
                  value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} required />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (VNĐ)</label>
               <input type="number" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: parseInt(e.target.value)})} />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Hạn sử dụng</label>
               <input type="date" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required
                  value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
              Tạo Mã Ngay
            </button>
          </form>
        </div>

        {/* === RIGHT: DANH SÁCH MÃ === */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
                <FaSearch className="text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo mã code..." 
                    className="flex-1 outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                    <tr>
                        <th className="p-4">Mã Code</th>
                        <th className="p-4">Giảm</th>
                        <th className="p-4">Đơn tối thiểu</th>
                        <th className="p-4">Hết hạn</th>
                        <th className="p-4 text-center">Xóa</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-500">Đang tải...</td></tr>
                    ) : coupons.length > 0 ? (
                        coupons.map((c: any) => (
                        <tr key={c._id} className="border-b last:border-0 hover:bg-blue-50/30 transition">
                            <td className="p-4 font-bold text-blue-600">{c.code}</td>
                            <td className="p-4 font-bold text-green-600">
                            {c.discountType === 'percent' ? `${c.discountValue}%` : `${Number(c.discountValue).toLocaleString()}đ`}
                            </td>
                            <td className="p-4 text-sm text-gray-600">{c.minOrderValue?.toLocaleString()}đ</td>
                            <td className="p-4 text-sm text-gray-600">{new Date(c.expiryDate).toLocaleDateString('vi-VN')}</td>
                            <td className="p-4 text-center">
                            <button onClick={() => openDeleteModal(c._id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                                <FaTrash />
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5} className="text-center py-10 text-gray-400">Không tìm thấy mã nào</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                        className="px-3 py-1.5 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FaChevronLeft/>
                    </button>
                    <span className="px-4 py-1.5 bg-white border rounded font-bold text-blue-600">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="px-3 py-1.5 bg-white border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FaChevronRight/>
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa mã giảm giá?</h3>
              <p className="text-gray-500 text-sm">
                Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa mã này không?
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-center border-t">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <FaTrash size={14} /> Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}