"use client";

import { ProductCarousel } from "@/app/ui/ProductCarousel";
import { supabase } from "@/lib/supabaseClient";
// import BackButton from "@/components/ui/BackButton";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoMdArrowBack } from "react-icons/io";
// import { Router, useRouter } from "next/router";
interface Product {
  name: string;
  description: string;
  stock: number;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
  price: number;
}

export default function Page() {
  const [showMore, setShowMore] = useState(false);
  const maxChars = 100; // limit
  const toggleShowMore = () => setShowMore(!showMore);
  const { id } = useParams();
  const [loading, setIsLoading] = useState(true);
  const router = useRouter();
  const [product, setProduct] = useState<null | Product>(null);
  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*,category(id,name,slug)")
      .eq("id", id)
      .single();
    setProduct(data);
    // console.log("data:", data); // Debugging line to check fetched product data
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
    // const phoneNumber = "6285155117796"; // Ganti dengan nomor WA kamu
    const phoneNumber = "6281389134993"; // Ganti dengan nomor WA kamu

    const message =
      `Halo, saya tertarik dengan produk berikut:\n` +
      `Nama Produk: ${product?.name}\n` +
      `Harga: ${product?.price}\n` +
      // `Deskripsi: ${product.description}\n` +
      `Apakah masih tersedia?`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(waLink, "_blank");
  };
  // console.log("product:", product); // Debugging line to check product dataj
  ///loading
  if (loading) {
    return (
      <div className="min-h-screen  flex  items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex  items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-spin">
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
    <div className="bg-gradient-to-br md:py-6 from-blue-50 to-indigo-100">
      <section className=" mb-8 bg-white py-8 text-gray-800 px-6 py rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
        <button
          className="flex items-center gap-1 mt-2 -translate-y-3 hover:gap-2 cursor-pointer"
          onClick={() => router.back()}
        >
          <IoIosArrowBack />
          <span>back</span>
        </button>
        <div className="flex gap-4 flex-col md:flex-row md:items-start justify-evenly  ">
          <div className="min-w-xs">
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
          <div className="flex flex-col lg:self-center space-y-4">
            <h1 className="text-3xl font-bold">{product?.name}</h1>
            {/* <div className="text-base">
            {showMore ? (
              <div
                className="reset prose"
                dangerouslySetInnerHTML={{ __html: product?.description! }}
              />
            ) : (
              product?.description.slice(0, maxChars) +
              (product?.description.length! > maxChars ? "..." : "")
            )}

            {product?.description.length! > maxChars && (
              <button
                onClick={toggleShowMore}
                className="ml-2 text-blue-500 underline"
              >
                {showMore ? "Show less" : "Show more"}
              </button>
            )}
          </div> */}
            {/* <p className="text-lg text-gray-600">{product?.description}</p> */}
            <p>
              Kategori :{" "}
              <Link
                className="text-blue-700 hover:underline"
                href={`/products?category=${product?.category.id}`}
              >
                {product?.category.name}
              </Link>
            </p>
            <p className="text-2xl font-semibold text-green-700">
              Rp{product?.price.toLocaleString()}
            </p>

            {/* Tombol WA */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-black  text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Beli Sekarang via WhatsApp
            </button>
          </div>
        </div>
        <hr className="my-4" />
        <p className="strong font-semibold my-2 ">Deskripsi :</p>
        <div
          className="reset"
          dangerouslySetInnerHTML={{ __html: product?.description! }}
        />
      </section>
    </div>
  );
}
