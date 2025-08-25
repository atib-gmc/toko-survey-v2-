"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "../ui/productCard";
import SkeletonLoader from "@/components/ui/Skeleton";
import SelectOption from "@/components/ui/SelectOption";

export default function OurProduct() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [products, setProducts] = useState<null | Array<any>>(null);
  const [categories, setCategories] = useState<null | Array<any>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*, category(id, name)");

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("category")
          .select("*");

        if (productsError) console.error(productsError);
        if (categoriesError) console.error(categoriesError);

        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products?.filter((product) =>
    selectedCategory ? product.category.id === selectedCategory : true
  );
  return (
    <div className="section-produk bg-yellow-300 md:px-[20%] py-16 px-4">
      {loading ? (
        <SkeletonLoader S={6} />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="head w-full flex items-center justify-between">
            <span className="text-3xl  font-bold text-left mb-10 uppercase">
              Produk Kami
            </span>
            <SelectOption
              label="Pilih Kategori"
              customSelect={{
                label: "All",
                value: 0,
              }}
              options={categories?.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              defaultValue={selectedCategory}
              // placeholder="Pilih kategori..."
              onChange={(value) => {
                setSelectedCategory(value);
              }}
            />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p>Tidak ada produk tersedia.</p>
          )}
        </div>
      )}
    </div>
  );
}
