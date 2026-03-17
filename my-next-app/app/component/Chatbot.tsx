"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaShoppingBag } from "react-icons/fa";
import Link from "next/link"; // Để làm nút mua

// 👇 1. Mở rộng interface Message để hứng cả hình ảnh và giá
interface Message {
  sender: "user" | "bot";
  text: string;
  hasProduct?: boolean;
  productName?: string;
  productPrice?: number;
  productImage?: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Chào bạn! Mình là trợ lý AI của FreshFood 🥦. Bạn cần tìm mua món gì nhỉ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error("Lỗi mạng");

      // 👇 2. Hứng nguyên cái object JSON từ Backend
      const aiData = await res.json();
      
      setMessages(prev => [...prev, { 
          sender: "bot", 
          text: aiData.text || "Xin lỗi, mình chưa hiểu ý bạn.",
          hasProduct: aiData.hasProduct,
          productName: aiData.productName,
          productPrice: aiData.productPrice,
          productImage: aiData.productImage
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", text: "Xin lỗi, đường truyền đến não AI đang bị nghẽn 😢" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-lime-600 text-white p-4 rounded-full shadow-2xl hover:bg-lime-700 hover:scale-110 transition-all duration-300 animate-bounce">
          <FaRobot size={28} />
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col animate-slideUp origin-bottom-right">
          
          <div className="bg-linear-to-r from-lime-600 to-green-700 p-4 text-white flex justify-between items-center shadow-md z-10">
             <div className="flex items-center gap-3">
                <div className="bg-white text-lime-600 p-2 rounded-full shadow-sm">
                   <FaRobot size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-sm">Trợ lý FreshFood AI</h3>
                   <p className="text-[10px] text-lime-100 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-300 inline-block animate-pulse"></span> Trực tuyến
                   </p>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-lime-100 hover:text-white transition hover:rotate-90">
                <FaTimes size={20} />
             </button>
          </div>

          <div className="h-[400px] p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Dòng chat text */}
                <div className="flex items-end">
                    {msg.sender === 'bot' && (
                       <div className="w-6 h-6 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center mr-2 mb-1 shrink-0">
                          <FaRobot size={12}/>
                       </div>
                    )}
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                       msg.sender === 'user' ? 'bg-lime-600 text-white rounded-tr-sm' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                </div>

                {/* 👇 3. VẼ THẺ SẢN PHẨM NẾU CÓ DỮ LIỆU */}
                {msg.hasProduct && msg.productName && (
                    <div className="mt-2 ml-8 w-60 bg-white border border-lime-200 rounded-xl overflow-hidden shadow-md">
                        {msg.productImage && (
                            <div className="h-32 bg-gray-100 relative">
                               <img src={msg.productImage} alt={msg.productName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-3">
                            <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{msg.productName}</h4>
                            <p className="text-lime-600 font-black mt-1">
                               {msg.productPrice ? msg.productPrice.toLocaleString() + ' ₫' : 'Liên hệ'}
                            </p>
                            
                            {/* Nút giả lập mua ngay */}
                            <Link href="/products" className="mt-3 w-full bg-lime-50 text-lime-700 border border-lime-200 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-lime-600 hover:text-white transition">
                               <FaShoppingBag /> Mua ngay
                            </Link>
                        </div>
                    </div>
                )}

              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 ml-8">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
             <form onSubmit={handleSend} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hỏi giá súp lơ, cà chua..."
                  className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 transition"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-lime-600 text-white rounded-full flex items-center justify-center hover:bg-lime-700 disabled:opacity-50 transition transform active:scale-95 shrink-0"
                >
                   <FaPaperPlane size={14} className="-ml-0.5 mt-px" />
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}