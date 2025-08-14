import { supabase } from "@/lib/supabaseClient";
import { stat } from "fs";
import React from "react";
import ProductCard from "../ui/productCard";

export default async function OurProduct() {
  const { data: products, statusText } = await supabase
    .from("products")
    .select("*");

  return (
    <div className="section-produk bg-yellow-300 md:px-[20%] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-left mb-10 uppercase">
          Produk Kami
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>Tidak ada produk tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
}
