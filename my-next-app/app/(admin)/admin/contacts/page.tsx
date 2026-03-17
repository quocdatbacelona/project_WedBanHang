"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Thêm các icon cần thiết cho Search, Phân trang và Modal
import { 
  FaTrash, FaEnvelopeOpenText, FaPhone, FaUser, 
  FaSearch, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaTimes 
} from "react-icons/fa";

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE TÌM KIẾM & PHÂN TRANG ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // --- STATE MODAL XÓA ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch dữ liệu (Có Search + Phân trang)
  useEffect(() => {
    // Debounce: Đợi 500ms sau khi gõ xong mới gọi API
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        setIsLoading(true);
        try {
          // Tạo query string
          const query = new URLSearchParams({
            page: currentPage.toString(),
            limit: limit.toString(),
            search: searchTerm,
          });

          const res = await fetch(`http://localhost:5000/api/contacts?${query.toString()}`, {
            cache: "no-store"
          });
          const responseData = await res.json();

          // Xử lý dữ liệu trả về (Hỗ trợ cả format cũ và mới)
          if (Array.isArray(responseData)) {
             setContacts(responseData);
             setTotalItems(responseData.length);
          } else {
             setContacts(responseData.data || []);
             if (responseData.pagination) {
                setTotalPages(responseData.pagination.totalPages);
                setTotalItems(responseData.pagination.total);
                // Nếu page hiện tại > totalPages (do xóa hết item trang cuối), lùi lại
                if (responseData.pagination.page && responseData.pagination.page !== currentPage) {
                   // setCurrentPage(responseData.pagination.page); // Optional
                }
             }
          }
        } catch (err) {
          toast.error("Lỗi tải danh sách liên hệ");
        } finally {
          setIsLoading(false);
        }
      };

      fetchContacts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  // 2. Xử lý Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // 3. Mở Modal Xóa
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // 4. Thực hiện Xóa (Gọi khi bấm "Xóa" trong Modal)
  const executeDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Đã xóa tin nhắn thành công");
        // Reload lại dữ liệu để cập nhật phân trang
        // Trick nhanh: set lại search hoặc page để trigger useEffect, hoặc gọi lại fetch
        // Ở đây ta đơn giản là cập nhật UI tạm thời, nhưng tốt nhất là nên fetch lại
        const newContacts = contacts.filter((c) => c._id !== deleteId);
        setContacts(newContacts);
        
        // Nếu xóa hết item trên trang hiện tại, lùi về trang trước
        if (newContacts.length === 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        } else {
            // Hoặc gọi lại API để đồng bộ số liệu
            // fetchContacts(); // Cần tách hàm fetch ra ngoài useEffect nếu muốn gọi lại
        }
      } else {
        toast.error("Lỗi khi xóa");
      }
    } catch (err) {
      toast.error("Lỗi server");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // 5. Chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaEnvelopeOpenText className="text-lime-600" /> Quản lý Tin nhắn
            </h1>
            <p className="text-gray-500 text-sm mt-1">Tổng: <b>{totalItems}</b> tin nhắn</p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm theo SĐT, Email hoặc Tên..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white"
            />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
            <tr>
              <th className="p-4">Người gửi</th>
              <th className="p-4">Thông tin liên lạc</th>
              <th className="p-4 w-1/3">Nội dung tin nhắn</th>
              <th className="p-4">Ngày gửi</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
                <tr><td colSpan={5} className="text-center py-10">Đang tải dữ liệu...</td></tr>
            ) : contacts.length > 0 ? (
                contacts.map((contact: any) => (
                <tr key={contact._id} className="hover:bg-lime-50/30 transition">
                    <td className="p-4 align-top">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-600">
                            <FaUser size={14}/>
                        </div>
                        {contact.name}
                    </div>
                    </td>
                    <td className="p-4 align-top">
                    <div className="text-sm space-y-1.5">
                        <p className="flex items-center gap-2 group">
                            <FaEnvelopeOpenText className="text-blue-400 group-hover:text-blue-600" /> 
                            <a href={`mailto:${contact.email}`} className="text-gray-600 group-hover:text-blue-600 transition">{contact.email}</a>
                        </p>
                        <p className="flex items-center gap-2 group">
                            <FaPhone className="text-green-500 group-hover:text-green-700" /> 
                            <a href={`tel:${contact.phone}`} className="font-medium text-gray-600 group-hover:text-green-700 transition">{contact.phone}</a>
                        </p>
                    </div>
                    </td>
                    <td className="p-4 align-top">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 italic relative">
                        <span className="absolute -top-2 left-4 bg-white px-1 text-gray-400 text-xs">Message</span>
                        "{contact.message}"
                    </div>
                    </td>
                    <td className="p-4 align-top text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString("vi-VN")} <br/>
                        <span className="text-xs text-gray-400">{new Date(contact.createdAt).toLocaleTimeString("vi-VN")}</span>
                    </td>
                    <td className="p-4 align-top text-center">
                    <button
                        onClick={() => openDeleteModal(contact._id)}
                        className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 p-2.5 rounded-lg transition shadow-sm"
                        title="Xóa tin nhắn"
                    >
                        <FaTrash size={14}/>
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                        {searchTerm ? "Không tìm thấy tin nhắn nào phù hợp." : "Hộp thư trống."}
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
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
                <FaChevronLeft/>
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1.5 border rounded-lg text-sm font-bold transition ${
                        currentPage === i + 1 
                        ? 'bg-lime-600 text-white border-lime-600 shadow-md' 
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xóa tin nhắn?</h3>
              <p className="text-gray-500 text-sm">
                Bạn có chắc chắn muốn xóa tin nhắn liên hệ này không? <br/>
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-center border-t border-gray-100">
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