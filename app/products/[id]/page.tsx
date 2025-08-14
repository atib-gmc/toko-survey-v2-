"use client";

import { ProductCarousel } from "@/app/ui/ProductCarousel";
import { supabase } from "@/lib/supabaseClient";
// import BackButton from "@/components/ui/BackButton";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { Router, useRouter } from "next/router";
interface Product {
  name: string;
  description: string;
  stock: number;
  images: string[];
  price: number;
}

export default function Page() {
  const { id } = useParams();
  const [loading, setIsLoading] = useState(true);
  const router = useRouter();
  const [product, setProduct] = useState<null | Product>(null);
  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    setProduct(data);
    console.log("data:", data); // Debugging line to check fetched product data
    setIsLoading(false);
    if (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleWhatsAppClick = () => {
    const phoneNumber = "6285155117796"; // Ganti dengan nomor WA kamu
    const product = {
      name: "Nama Produk",
      price: "Rp299.000",
      description:
        "Deskripsi singkat tentang produk ini. Menjelaskan fitur dan manfaat utama dalam gaya bahasa yang simple dan ramah.",
    };

    const message =
      `Halo, saya tertarik dengan produk berikut:\n` +
      `Nama Produk: ${product.name}\n` +
      `Harga: ${product.price}\n` +
      `Deskripsi: ${product.description}\n` +
      `Apakah masih tersedia?`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(waLink, "_blank");
  };
  console.log("product:", product); // Debugging line to check product dataj
  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-spin">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="text-gray-600">Memuat Product...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#f7f2ec]   text-gray-800 px-6 py-10 rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          {product && product.images && product?.images.length! > 0 ? (
            <ProductCarousel images={product?.images!} />
          ) : (
            <div className="w-full h-40 bg-blue-50 rounded-md flex items-center justify-center text-blue-200 mb-3 border border-blue-50">
              <span className="text-4xl">📦</span>
            </div>
          )}
          {/* {if(product?.image.length > 0 ){
            <ProductCarousel images={product?.image!} />
          }} */}
        </div>
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <p className="text-lg text-gray-600">{product?.description}</p>
          <p className="text-2xl font-semibold text-green-700">
            Rp{product?.price.toLocaleString()}
          </p>

          {/* Tombol WA */}
          <button
            onClick={handleWhatsAppClick}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Beli Sekarang via WhatsApp
          </button>
        </div>
        <button onClick={() => router.back()}>back</button>
      </div>
    </section>
  );
}
