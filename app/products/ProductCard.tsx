"use client";

import { useRouter } from "next/navigation";
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
  const route = useRouter();

  return (
    <div
      onClick={() => route.push(`/products/${id}`)}
      className="bg-white border border-blue-100 rounded-lg w-full shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow min-w-[220px] max-w-xs cursor-pointer"
    >
      {/* Image stays at the top */}
      <Image
        src={images[0]}
        alt={name}
        width={300}
        height={300}
        className="h-[200px] w-full object-cover rounded-md"
      />

      {/* Content wrapper */}
      <div className="flex flex-col flex-1 mt-3">
        {/* Product name sticks above price */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Push price & stock to bottom */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-blue-700 font-bold text-lg">
            Rp {price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">Stok: {stock}</span>
        </div>
      </div>
    </div>
  );
}
