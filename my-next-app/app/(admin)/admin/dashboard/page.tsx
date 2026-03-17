"use client";

import React, { useEffect, useState } from "react";
// Sử dụng React Icons cho đồng bộ
import { 
  FaMoneyBillWave, 
  FaShoppingBag, 
  FaUsers, 
  FaBoxOpen, 
  FaArrowUp, 
  FaArrowDown 
} from 'react-icons/fa';
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Gọi song song các API cơ bản để lấy dữ liệu thô
        const [resOrders, resProducts, resUsers] = await Promise.all([
          fetch("http://localhost:5000/api/orders?limit=1000"), // Lấy hết để tính tổng
          fetch("http://localhost:5000/api/products?limit=1000"),
          fetch("http://localhost:5000/api/users?limit=1000")
        ]);

        const dOrders = await resOrders.json();
        const dProducts = await resProducts.json();
        const dUsers = await resUsers.json();

        // 2. Chuẩn hóa dữ liệu (Xử lý trường hợp trả về {data: []} hoặc [])
        const orders = Array.isArray(dOrders) ? dOrders : (dOrders.data || []);
        const products = Array.isArray(dProducts) ? dProducts : (dProducts.data || []);
        const users = Array.isArray(dUsers) ? dUsers : (dUsers.data || []);

        // 3. Tính toán Thống kê (Stats)
        const revenue = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
        
        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length, // Hoặc dùng dOrders.pagination.total nếu có
          totalProducts: products.length,
          totalUsers: users.length,
        });

        // 4. Lấy 5 đơn hàng mới nhất
        // Sắp xếp theo thời gian mới nhất trước khi cắt
        const sortedOrders = [...orders].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentOrders(sortedOrders.slice(0, 5));

        // 5. Xử lý dữ liệu Biểu đồ (Doanh thu 7 ngày gần nhất)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString("vi-VN").slice(0, 5); // Lấy DD/MM
        }).reverse();

        const chartMap: Record<string, number> = {};
        last7Days.forEach(date => chartMap[date] = 0); // Init 0

        orders.forEach((order: any) => {
            const date = new Date(order.createdAt).toLocaleDateString("vi-VN").slice(0, 5);
            if (chartMap[date] !== undefined) {
                chartMap[date] += (order.totalPrice || 0);
            }
        });

        const chartArray = Object.keys(chartMap).map(key => ({
            name: key,
            total: chartMap[key]
        }));
        
        setChartData(chartArray);
        setIsLoading(false);

      } catch (err) {
        console.error(err);
        // toast.error("Không thể tải dữ liệu Dashboard"); // Có thể tắt để đỡ phiền nếu lỗi nhẹ
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cấu hình hiển thị cho 4 thẻ Stats
  const statItems = [
    {
      title: "Doanh thu",
      value: `${stats.totalRevenue.toLocaleString()} ₫`,
      trend: "+12.5%", 
      trendUp: true,
      icon: FaMoneyBillWave,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Đơn hàng",
      value: stats.totalOrders,
      trend: "+5.2%",
      trendUp: true,
      icon: FaShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Khách hàng",
      value: stats.totalUsers,
      trend: "-2.1%",
      trendUp: false,
      icon: FaUsers,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Sản phẩm",
      value: stats.totalProducts,
      trend: "+8%",
      trendUp: true,
      icon: FaBoxOpen,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  if (isLoading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu tổng quan...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Tổng quan tình hình kinh doanh hôm nay.</p>
        </div>
      </div>

      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.trendUp ? (
                <FaArrowUp className="text-green-500 mr-1" size={12} />
              ) : (
                <FaArrowDown className="text-red-500 mr-1" size={12} />
              )}
              <span className={stat.trendUp ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {stat.trend}
              </span>
              <span className="text-gray-400 ml-2">so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. CHART & SIDE INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biểu đồ Doanh thu (Chiếm 2/3) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Biểu đồ doanh thu (7 ngày)</h3>
          </div>
          <div className="h-80 w-full">
             {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      formatter={(value: number) => [`${value.toLocaleString()} ₫`, 'Doanh thu']}
                    />
                    <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Chưa có dữ liệu biểu đồ</div>
             )}
          </div>
        </div>

        {/* Thông tin phụ (Chiếm 1/3) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động</h3>
           
           <div className="flex-1 bg-green-50 rounded-xl p-5 border border-green-100 mb-4 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-3">
                  <FaShoppingBag size={20}/>
              </div>
              <h4 className="text-green-800 font-bold mb-1">Đơn hàng mới</h4>
              <p className="text-green-700 text-sm mb-3">
                 Có <span className="font-bold text-xl">{recentOrders.filter((o:any) => o.status === 'Pending').length}</span> đơn chờ xử lý
              </p>
              <Link href="/admin/orders" className="text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition w-full">
                 Xử lý ngay
              </Link>
           </div>
           
           <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex flex-col justify-center items-center text-center">
              <h4 className="text-blue-800 font-bold mb-2">Khuyến mãi</h4>
              <p className="text-blue-700 text-sm mb-3">Tạo mã giảm giá để tăng doanh số</p>
              <Link href="/admin/coupons" className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition w-full">
                 Quản lý Coupon
              </Link>
           </div>
        </div>
      </div>

      {/* 3. RECENT ORDERS TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h3>
          <Link href="/admin/orders" className="text-sm text-green-600 font-medium hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Mã ĐH</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4 text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order: any, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-[150px]">
                      {order.shippingAddress?.fullName || order.user?.fullName || "Khách lẻ"}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-700">
                      {(order.totalPrice || 0).toLocaleString()} ₫
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                 <tr><td colSpan={4} className="text-center py-8 text-gray-400">Chưa có đơn hàng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}