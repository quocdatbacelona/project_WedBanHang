// Địa chỉ file: app/(admin)/admin/products/new/page.tsx
"use client"; 

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface ProductFormData {
  name: string;
  price: number;
  image: string; 
  category: string;
  description: string;
  isFeatured: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    image: "",
    category: "fruit",
    description: "",
    isFeatured: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } 
    else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } 
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Thêm sản phẩm thành công!");
      router.push("/admin/products"); 

    } catch (err) {
       if (err instanceof Error) toast.error(err.message);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
         <h1 className="text-2xl font-bold text-gray-800">Thêm Sản phẩm</h1>
         <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">← Quay lại</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6 border">
        
        {/* Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" required />
          </div>
          
          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none">
              <option value="fruit">Trái cây (fruit)</option>
              <option value="vegetable">Rau củ (vegetable)</option>
              <option value="food">Đồ ăn vặt (food)</option>
            </select>
          </div>
        </div>

        {/* URL Hình ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" placeholder="/img/ten-anh.jpg" required />
          {formData.image && <p className="text-xs text-gray-400 mt-1">Preview: {formData.image}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-lime-500 outline-none" />
        </div>

        {/* Checkbox */}
        <div className="flex items-center">
          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-5 w-5 text-lime-600 border-gray-300 rounded focus:ring-lime-500" />
          <label className="ml-2 block text-sm text-gray-900">Sản phẩm nổi bật</label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <button type="submit" disabled={isLoading} className="bg-lime-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-lime-700 transition shadow-sm disabled:opacity-70">
            {isLoading ? "Đang lưu..." : "Lưu Sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}