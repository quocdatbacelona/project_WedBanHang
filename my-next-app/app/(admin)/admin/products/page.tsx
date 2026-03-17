// Địa chỉ file: app/(admin)/admin/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Thêm icon Search
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaChevronLeft, FaChevronRight, FaTimes, FaSave, FaExclamationTriangle, FaSearch } from "react-icons/fa";

interface ProductForm {
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE PHÂN TRANG & TÌM KIẾM ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
  const limit = 10;

  // --- STATE CHO MODAL THÊM/SỬA ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  
  // --- STATE CHO MODAL XÓA ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: 0,
    category: "",
    image: ""
  });

  // 1. Fetch Data (Có hỗ trợ Search)
  // Sử dụng useEffect để debounce việc gọi API khi search thay đổi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          // Thêm tham số search vào URL
          const query = new URLSearchParams({
            page: currentPage.toString(),
            limit: limit.toString(),
            search: searchTerm, 
          });

          const res = await fetch(`http://localhost:5000/api/products?${query.toString()}`, { 
            cache: "no-store" 
          });
          
          if (!res.ok) throw new Error("Lỗi tải dữ liệu");

          const responseData = await res.json();
          
          const productList = Array.isArray(responseData) ? responseData : (responseData.data || []);
          setProducts(productList);

          if (responseData.pagination) {
            setTotalPages(responseData.pagination.totalPages);
            setTotalItems(responseData.pagination.total);
            
            // Nếu API trả về page khác (do search reset page), cập nhật lại state
            if (responseData.pagination.page && responseData.pagination.page !== currentPage) {
                // Chỉ cập nhật nếu cần thiết để tránh loop vô hạn, 
                // nhưng ở đây backend nên trả về đúng page mình gửi hoặc page 1 nếu search mới
            }
            
            // Logic cũ: lùi trang nếu xóa hết (chỉ áp dụng khi không search hoặc search ra ít kết quả)
            if (productList.length === 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
          }
        } catch (err) {
          console.error(err);
          // toast.error("Lỗi tải danh sách sản phẩm"); // Tắt bớt để đỡ phiền khi gõ
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }, 500); // Delay 500ms sau khi ngừng gõ

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]); // Chạy lại khi trang hoặc từ khóa thay đổi

  // Hàm xử lý khi nhập tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi bắt đầu tìm kiếm mới
  };

  // ... (Các hàm openModal, handleSave, confirmDelete, executeDelete giữ nguyên như cũ) ...
  // 2. Mở Modal Thêm/Sửa
  const openModal = (product: any = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProductId(product._id || product.MaSP);
      setFormData({
        name: product.name || product.TenSP,
        price: product.price || product.Gia,
        category: product.category || product.danhmuc?.TenDM || "",
        image: product.image || (product.sanpham_hinhanh?.[0]?.DuongDan) || ""
      });
    } else {
      setIsEditing(false);
      setCurrentProductId(null);
      setFormData({ name: "", price: 0, category: "", image: "" });
    }
    setShowModal(true);
  };

  // 3. Xử lý Lưu
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
        toast.warning("Vui lòng nhập tên và giá sản phẩm!");
        return;
    }

    try {
        const url = isEditing 
            ? `http://localhost:5000/api/products/${currentProductId}` 
            : `http://localhost:5000/api/products`;
        
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Lỗi khi lưu sản phẩm");

        toast.success(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setShowModal(false);
        // fetchProducts sẽ tự chạy lại do state thay đổi hoặc gọi lại thủ công nếu cần
        // Ở đây ta trigger reload bằng cách set lại searchTerm hoặc currentPage (giữ nguyên)
        // Cách đơn giản nhất là gọi lại fetchProducts nhưng do nó nằm trong useEffect debounce, 
        // ta có thể reload trang hoặc force update. 
        // Tuy nhiên, để đơn giản, ta reload page 1 nếu thêm mới, hoặc giữ nguyên page nếu sửa.
        if (!isEditing) setCurrentPage(1);
        // Để cập nhật ngay lập tức mà không chờ debounce, ta có thể gọi API trực tiếp ở đây,
        // nhưng React sẽ re-render. Để đơn giản, ta chấp nhận delay của useEffect hoặc refresh trang.
        // Tốt nhất là reload lại danh sách:
        const query = new URLSearchParams({ page: currentPage.toString(), limit: limit.toString(), search: searchTerm });
        const refreshRes = await fetch(`http://localhost:5000/api/products?${query.toString()}`);
        const refreshData = await refreshRes.json();
        setProducts(Array.isArray(refreshData) ? refreshData : (refreshData.data || []));
        
    } catch (err: any) {
        toast.error(err.message);
    }
  };

  // 4. MỞ MODAL XÁC NHẬN XÓA
  const confirmDelete = (productId: string) => {
    setDeleteId(productId);
    setShowDeleteModal(true);
  };

  // 5. THỰC HIỆN XÓA
  const executeDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi khi xóa");
      
      toast.success("Đã xóa sản phẩm vĩnh viễn");
      
      // Refresh list
      const query = new URLSearchParams({ page: currentPage.toString(), limit: limit.toString(), search: searchTerm });
      const refreshRes = await fetch(`http://localhost:5000/api/products?${query.toString()}`);
      const refreshData = await refreshRes.json();
      setProducts(Array.isArray(refreshData) ? refreshData : (refreshData.data || []));
      if (refreshData.pagination) setTotalItems(refreshData.pagination.total);

    } catch (err) {
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fadeIn relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* --- HEADER KHU VỰC QUẢN LÝ --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        
        {/* Left: Title & Count */}
        <div className="w-full md:w-auto">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBoxOpen className="text-lime-600" /> Quản lý Sản phẩm
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tổng: <span className="font-bold">{totalItems}</span> sản phẩm
          </p>
        </div>

        {/* Center: Search Bar (MỚI) */}
        <div className="flex-1 w-full md:max-w-md mx-0 md:mx-4">
            <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lime-600 transition-colors" size={16} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm"
                />
            </div>
        </div>

        {/* Right: Add Button */}
        <div className="w-full md:w-auto flex justify-end">
            <button
            onClick={() => openModal()}
            className="bg-lime-600 text-white py-2.5 px-6 rounded-lg hover:bg-lime-700 transition font-medium shadow-md flex items-center gap-2 whitespace-nowrap"
            >
            <FaPlus size={14} /> Thêm Mới
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Hình ảnh</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Giá bán</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product: any) => {
                const pId = product._id || product.MaSP;
                const pName = product.name || product.TenSP;
                const pPrice = product.price || product.Gia;
                const pCategory = product.category || product.danhmuc?.TenDM;
                const pImage = product.image || (product.sanpham_hinhanh?.[0]?.DuongDan) || "/img/placeholder.png";
                
                return (
                  <tr key={pId} className="hover:bg-lime-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 border rounded-lg overflow-hidden bg-gray-100">
                        <Image src={pImage} alt={pName} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800 text-sm">{pName}</td>
                    <td className="px-6 py-4 text-lime-600 font-bold">{Number(pPrice).toLocaleString()} ₫</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pCategory}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => openModal(product)} className="text-blue-600 bg-blue-50 p-2 rounded hover:bg-blue-100 transition" title="Sửa">
                          <FaEdit />
                        </button>
                        <button onClick={() => confirmDelete(pId)} className="text-red-600 bg-red-50 p-2 rounded hover:bg-red-100 transition" title="Xóa">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    {searchTerm ? "Không tìm thấy sản phẩm nào khớp với từ khóa." : "Danh sách trống."}
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"><FaChevronLeft/></button>
            <span className="px-3 py-1 border rounded bg-gray-50 font-bold text-sm flex items-center">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"><FaChevronRight/></button>
        </div>
      )}

      {/* ================= MODAL ADD/EDIT ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="bg-lime-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isEditing ? <FaEdit /> : <FaPlus />} {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition"><FaTimes size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none">
                        <option value="">-- Chọn --</option>
                        <option value="Rau củ">Rau củ</option>
                        <option value="Thịt tươi">Thịt tươi</option>
                        <option value="Hải sản">Hải sản</option>
                        <option value="Trái cây">Trái cây</option>
                    </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link hình ảnh</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" />
                {formData.image && <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden border"><Image src={formData.image} alt="Preview" fill className="object-cover" /></div>}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">Hủy bỏ</button>
                <button type="submit" className="bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 font-bold shadow-md flex items-center gap-2"><FaSave /> Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa?</h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn xóa sản phẩm này không? <br/>
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-center border-t">
              <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium transition shadow-sm">Hủy bỏ</button>
              <button onClick={executeDelete} className="px-5 py-2.5 rounded-lg text-white bg-red-600 hover:bg-red-700 font-bold shadow-md transition flex items-center gap-2"><FaTrash size={14} /> Xóa vĩnh viễn</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}