"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingBag, FaEye } from "react-icons/fa";
import { useCart } from "@/app/component/cart"; 
import { useAuth } from "@/app/component/AuthContext"; 
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; 

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
}

const columnMap = {
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-4 lg:grid-cols-5",
};

interface ProductSectionProps {
  title?: string;
  columns?: 3 | 4 | 5;
  filterType?: string; 
  products?: any[]; 
}

export default function ProductSection({
  title,
  columns = 4,
  filterType,
  products: propProducts,
}: ProductSectionProps) {
  
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // 👇 HÀM CHUẨN HÓA DỮ LIỆU ĐÃ ĐƯỢC NÂNG CẤP
  const mapProductData = (data: any[]): Product[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      let itemName = item.name || item.TenSP || "Sản phẩm";
      let itemCat = item.category || (item.danhmuc?.TenDM) || "Khác";

      // Điều chỉnh phân loại cho quả Hồng
      if (itemName.toLowerCase().includes("hồng") && (itemCat.toLowerCase() === "vegetable" || itemCat.toLowerCase().includes("rau"))) {
          itemCat = "fruit";
      }

      return {
        _id: item._id || item.MaSP,
        name: itemName,
        price: Number(item.price || item.Gia || 0), // Ép về số chống crash
        image: item.image || (item.sanpham_hinhanh && item.sanpham_hinhanh[0]?.DuongDan) || "/img/placeholder.png",
        category: itemCat,
        isFeatured: item.isFeatured || item.featured || item.NoiBat || false
      };
    });
  };

  // 👇 LOGIC LỌC TÌM KIẾM THEO TỪ KHÓA
  useEffect(() => {
    if (propProducts && Array.isArray(propProducts)) {
      setDisplayProducts(mapProductData(propProducts));
      setIsLoading(false);
    } else if (filterType) {
      setIsLoading(true);
      fetch("http://localhost:5000/api/products?limit=1000", { cache: 'no-store' })
        .then((res) => res.json())
        .then((data: any) => {
          let list = Array.isArray(data) ? data : (data.data || []);
          let mappedList = mapProductData(list);
          let filtered = mappedList;

          // Bộ lọc thông minh: Dùng includes thay vì ===
         // 👇 Bộ lọc đã được Việt Hóa theo đúng Database của bạn
          if (filterType && filterType !== "all") {
             filtered = mappedList.filter((p: any) => {
                const cat = String(p.category).toLowerCase();
                
                if (filterType === "featured") return p.isFeatured === true || String(p.isFeatured) === "true";
                if (filterType === "rau-cu") return cat.includes("rau củ") || cat.includes("rau");
                if (filterType === "trai-cay") return cat.includes("trái cây") || cat.includes("quả");
                if (filterType === "do-an-vat") return cat.includes("đồ ăn vặt") || cat.includes("ăn vặt");
                if (filterType === "hai-san") return cat.includes("hải sản") || cat.includes("cá");
                
                return false;
             });
          }

          setDisplayProducts(filtered.slice(0, 8));
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Lỗi tải sản phẩm:", err);
          setIsLoading(false);
        });
    } else {
      setDisplayProducts([]);
      setIsLoading(false);
    }
  }, [propProducts, filterType]);

  const mdColsClass = columnMap[columns] || columnMap[4];

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
      e.preventDefault();
      e.stopPropagation();
      if(user) {
          addToCart(p);
      } else { 
          toast.info("Vui lòng đăng nhập để mua hàng"); 
          router.push("/login"); 
      }
  };

  return (
    <section>
      {title && (
        <h2 className="text-xl font-bold mb-6 border-l-4 border-green-600 pl-3 text-gray-800">
          {title}
        </h2>
      )}

      {isLoading && <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>}
      
      {!isLoading && displayProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
              Không tìm thấy sản phẩm phù hợp.
          </div>
      )}

      {!isLoading && displayProducts.length > 0 && (
        <div className={`grid ${mdColsClass} gap-6`}>
          {displayProducts.map((p) => (
            <div key={p._id} className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative flex flex-col">
               <div className="relative aspect-square bg-gray-50 m-2 rounded-xl overflow-hidden">
                 <Link href={`/products/${p._id}`}>
                   <Image 
                        src={p.image} 
                        alt={p.name} 
                        fill 
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                        unoptimized // Thêm unoptimized để chống lỗi ảnh mạng
                   />
                 </Link>
                 
                 <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    -20%
                 </div>

                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button onClick={(e) => handleAddToCart(e, p)} className="bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-lime-600 hover:text-white transition-colors" title="Thêm vào giỏ">
                        <FaShoppingBag size={14} />
                    </button>
                    <Link href={`/products/${p._id}`} className="bg-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-500 hover:text-white transition-colors" title="Xem chi tiết">
                        <FaEye size={14} />
                    </Link>
                 </div>
               </div>

               <div className="p-4 pt-2 flex flex-col grow">
                 <div className="text-xs text-gray-500 mb-1">{p.category}</div>
                 <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 hover:text-lime-600 transition-colors grow">
                    <Link href={`/products/${p._id}`}>{p.name}</Link>
                 </h3>
                 <div className="flex items-center justify-between mt-auto">
                    <p className="text-lime-600 font-extrabold text-lg">{p.price.toLocaleString('vi-VN')} ₫</p>
                    <p className="text-xs text-gray-400 line-through">{(p.price * 1.2).toLocaleString('vi-VN')} ₫</p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}