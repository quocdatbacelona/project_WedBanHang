"use client";

import Image from "next/image";
import Link from "next/link";
import CategorySidebar from "@/app/component/CategorySidebar";
import ProductSection from "@/app/component/ProductSection";
import { FaArrowRight, FaLeaf, FaShippingFast, FaStar, FaUndo, FaQuoteLeft, FaPlay } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function Home() {
   const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen font-sans text-slate-800 overflow-x-hidden">
      
      {/* 1. HERO SECTION - Full Width & Creative Layout */}
      <div className="relative bg-linear-to-br from-[#F0FDF4] to-[#DCFCE7] pt-8 pb-20 lg:pt-12 lg:pb-32 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Sidebar (Floating) */}
            <div className="hidden lg:block lg:col-span-3">
               <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-4 sticky top-24">
                  <h3 className="font-bold text-gray-800 mb-4 px-2 flex items-center gap-2">
                    <span className="w-2 h-8 bg-lime-500 rounded-full"></span> Danh mục
                  </h3>
                  <CategorySidebar />
               </div>
            </div>

            {/* Hero Content */}
            <div className="col-span-12 lg:col-span-5 text-center lg:text-left space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-lime-200 text-lime-700 text-sm font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                  100% Organic Food
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  Sống <span className="text-transparent bg-clip-text bg-linear-to-r from-lime-600 to-emerald-600">Xanh</span> <br/>
                  Ăn <span className="text-transparent bg-clip-text bg-linear-to-r from-lime-600 to-emerald-600">Sạch</span>
               </h1>
               <p className="text-lg text-gray-600 leading-relaxed">
                  Cung cấp thực phẩm hữu cơ tươi ngon từ nông trại đến bàn ăn của bạn trong vòng 2 giờ. Cam kết chất lượng VietGAP.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/products" className="px-8 py-4 bg-lime-600 hover:bg-lime-700 text-white rounded-full font-bold shadow-lg hover:shadow-lime-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                     Mua Ngay <FaArrowRight/>
                  </Link>
                  <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-full font-bold shadow-md border border-gray-100 flex items-center justify-center gap-2 group">
                     <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                        <FaPlay className="text-lime-600 text-xs ml-1"/>
                     </div>
                     Xem Video
                  </button>
               </div>

               {/* Stats */}
               <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200/50">
                  <div>
                     <p className="text-3xl font-bold text-gray-900">15k+</p>
                     <p className="text-sm text-gray-500">Khách hàng</p>
                  </div>
                  <div className="w-px h-10 bg-gray-300"></div>
                  <div>
                     <p className="text-3xl font-bold text-gray-900">500+</p>
                     <p className="text-sm text-gray-500">Sản phẩm</p>
                  </div>
                  <div className="w-px h-10 bg-gray-300"></div>
                  <div>
                     <p className="text-3xl font-bold text-gray-900">2h</p>
                     <p className="text-sm text-gray-500">Giao nhanh</p>
                  </div>
               </div>
            </div>

            {/* Hero Image - Creative Composition */}
            <div className="col-span-12 lg:col-span-4 relative">
               <div className="relative z-10 w-full aspect-4/5 rounded-4xl overflow-hidden shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition duration-500">
                  <Image 
                     src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" 
                     alt="Hero" fill className="object-cover" unoptimized 
                  />
               </div>
               {/* Floating Badge */}
               <div className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce-slow max-w-[150px]">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-yellow-400"><FaStar/></span>
                     <span className="font-bold text-sm">4.9/5</span>
                  </div>
                  <p className="text-xs text-gray-500">"Rau rất tươi và ngọt, giao hàng siêu nhanh!"</p>
               </div>
               {/* Abstract Shape Background */}
               <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. CATEGORY HIGHLIGHT (Horizontal Scroll) */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-20">
         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                  // 👇 1. Thêm slug tiếng Việt vào đây cho khớp với Database
                  { title: "Rau Củ", slug: "rau-cu", img: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=200", color: "bg-green-50" },
                  { title: "Trái Cây", slug: "trai-cay", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200", color: "bg-orange-50" },
                  { title: "Thịt Tươi", slug: "do-an-vat", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=200", color: "bg-red-50" },
                  { title: "Hải Sản", slug: "hai-san", img: "img/haisan.jpg", color: "bg-blue-50" },
               ].map((item, idx) => (
                  // 👇 2. Sửa lại chỗ href này (Nhớ dùng dấu backtick ` )
                  <Link href={`/products?category=${item.slug}`} key={idx} className={`${item.color} p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition cursor-pointer group`}>
                     <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border-2 border-white group-hover:scale-110 transition">
                        <Image src={item.img} alt={item.title} width={64} height={64} className="w-full h-full object-cover" unoptimized/>
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                        <p className="text-xs text-gray-500 group-hover:text-lime-600 transition">Xem ngay →</p>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 space-y-24 pb-20">
        
        {/* 3. FEATURED PRODUCTS (Minimal Style) */}
        <section>
           <div className="text-center mb-12">
              <span className="text-lime-600 font-bold uppercase tracking-wider text-xs bg-lime-100 px-3 py-1 rounded-full">Sản phẩm hot</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Lựa Chọn Tốt Nhất</h2>
           </div>
         <ProductSection 
   // Tự động đổi tên tiêu đề cho khớp với category tiếng Việt
// Đổi từ "Thịt & Ăn vặt" thành "Đồ ăn vặt"
         title={categoryParam === "trai-cay" ? "Hoa quả tươi" : categoryParam === "rau-cu" ? "Rau củ sạch" : categoryParam === "do-an-vat" ? "Đồ ăn vặt" : categoryParam === "hai-san" ? "Hải sản tươi sống" : "Sản Phẩm Nổi Bật"}   
   // 👇 Sửa ở đây: Nếu không có category trên link, MẶC ĐỊNH lấy "featured"
   filterType={categoryParam || "featured"} 
   
   columns={4}
/>
        </section>

        {/* 4. PROMO SECTION (Split Layout) */}
        <section className="bg-gray-900 rounded-[2.5rem] overflow-hidden text-white relative">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-lime-600 skew-x-12 translate-x-20 opacity-20"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-12 md:p-16 relative z-10">
                 <span className="text-lime-400 font-bold text-lg mb-2 block">Ưu đãi đặc biệt</span>
                 <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Combo Rau Xanh <br/> Tuần Mới</h2>
                 <p className="text-gray-300 mb-8 text-lg">Tiết kiệm đến 30% khi đặt mua combo rau củ quả cho cả tuần. Tươi ngon, tiện lợi, giao tận nhà.</p>
                 <div className="flex gap-4">
                    <div className="text-center">
                       <span className="block text-3xl font-bold text-white">05</span>
                       <span className="text-xs text-gray-400 uppercase">Ngày</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-600">:</div>
                    <div className="text-center">
                       <span className="block text-3xl font-bold text-white">12</span>
                       <span className="text-xs text-gray-400 uppercase">Giờ</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-600">:</div>
                    <div className="text-center">
                       <span className="block text-3xl font-bold text-white">45</span>
                       <span className="text-xs text-gray-400 uppercase">Phút</span>
                    </div>
                 </div>
                 <Link href="/products" className="mt-10 inline-block bg-lime-500 text-gray-900 font-bold py-4 px-10 rounded-full hover:bg-lime-400 transition shadow-lg hover:shadow-lime-500/50">
                    Đặt Mua Ngay
                 </Link>
              </div>
              <div className="relative h-[400px] md:h-[600px]">
                 <Image 
                   src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop" 
                   alt="Promo" fill className="object-cover" unoptimized 
                 />
              </div>
           </div>
        </section>

        {/* 5. MASONRY BANNER GRID (Thay cho Grid đơn điệu) */}
        <section>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
              <div className="md:col-span-1 bg-orange-50 rounded-3xl p-8 relative overflow-hidden group cursor-pointer transition hover:shadow-lg">
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-orange-900 mb-2">Nước Ép <br/> Detox</h3>
                    <Link href="/products" className="text-orange-600 font-bold hover:underline">Xem ngay</Link>
                 </div>
                 <Image src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400" alt="Juice" width={300} height={400} className="absolute bottom-0 right-0 w-48 rotate-12 group-hover:rotate-0 transition duration-500" unoptimized/>
              </div>
              
              <div className="md:col-span-2 grid grid-rows-2 gap-6">
                 <div className="bg-green-50 rounded-3xl p-8 flex items-center justify-between relative overflow-hidden group cursor-pointer transition hover:shadow-lg">
                    <div className="relative z-10">
                       <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-green-600 mb-2 inline-block">Mới về</span>
                       <h3 className="text-2xl font-bold text-green-900">Salad Hữu Cơ</h3>
                    </div>
                    <Image src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400" alt="Salad" width={200} height={200} className="absolute -right-4 -bottom-4 w-40 h-40 object-cover rounded-full group-hover:scale-110 transition duration-500" unoptimized/>
                 </div>
                 <div className="bg-blue-50 rounded-3xl p-8 flex items-center justify-between relative overflow-hidden group cursor-pointer transition hover:shadow-lg">
                    <div className="relative z-10">
                       <h3 className="text-2xl font-bold text-blue-900 mb-1">Hải Sản Tươi Sống</h3>
                       <p className="text-blue-700 text-sm">Đánh bắt trong ngày</p>
                    </div>
                    <Image src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=400" alt="Seafood" width={250} height={200} className="absolute right-0 bottom-0 w-1/2 object-contain group-hover:-translate-x-2 transition duration-500" unoptimized/>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. BLOG SECTION (Magazine Style) */}
        <section>
           <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Góc Sống Xanh</h2>
              <Link href="/news" className="text-gray-500 hover:text-lime-600 font-medium">Xem tất cả bài viết</Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                 { img: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=600", title: "Thực đơn Eat Clean cho người bận rộn", date: "20 Nov" },
                 { img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600", title: "Top 5 loại thực phẩm tăng đề kháng", date: "18 Nov" },
                 { img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600", title: "Bí quyết chọn trái cây tươi ngon", date: "15 Nov" }
              ].map((item, idx) => (
                 <div key={idx} className="group cursor-pointer">
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                       <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition duration-700" unoptimized/>
                       <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                          {item.date}
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-lime-600 transition">{item.title}</h3>
                    <Link href="/news" className="text-lime-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                       Đọc thêm <FaArrowRight size={10}/>
                    </Link>
                 </div>
              ))}
           </div>
        </section>

      </main>
    </div>
  );
}