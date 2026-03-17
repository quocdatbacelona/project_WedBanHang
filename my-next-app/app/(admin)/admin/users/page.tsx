"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Thêm các icon cần thiết
import { 
  FaTrash, FaUserShield, FaUser, FaSearch, 
  FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaMapMarkerAlt, FaPhone 
} from "react-icons/fa";

interface UserData {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: string;
  address?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE TÌM KIẾM & PHÂN TRANG ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10; // Yêu cầu: 10 user/trang

  // --- STATE MODAL XÓA ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch dữ liệu (Search + Pagination)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        search: searchTerm,
      });

      const res = await fetch(`http://localhost:5000/api/users?${query.toString()}`, { 
        cache: "no-store" 
      });
      const responseData = await res.json();

      if (Array.isArray(responseData)) {
         setUsers(responseData);
         setTotalItems(responseData.length);
      } else {
         setUsers(responseData.data || []);
         if (responseData.pagination) {
            setTotalPages(responseData.pagination.totalPages);
            setTotalItems(responseData.pagination.total);
         }
      }
    } catch (err) {
      toast.error("Lỗi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  // 2. Mở Modal Xóa
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // 3. Thực hiện Xóa
  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Đã xóa người dùng!");
        fetchUsers(); // Reload lại danh sách
      } else {
        toast.error("Lỗi khi xóa");
      }
    } catch (err) {
      toast.error("Không thể xóa người dùng");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaUserShield className="text-purple-600" /> Quản lý Người dùng
            </h1>
            <p className="text-gray-500 text-sm mt-1">Tổng cộng: <b>{totalItems}</b> tài khoản</p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm theo tên, email hoặc SĐT..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white transition-all"
            />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
            <tr>
              <th className="px-6 py-4 text-left uppercase text-xs">Thông tin</th>
              <th className="px-6 py-4 text-left uppercase text-xs">Liên hệ</th>
              <th className="px-6 py-4 text-left uppercase text-xs">Địa chỉ</th>
              <th className="px-6 py-4 text-center uppercase text-xs">Vai trò</th>
              <th className="px-6 py-4 text-center uppercase text-xs">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : users.length > 0 ? (
                users.map((user) => (
                <tr key={user._id} className="hover:bg-purple-50/30 transition">
                    {/* Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-500'}`}>
                                {user.email[0].toUpperCase()}
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-bold text-gray-800">{user.fullName || "Chưa đặt tên"}</div>
                                <div className="text-xs text-gray-400 font-mono">ID: {user._id.slice(-6).toUpperCase()}</div>
                            </div>
                        </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{user.email}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <FaPhone size={10} className="text-gray-400"/> {user.phone || "---"}
                        </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2 max-w-[200px] truncate" title={user.address}>
                            <FaMapMarkerAlt className="text-gray-300 shrink-0"/> 
                            {user.address || "Chưa cập nhật"}
                        </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.role === 'admin' ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-purple-100 text-purple-700 items-center gap-1 border border-purple-200">
                                <FaUserShield /> Admin
                            </span>
                        ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-50 text-blue-600 items-center gap-1 border border-blue-100">
                                <FaUser /> Khách
                            </span>
                        )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                            onClick={() => openDeleteModal(user._id)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition"
                            title="Xóa tài khoản"
                        >
                            <FaTrash />
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                        {searchTerm ? "Không tìm thấy người dùng nào." : "Danh sách trống."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6 gap-2">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50 shadow-sm"
            >
                <FaChevronLeft/>
            </button>
            <span className="px-4 py-1.5 bg-white border rounded-lg font-bold text-gray-700 shadow-sm">
                {currentPage} / {totalPages}
            </span>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50 shadow-sm"
            >
                <FaChevronRight/>
            </button>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                <FaExclamationTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa người dùng?</h3>
              <p className="text-gray-500 text-sm">
                Bạn có chắc chắn muốn xóa tài khoản này không? <br/>
                Dữ liệu liên quan sẽ bị ảnh hưởng.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-center border-t">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium transition shadow-sm"
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