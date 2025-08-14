"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
export default function ProductPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setData(data);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = data.filter(
    (item: any) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  //   console.log(
  //     data.map((item) => item.images.replace(/{/g, "").replace(/}/g, ""))
  //   );
  if (loading) {
    return (
      <div className="min-h-screen  flex items-center lg:px-[20%]  justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br lg:px-[20%] from-blue-50 to-indigo-100 py-10 px-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Katalog Produk
          </h1>
          <input
            type="text"
            placeholder="Cari produk atau kategori..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-80 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-700 shadow-sm transition"
          />
        </div>
        <div className="flex justify-center lg:justify-start flex-wrap gap-8 min-h-[300px]">
          {paginated.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg py-16 bg-white/60 rounded-lg shadow-inner w-full">
              Belum ada produk ditemukan.
            </div>
          ) : (
            paginated.map((item: any) => (
              <ProductCard
                id={item.id}
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                stock={item.stock}
                images={item.images}
              />
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    aria-disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
