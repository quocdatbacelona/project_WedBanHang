// Địa chỉ file: app/component/ProductPrice.tsx
"use client";
import React, { useState } from 'react';
import { Product } from "@/app/types";
interface ProductPriceProps {
  products: Product[]; 
  setFilteredProducts: (products: Product[]) => void;
}

export default function ProductPrice({ products, setFilteredProducts }: ProductPriceProps) {
  
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000000);

  const handleFilterClick = () => {
    const filtered = products.filter(p => p.price >= min && p.price <= max);
    setFilteredProducts(filtered);

  };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm">
      <h3 className="font-bold mb-3 text-lg">Lọc theo giá</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm">Từ:</label>
          <input 
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded mt-1"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm">Đến:</label>
          <input 
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value) || 1000000)}
            className="w-full px-3 py-2 border rounded mt-1"
            placeholder="1.000.000"
          />
        </div>
        <button 
          onClick={handleFilterClick}
          className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700"
        >
          Lọc
        </button>
      </div>
    </div>
  );
}