"use client";

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
  image: string;
  price: number;
}

export default function Page() {
  const { id } = useParams();
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
    if (error) {
      console.log(error);
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

  return (
    <section className="bg-[#f7f2ec] pt-20  text-gray-800 px-6 py-10 rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <Image
            src={product?.images[0] || "https://placehold.co/600x400"}
            alt="Product"
            className="rounded-xl shadow-md w-full"
            width={600}
            height={400}
          />
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
