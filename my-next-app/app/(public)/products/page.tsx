"use client";
import React, { useEffect, useState, Suspense } from "react";
import ProductSection from "@/app/component/ProductSection"; 
import ProductPrice from "@/app/component/ProductPrice";
import ProductSidebar from "@/app/component/ProductSidebar";
import Breadcrumb from "@/app/component/Breadcrumb";
import { Product } from "@/app/types"; 
import { useSearchParams } from "next/navigation";
import { FaFilter, FaSortAmountDown, FaTimes, FaSearch, FaLeaf } from "react-icons/fa";

function ProductContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search'); 
  const categoryParam = searchParams.get('category'); // 👈 1. Thêm cái "vợt" đón danh mục ở đây!

  // 1. FETCH DỮ LIỆU
  useEffect(() => {
    setIsLoading(true);
    let apiUrl = "http://localhost:5000/api/products?limit=1000"; 
    
    if (searchQuery) apiUrl += `&search=${encodeURIComponent(searchQuery)}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((responseData: any) => {
        let productList: Product[] = [];
        if (Array.isArray(responseData)) {
            productList = responseData;
        } else if (responseData.data && Array.isArray(responseData.data)) {
            productList = responseData.data;
        } else {
            productList = [];
        }

        // 👇 2. LOGIC LỌC NGAY KHI VỪA LẤY DỮ LIỆU VỀ
        let initialFiltered = productList;
        
        if (categoryParam && categoryParam !== "all") {
             initialFiltered = productList.filter((p: any) => {
                const cat = String(p.category || p.danhmuc?.TenDM || "").toLowerCase();
                const name = String(p.name || p.TenSP || "").toLowerCase();

                // Chỉnh lại quả Hồng cho chuẩn
                let adjustedCat = cat;
                if (name.includes("hồng") && (cat.includes("vegetable") || cat.includes("rau"))) {
                    adjustedCat = "fruit";
                }

                if (categoryParam === "rau-cu") return adjustedCat.includes("rau củ") || adjustedCat.includes("rau") || adjustedCat.includes("vegetable");
                if (categoryParam === "trai-cay") return adjustedCat.includes("trái cây") || adjustedCat.includes("quả") || adjustedCat.includes("fruit");
                if (categoryParam === "do-an-vat") return adjustedCat.includes("đồ ăn vặt") || adjustedCat.includes("ăn vặt") || adjustedCat.includes("thịt") || adjustedCat.includes("food");
                if (categoryParam === "hai-san") return adjustedCat.includes("hải sản") || adjustedCat.includes("cá") || adjustedCat.includes("seafood");
                return false;
             });
        }

        setProducts(productList);
        setFilteredProducts(initialFiltered); // 👈 Cập nhật danh sách hiển thị đã bị lọc
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch:", err);
        setProducts([]); 
        setFilteredProducts([]);
        setIsLoading(false);
      });
  }, [searchQuery, categoryParam]); // 👈 3. Dặn React là "khi category trên link đổi thì phải chạy lại hàm này"

  // 2. Xử lý Sắp xếp
  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProducts];
    
    const getPrice = (p: any) => p.price || p.Gia || 0;
    const getName = (p: any) => (p.name || p.TenSP || "").toLowerCase();

    switch(option) {
      case "price-asc": sorted.sort((a, b) => getPrice(a) - getPrice(b)); break;
      case "price-desc": sorted.sort((a, b) => getPrice(b) - getPrice(a)); break;
      case "name-asc": sorted.sort((a, b) => getName(a).localeCompare(getName(b))); break;
      default: break;
    }
    setFilteredProducts(sorted);
  };

  // 👇 4. Tự động đổi tên tiêu đề cho ngầu
         let pageTitle = "Tất cả sản phẩm";
         if (searchQuery) pageTitle = `Kết quả cho: "${searchQuery}"`;
         else if (categoryParam === "trai-cay") pageTitle = "Hoa Quả Tươi";
         else if (categoryParam === "rau-cu") pageTitle = "Rau Củ Sạch";
        else if (categoryParam === "do-an-vat") pageTitle = "Đồ Ăn Vặt";
         else if (categoryParam === "hai-san") pageTitle = "Hải Sản Tươi Sống";

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: pageTitle },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* --- HEADER BANNER --- */}
      <div className="relative bg-[#2e7d32] overflow-hidden h-56 sm:h-64 flex items-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <FaLeaf className="absolute top-4 left-10 text-9xl text-white animate-pulse" />
            <FaLeaf className="absolute bottom-4 right-20 text-8xl text-white rotate-45" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
           <div className="text-green-100 text-sm mb-3 font-medium opacity-90">
              <Breadcrumb items={breadcrumbItems} />
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-sm">
              {pageTitle}
           </h1>
           <p className="text-green-50 text-lg font-light max-w-2xl">
              Khám phá các sản phẩm xanh, sạch và chất lượng nhất từ nông trại đến bàn ăn.
           </p>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg className="relative block w-full h-10" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
            </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 px-4 py-8">
        
        {/* --- SIDEBAR (BỘ LỌC) --- */}
        <div className={`
            fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out p-6 overflow-y-auto
            lg:relative lg:translate-x-0 lg:w-auto lg:shadow-none lg:bg-transparent lg:p-0 lg:col-span-3 lg:block lg:z-0
            ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
           <div className="flex justify-between items-center mb-6 lg:hidden">
              <span className="font-bold text-lg">Bộ lọc</span>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><FaTimes/></button>
           </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
               <FaFilter className="text-green-600"/> Danh mục
            </h3>
            {/* Chỉ cần truyền products vào để nó đếm số lượng là đủ */}
            <ProductSidebar products={products} /> 
         </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                 <FaSortAmountDown className="text-green-600"/> Khoảng giá
              </h3>
              <ProductPrice products={products} setFilteredProducts={setFilteredProducts} />
           </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="col-span-12 lg:col-span-9">
           
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden bg-green-50 text-green-700 font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                    <FaFilter/> Lọc
                 </button>
                 <p className="text-gray-500 text-sm">
                    Hiển thị <span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm
                 </p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <span className="text-gray-500 text-sm whitespace-nowrap">Sắp xếp:</span>
                 <select 
                    value={sortOption} onChange={(e) => handleSort(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2 outline-none cursor-pointer hover:bg-white transition"
                 >
                    <option value="default">Mặc định</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A - Z</option>
                 </select>
              </div>
           </div>

           <div className="min-h-[400px]">
              {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[1,2,3,4].map(i => (
                          <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                      ))}
                  </div>
              ) : (
                  <ProductSection title="" columns={4} products={filteredProducts} />
              )}
           </div>
           
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
    }>
      <ProductContent />
    </Suspense>
  );
}