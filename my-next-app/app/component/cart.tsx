// Địa chỉ file: app/component/cart.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product, CartItem } from "@/app/types"; 
import { useAuth } from "@/app/component/AuthContext"; 
import { toast } from "react-toastify";



// 1. SỬA: Thêm 'setUserCart' vào interface
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  isLoading: boolean;
  setUserCart: (cart: CartItem[]) => void; // <-- QUAN TRỌNG: Thêm dòng này
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Lấy hàm setUserCart từ AuthContext (để lưu vào localStorage/User)
  const { user, setUserCart: setAuthUserCart } = useAuth();

  useEffect(() => {
    if (user) {
      setItems(user.cart || []); 
    } else {
      setItems([]);
    }
  }, [user]);

  // 2. THÊM: Hàm cập nhật giỏ hàng thủ công (Dùng cho trang Thanh Toán)
  const manualSetCart = (newCart: CartItem[]) => {
    setItems(newCart); // Cập nhật giao diện ngay lập tức
    if (user) {
        setAuthUserCart(newCart); // Đồng bộ với AuthContext
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Phải đăng nhập mới thêm vào giỏ hàng");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, product }),
      });
      const newCart: CartItem[] = await res.json();
      setItems(newCart);
      setAuthUserCart(newCart); // Dùng hàm của Auth
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      toast.error("Lỗi: Không thể thêm vào giỏ hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      toast.error("Phải đăng nhập mới xóa khỏi giỏ hàng");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      const newCart: CartItem[] = await res.json();
      setItems(newCart);
      setAuthUserCart(newCart);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
    } catch (err) {
      console.error("Lỗi khi xóa khỏi giỏ:", err);
      toast.error("Lỗi: Không thể xóa sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = async (productId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/increase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      const newCart: CartItem[] = await res.json();
      setItems(newCart);
      setAuthUserCart(newCart);
    } catch (err) {
      toast.error("Lỗi khi tăng số lượng.");
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseQuantity = async (productId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/decrease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
      const newCart: CartItem[] = await res.json();
      setItems(newCart);
      setAuthUserCart(newCart);
    } catch (err) {
      toast.error("Lỗi khi giảm số lượng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      increaseQuantity, 
      decreaseQuantity, 
      isLoading,
      setUserCart: manualSetCart // <-- Xuất hàm này ra để CartPage dùng
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được dùng bên trong CartProvider");
  }
  return context;
};  