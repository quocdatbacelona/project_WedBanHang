"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/app/component/cart";
import { useAuth } from "@/app/component/AuthContext";
import Breadcrumb from "@/app/component/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import {
  FaTrash, FaPlus, FaMinus, FaTimes, FaQrcode,
  FaHandHoldingUsd, FaCopy, FaCheck, FaTag,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, isLoading, setUserCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState(""); 
  const [discountAmount, setDiscountAmount] = useState(0); 
  const [appliedCoupon, setAppliedCoupon] = useState(""); 

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string>("");

  // --- THÊM: STATE LƯU THÔNG TIN NGÂN HÀNG ---
  const [bankConfig, setBankConfig] = useState({
    bankId: "970436", // Mã mặc định (MB Bank). Nếu dùng bank khác bạn cần map mã BIN tương ứng.
    bankName: "MB Bank",
    accountNo: "1044887714",
    accountName: "THAI QUOC DAT"
  });

  // --- THÊM: GỌI API LẤY CẤU HÌNH TỪ ADMIN ---
  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.payment) {
           setBankConfig(prev => ({
             ...prev,
             bankName: data.payment.bankName || prev.bankName,
             accountNo: data.payment.bankNumber || prev.accountNo,
             accountName: data.payment.bankOwner || prev.accountName,
             // Lưu ý: bankId (Mã BIN ngân hàng) cần xử lý riêng nếu bạn đổi ngân hàng khác MB
           }));
        }
      })
      .catch(err => console.error("Lỗi tải thông tin ngân hàng:", err));
  }, []);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const finalPrice = totalPrice - discountAmount > 0 ? totalPrice - discountAmount : 0; 

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Giỏ hàng" },
  ];

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống!");
      return;
    }
    if (!user.address || !user.phone || !user.city) {
      toast.warn("Vui lòng cập nhật địa chỉ giao hàng trong tài khoản!");
      setTimeout(() => router.push("/account"), 1500);
      return;
    }
    setShowPaymentModal(true);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("Vui lòng nhập mã giảm giá");
    try {
      const res = await fetch("http://localhost:5000/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: totalPrice })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDiscountAmount(data.discountAmount);
      setAppliedCoupon(data.code);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message);
      setDiscountAmount(0);
      setAppliedCoupon("");
    }
  };

  const handleRemoveCoupon = () => {
      setAppliedCoupon("");
      setDiscountAmount(0);
      setCouponCode("");
      toast.info("Đã gỡ bỏ mã giảm giá");
  };

  const handleConfirmOrder = (method: "Cash" | "Transfer") => {
    if (method === "Transfer") {
      setShowPaymentModal(false);
      setShowQRModal(true);
      return;
    }
    submitOrder(method);
  };

  const submitOrder = async (method: "Cash" | "Transfer") => {
    try {
      const orderCode = `DH${Date.now().toString().slice(-6)}`;
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          totalAmount: finalPrice, 
          paymentMethod: method,
          paymentStatus: method === "Transfer" ? "pending" : "cod",
          orderCode: method === "Transfer" ? orderCode : undefined,
          couponCode: appliedCoupon,
          discountAmount: discountAmount
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đặt hàng thất bại");
      toast.success("Đặt hàng thành công! Đơn hàng đang được xử lý.");
      if (setUserCart) setUserCart([]);
      setTimeout(() => router.push("/account/orders"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setShowQRModal(false);
      setShowPaymentModal(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Đã sao chép!");
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 p-5 bg-white border rounded-2xl shadow-sm hover:shadow-lg transition">
                <Image src={item.image} alt={item.name} width={100} height={100} className="rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-600">{item.price.toLocaleString()} ₫</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button onClick={() => decreaseQuantity(item.productId)} disabled={item.quantity <= 1 || isLoading} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                      <FaMinus size={14} />
                    </button>
                    <span className="w-12 text-center font-bold text-xl">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.productId)} disabled={isLoading} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                      <FaPlus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-lime-600">{(item.price * item.quantity).toLocaleString()} ₫</p>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="ml-4 text-gray-400 hover:text-red-600 transition">
                  <FaTrash size={22} />
                </button>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: Tổng tiền & Thanh toán */}
          <div className="lg:col-span-1">
            <div className="p-8 bg-linear-to-b from-lime-50 to-white rounded-3xl shadow-xl sticky top-6 border border-lime-100">
              <h2 className="text-2xl font-bold mb-6 text-center">Tổng thanh toán</h2>
              
              <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <FaTag className="text-lime-600"/> Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Nhập mã (VD: SALE50)" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 uppercase focus:outline-none focus:border-lime-500"
                      value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={!!appliedCoupon} />
                    {appliedCoupon ? (
                        <button onClick={handleRemoveCoupon} className="bg-red-500 text-white px-4 rounded-lg font-bold text-sm hover:bg-red-600 transition">Xóa</button>
                    ) : (
                        <button onClick={handleApplyCoupon} className="bg-lime-600 text-white px-4 rounded-lg font-bold text-sm hover:bg-lime-700 transition">Áp dụng</button>
                    )}
                  </div>
                  {appliedCoupon && <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">✅ Đã áp dụng mã: <span className="font-bold">{appliedCoupon}</span></p>}
              </div>

              <div className="space-y-3 mb-6 border-t pt-4">
                  <div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span>{totalPrice.toLocaleString()} ₫</span></div>
                  {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600"><span>Giảm giá:</span><span className="font-bold">- {discountAmount.toLocaleString()} ₫</span></div>
                  )}
              </div>

              <div className="text-center mb-8 border-t pt-4">
                <p className="text-sm text-gray-500 mb-1">Tổng cộng</p>
                <p className="text-4xl font-black text-lime-600">{finalPrice.toLocaleString()} ₫</p>
              </div>

              <button onClick={handleCheckoutClick} disabled={isLoading} className="w-full bg-linear-to-r from-lime-600 to-emerald-600 text-white font-bold text-xl py-5 rounded-2xl hover:from-lime-700 hover:to-emerald-700 transition transform hover:scale-105 shadow-lg">
                {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">Hỗ trợ COD & Chuyển khoản QR</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
          <p className="text-3xl text-gray-600 mb-8">Giỏ hàng trống</p>
          <Link href="/products" className="inline-block bg-lime-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-lime-700 transition shadow-lg">Tiếp tục mua sắm</Link>
        </div>
      )}

      {/* Modal chọn phương thức */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-slideUp">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Chọn phương thức</h2>
            <div className="space-y-4">
              <button onClick={() => handleConfirmOrder("Transfer")} className="w-full p-6 bg-linear-to-r from-lime-50 to-emerald-50 border-2 border-lime-400 rounded-2xl hover:border-lime-600 hover:shadow-xl transition transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-lime-200 rounded-2xl"><FaQrcode className="text-4xl text-lime-700" /></div>
                    <div className="text-left"><p className="font-bold text-xl">Chuyển khoản QR</p><p className="text-gray-600">Quét mã – Xong trong 30s</p></div>
                  </div>
                  <span className="bg-lime-600 text-white px-4 py-2 rounded-full text-sm font-bold">Hot</span>
                </div>
              </button>
              <button onClick={() => handleConfirmOrder("Cash")} className="w-full p-6 bg-linear-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-2xl hover:border-blue-600 hover:shadow-xl transition transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-200 rounded-2xl"><FaHandHoldingUsd className="text-4xl text-blue-700" /></div>
                    <div className="text-left"><p className="font-bold text-xl">Thanh toán khi nhận</p><p className="text-gray-600">Trả tiền cho shipper</p></div>
                  </div>
                </div>
              </button>
            </div>
            <button onClick={() => setShowPaymentModal(false)} className="mt-6 text-gray-500 hover:text-gray-700 font-medium w-full text-center">← Quay lại giỏ hàng</button>
          </div>
        </div>
      )}

      {/* MODAL QR THANH TOÁN (ĐÃ CẬP NHẬT DỮ LIỆU ĐỘNG) */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl ">
            <div className="bg-linear-to-r from-lime-500 to-emerald-600 px-8 py-6 text-white flex items-center justify-between sticky top-0 z-10 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <FaQrcode className="text-4xl" />
                <div><h2 className="text-2xl font-bold">Thanh toán nhanh bằng QR</h2><p className="text-white/90 text-sm">Quét là xong – chỉ 15 giây!</p></div>
              </div>
              <button onClick={() => setShowQRModal(false)} className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition backdrop-blur-sm"><FaTimes size={22} /></button>
            </div>

            <div className="lg:p-2">
              {(() => {
                const amount = finalPrice;
                const orderCode = `DH${Date.now().toString().slice(-6)}`;
                // Tạo link VietQR động dựa trên cấu hình Admin
                const qrUrl = `https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(bankConfig.accountName)}`;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div className="space-y-4 -mt-6">
                      <div className="bg-white p-6 rounded-3xl shadow-xl border-8 border-gray-100">
                        <Image src={qrUrl} alt="QR Thanh toán" width={320} height={320} className="rounded-2xl mx-auto" unoptimized />
                      </div>
                      <div className="text-center py-8 bg-linear-to-br from-lime-50 to-emerald-50 rounded-3xl border-4 border-lime-200">
                        <p className="text-gray-600 font-medium text-lg pointer-events-none">Số tiền cần thanh toán</p>
                        <p className="text-3xl font-black text-lime-700 mt-3 pointer-events-none">{finalPrice.toLocaleString()} ₫</p>
                      </div>
                    </div>

                    <div className="space-y-7">
                      <h3 className="text-xl font-bold text-gray-800 m-0 mb-5 pointer-events-none">Thông tin chuyển khoản</h3>
                      <div className="space-y-5 mr-9">
                        <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl">
                          <div><p className="text-gray-600 pointer-events-none">Ngân hàng</p><p className="font-bold text-xl pointer-events-none">{bankConfig.bankName}</p></div>
                          <div className="bg-green-600 text-white font-bold text-lg px-4 py-2 rounded-xl pointer-events-none">BANK</div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-300">
                          <p className="text-blue-800 font-semibold mb-3 pointer-events-none">Số tài khoản</p>
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-black text-blue-700 select-all">{bankConfig.accountNo}</span>
                            <button onClick={() => copyToClipboard(bankConfig.accountNo, "account")} className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition shadow-lg">
                              {copiedField === "account" ? <FaCheck size={22} /> : <FaCopy size={22} />}
                            </button>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-300">
                          <p className="text-red-700 font-bold mb-3 pointer-events-none">Nội dung (Bắt buộc)</p>
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-black text-red-600 select-all">{orderCode}</span>
                            <button onClick={() => copyToClipboard(orderCode, "orderCode")} className="bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 transition shadow-lg">
                              {copiedField === "orderCode" ? <FaCheck size={22} /> : <FaCopy size={22} />}
                            </button>
                          </div>
                        </div>

                        <div className="mt-8 text-center pb-8">
                            <button onClick={() => submitOrder("Transfer")} className="bg-linear-to-r from-lime-600 to-emerald-600 hover:from-lime-700 hover:to-emerald-700 text-white font-bold text-xl px-16 py-6 rounded-3xl transition transform hover:scale-105 shadow-2xl flex items-center gap-4 mx-auto">
                              <FaCheck className="text-3xl" /> Tôi đã chuyển khoản xong
                            </button>
                            <p className="text-gray-500 mt-4 text-sm font-medium pointer-events-none">Admin sẽ xác nhận trong vòng <span className="text-lime-600 font-bold text-base">5–15 phút</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}