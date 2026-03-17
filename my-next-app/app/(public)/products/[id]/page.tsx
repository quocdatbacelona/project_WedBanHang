"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ProductSection from "@/app/component/ProductSection";
import ProductSidebar from "@/app/component/ProductSidebar";
import Breadcrumb from "@/app/component/Breadcrumb";
import { useCart } from "@/app/component/cart";
import { Product } from "@/app/types";
import { useAuth } from "@/app/component/AuthContext";
import { toast } from "react-toastify";
import { 
  FaCartPlus, 
  FaHeart, 
  FaMinus, 
  FaPlus, 
  FaStar, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo,
  FaCheckCircle 
} from "react-icons/fa";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id as string;

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
          return res.json();
        })
        .then((data: Product) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Lỗi:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để mua hàng!");
      router.push('/login');
      return;
    }
    if (product) {
      for (let i = 0; i < quantity; i++) addToCart(product);
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if(user) router.push('/cart');
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error || !product) return <div className="text-center p-10 text-gray-500">Sản phẩm không tồn tại.</div>;

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    { label: product.name },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          
          {/* CỘT CHÍNH: CHI TIẾT SẢN PHẨM */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 lg:p-8 flex flex-col md:flex-row gap-10">
                
                {/* 1. ẢNH SẢN PHẨM */}
                <div className="md:w-1/2">
                  <div className="relative w-full aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden group cursor-zoom-in">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      priority
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      Giảm 20%
                    </div>
                  </div>
                  {/* Thumbnails (Giả lập) */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                     {[1,2,3,4].map((i) => (
                        <div key={i} className={`aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-lime-500 transition ${i===1 ? 'border-lime-500 ring-1 ring-lime-500' : 'border-gray-200'}`}>
                           <Image src={product.image} alt="thumb" width={100} height={100} className="object-cover w-full h-full"/>
                        </div>
                     ))}
                  </div>
                </div>

                {/* 2. THÔNG TIN */}
                <div className="md:w-1/2 flex flex-col">
                  {/* Đánh giá */}
                  <div className="flex items-center gap-2 mb-3">
                     <div className="flex text-yellow-400 text-sm">
                        {[1,2,3,4,5].map(i => <FaStar key={i} />)}
                     </div>
                     <span className="text-sm text-gray-500 border-l pl-2 ml-1">Đã bán 1.2k</span>
                  </div>

                  <h1 className="text-3xl font-extrabold text-gray-800 leading-tight mb-4">
                    {product.name}
                  </h1>

                  {/* Giá tiền */}
                  <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-end gap-3 border border-gray-100">
                    <span className="text-4xl font-bold text-lime-600">
                      {product.price.toLocaleString()} ₫
                    </span>
                    <span className="text-lg text-gray-400 line-through mb-1">
                      {(product.price * 1.2).toLocaleString()} ₫
                    </span>
                  </div>

                  {/* Mô tả ngắn */}
                  <div className="prose prose-sm text-gray-600 mb-8 line-clamp-3">
                    <p>{product.description || "Sản phẩm tươi ngon, nguồn gốc rõ ràng, đảm bảo vệ sinh an toàn thực phẩm."}</p>
                  </div>

                  {/* Chọn số lượng */}
                  <div className="flex items-center gap-6 mb-8">
                    <span className="font-semibold text-gray-700">Số lượng:</span>
                    <div className="flex items-center border border-gray-300 rounded-full bg-white px-1">
                      <button onClick={decreaseQuantity} className="p-3 text-gray-500 hover:text-lime-600 transition"><FaMinus size={12} /></button>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-12 text-center font-bold text-gray-800 outline-none bg-transparent" 
                      />
                      <button onClick={increaseQuantity} className="p-3 text-gray-500 hover:text-lime-600 transition"><FaPlus size={12} /></button>
                    </div>
                    <span className="text-sm text-gray-500">{product.quantity || 100} sản phẩm có sẵn</span>
                  </div>

                  {/* Nút hành động */}
                  <div className="flex gap-3 mb-8">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-lime-100 text-lime-700 border border-lime-600 font-bold py-3.5 rounded-xl hover:bg-lime-200 transition flex items-center justify-center gap-2"
                    >
                      <FaCartPlus /> Thêm vào giỏ
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-lime-600 text-white font-bold py-3.5 rounded-xl hover:bg-lime-700 transition shadow-lg shadow-lime-200"
                    >
                      Mua ngay
                    </button>
                  </div>

                  {/* Chính sách đảm bảo */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                     <div className="flex items-start gap-3">
                        <FaTruck className="text-lime-600 text-xl mt-1"/>
                        <div>
                           <p className="font-bold text-gray-800 text-sm">Giao hàng miễn phí</p>
                           <p className="text-xs text-gray-500">Cho đơn hàng trên 500k</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <FaShieldAlt className="text-lime-600 text-xl mt-1"/>
                        <div>
                           <p className="font-bold text-gray-800 text-sm">Cam kết chính hãng</p>
                           <p className="text-xs text-gray-500">Đền gấp đôi nếu giả</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <FaUndo className="text-lime-600 text-xl mt-1"/>
                        <div>
                           <p className="font-bold text-gray-800 text-sm">Đổi trả 7 ngày</p>
                           <p className="text-xs text-gray-500">Nếu sản phẩm lỗi</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-lime-600 text-xl mt-1"/>
                        <div>
                           <p className="font-bold text-gray-800 text-sm">Thanh toán an toàn</p>
                           <p className="text-xs text-gray-500">COD hoặc Chuyển khoản</p>
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SẢN PHẨM LIÊN QUAN */}
            <div className="mt-12  min-h-screen">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-lime-600 pl-3">Có thể bạn thích</h2>
                 <a href="/products" className="text-lime-600 font-semibold hover:underline text-sm">Xem tất cả</a>
              </div>
              <ProductSection columns={4} filterType="all" title="" />
            </div>
          </div>

          {/* SIDEBAR (Ẩn trên mobile) */}
         

        </div>
      </div>
    </div>
  );
}