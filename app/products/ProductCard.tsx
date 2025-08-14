"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProductCarousel } from "../ui/ProductCarousel";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: any;
  id: string;
}

export default function ProductCard({
  name,
  description,
  price,
  stock,
  id,
  images,
}: ProductCardProps) {
  const [products, setProducts] = useState();
  async function fetchProduct() {}
  useEffect(() => {});
  const route = useRouter();
  const image = images;
  return (
    <div
      onClick={() => route.push(`/products/${id}`)}
      className="bg-white border border-blue-100 rounded-lg shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow min-w-[220px] max-w-xs cursor-pointer"
    >
      <Image src={images[0]} alt={name} width={300} height={300} />
      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
        {name}
      </h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-blue-700 font-bold text-lg">
          Rp {price.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">Stok: {stock}</span>
      </div>
    </div>
  );
}
