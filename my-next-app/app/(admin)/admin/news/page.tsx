"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaNewspaper, FaPlus, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    image: "/img/tt1.webp", // Ảnh mặc định
    description: "",
    content: ""
  });

  // Load danh sách
  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then(res => res.json())
      .then(setNewsList)
      .catch(err => toast.error("Lỗi tải tin tức"));
  }, []);

  // Xử lý Input
  const handleChange = (e: any) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (Thêm mới hoặc Sửa)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing 
        ? `http://localhost:5000/api/news/${currentId}`
        : "http://localhost:5000/api/news";
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if(res.ok) {
         toast.success(isEditing ? "Cập nhật thành công!" : "Đăng bài thành công!");
         // Reload list
         const updatedList = await fetch("http://localhost:5000/api/news").then(r => r.json());
         setNewsList(updatedList);
         resetForm();
      } else {
         toast.error("Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error("Lỗi server");
    }
  };

  // Xóa bài viết
  const handleDelete = async (id: string) => {
      if(!confirm("Bạn chắc chắn muốn xóa bài này?")) return;
      await fetch(`http://localhost:5000/api/news/${id}`, { method: "DELETE" });
      setNewsList(newsList.filter((n: any) => n._id !== id));
      toast.success("Đã xóa bài viết");
  };

  // Chọn bài để sửa
  const handleEdit = (item: any) => {
      setIsEditing(true);
      setCurrentId(item._id);
      setFormData({
          title: item.title,
          image: item.image,
          description: item.description,
          content: item.content
      });
      // Scroll lên đầu trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setIsEditing(false);
      setCurrentId("");
      setFormData({ title: "", image: "", description: "", content: "" });
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaNewspaper className="text-lime-600"/> Quản lý Tin Tức
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM NHẬP LIỆU (Cột Trái) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-6">
           <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-lg text-blue-600">
                  {isEditing ? "Chỉnh sửa bài viết" : "Đăng bài mới"}
               </h2>
               {isEditing && (
                   <button onClick={resetForm} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 flex items-center gap-1">
                       <FaTimes /> Hủy sửa
                   </button>
               )}
           </div>
           
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium mb-1">Tiêu đề bài viết</label>
                 <input type="text" name="title" value={formData.title} onChange={handleChange} required
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-lime-500 outline-none" placeholder="Nhập tiêu đề..." />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1">Link Ảnh (URL)</label>
                 <input type="text" name="image" value={formData.image} onChange={handleChange} required
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-lime-500 outline-none" placeholder="/img/tt1.webp hoặc https://..." />
                 {formData.image && (
                     <div className="mt-2 w-full h-32 relative rounded border overflow-hidden">
                         <Image src={formData.image} alt="Preview" fill className="object-cover" />
                     </div>
                 )}
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                 <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-lime-500 outline-none" placeholder="Tóm tắt nội dung..." />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1">Nội dung chi tiết</label>
                 <textarea name="content" value={formData.content} onChange={handleChange} required rows={6}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-lime-500 outline-none" placeholder="Nội dung bài viết..." />
              </div>

              <button type="submit" className={`w-full py-2 rounded font-bold text-white transition ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-lime-600 hover:bg-lime-700'}`}>
                  {isEditing ? <span className="flex items-center justify-center gap-2"><FaEdit/> Cập nhật</span> : <span className="flex items-center justify-center gap-2"><FaPlus/> Đăng bài</span>}
              </button>
           </form>
        </div>

        {/* DANH SÁCH BÀI VIẾT (Cột Phải) */}
        <div className="lg:col-span-2 space-y-4">
            {newsList.map((news: any) => (
                <div key={news._id} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4 hover:shadow-md transition">
                    <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden">
                        <Image src={news.image} alt={news.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 line-clamp-1">{news.title}</h3>
                        <p className="text-xs text-gray-400 mb-2">{new Date(news.createdAt).toLocaleDateString('vi-VN')}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{news.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center border-l pl-4">
                        <button onClick={() => handleEdit(news)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition" title="Sửa">
                            <FaEdit size={18} />
                        </button>
                        <button onClick={() => handleDelete(news._id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition" title="Xóa">
                            <FaTrash size={18} />
                        </button>
                    </div>
                </div>
            ))}
            {newsList.length === 0 && <p className="text-center text-gray-500 py-10">Chưa có bài viết nào.</p>}
        </div>

      </div>
    </div>
  );
}