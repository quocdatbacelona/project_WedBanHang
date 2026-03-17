// 1. Định nghĩa Product (Sản phẩm)
export interface Product {
  _id: string; // ID từ MongoDB
  name: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
  slug?: string;       // Có dấu ? là không bắt buộc
  description?: string;
  quantity?: number;   // Số lượng tồn kho (nếu cần)
}

// 2. Định nghĩa CartItem (Sản phẩm trong giỏ)
// Đây là cấu trúc được lưu trong MongoDB (trong user.cart)
export interface CartItem {
  productId: string; // <-- Nó dùng 'productId', không dùng '_id'
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 3. Định nghĩa User (Người dùng)
export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
  address?: string;
  city?: string;
  role?: string; // 'admin' | 'customer'
  cart?: CartItem[];
}

// 4. (Tùy chọn) Định nghĩa User đơn giản cho trang Admin
export interface SimpleUser {
  _id: string;
  email: string;
}

// 5. (Tùy chọn) Định nghĩa Order cho trang Admin/Order
export interface Order {
  _id: string;
  userId: User | string | any; // Chấp nhận populate user
  items: any[];
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  // Các trường mã giảm giá mới thêm
  couponCode?: string;
  discountAmount?: number;
  finalPrice?: number;
}