"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { User } from "@supabase/supabase-js";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: FileList;
};

export default function EditProduct() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>();

  const watchImages = watch("images");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  useEffect(() => {
    if (user && productId) {
      fetchProduct();
    }
  }, [user, productId]);

  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const files = Array.from(watchImages);
      const previews: string[] = [];

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            previews.push(reader.result as string);
            if (previews.length === files.length) {
              setImagePreview(previews);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      setImagePreview([]);
    }
  }, [watchImages]);

  const fetchProduct = async () => {
    setProductLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        alert("Produk tidak ditemukan");
        router.push("/dashboard");
        return;
      }

      // Set form values
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("price", data.price);
      setValue("stock", data.stock);
      setExistingImages(data.images || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memuat data produk");
      router.push("/dashboard");
    } finally {
      setProductLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      let finalImages = [...existingImages];

      // Handle new image uploads
      const newImages = data.images ? Array.from(data.images) : [];
      if (newImages.length > 0) {
        for (const image of newImages) {
          const fileName = `${Date.now()}-${image.name}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("product-images")
              .upload(fileName, image);

          if (uploadError) {
            throw uploadError;
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("product-images").getPublicUrl(fileName);

          finalImages.push(publicUrl);
        }
      }

      // Update product in database
      const { error: dbError } = await supabase
        .from("products")
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          images: finalImages,
        })
        .eq("id", productId);

      if (dbError) {
        throw dbError;
      }

      alert("Produk berhasil diperbarui!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Gagal memperbarui produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeExistingImage = (index: number) => {
    const newImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newImages);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading || productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Edit Produk
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Halo, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Edit Produk
            </h2>
            <p className="text-gray-600">
              Perbarui informasi produk Anda di form bawah ini.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${
                  errors.name
                    ? "border-red-500"
                    : "border-blue-200 focus:border-blue-600"
                } focus:outline-none transition-colors`}
                placeholder="Masukkan nama produk"
                {...register("name", { required: "Nama produk wajib diisi" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${
                  errors.description
                    ? "border-red-500"
                    : "border-blue-200 focus:border-blue-600"
                } focus:outline-none transition-colors resize-none`}
                placeholder="Deskripsikan produk Anda..."
                {...register("description", {
                  required: "Deskripsi produk wajib diisi",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Saat Ini
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Current ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tambah Gambar Baru
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-blue-600">
                        <span className="font-semibold">Klik untuk upload</span>{" "}
                        atau drag & drop
                      </p>
                      <p className="text-xs text-blue-500">
                        PNG, JPG, JPEG (Max. 5MB per file)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      {...register("images")}
                    />
                  </label>
                </div>

                {/* New Image Preview */}
                {imagePreview.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preview Gambar Baru
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-green-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">
                              Baru {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${
                    errors.price
                      ? "border-red-500"
                      : "border-blue-200 focus:border-blue-600"
                  } focus:outline-none transition-colors`}
                  placeholder="50000"
                  {...register("price", {
                    required: "Harga produk wajib diisi",
                    min: { value: 0, message: "Harga tidak boleh negatif" },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok *
                </label>
                <input
                  type="number"
                  min="0"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-sm ${
                    errors.stock
                      ? "border-red-500"
                      : "border-blue-200 focus:border-blue-600"
                  } focus:outline-none transition-colors`}
                  placeholder="100"
                  {...register("stock", {
                    required: "Jumlah stok wajib diisi",
                    min: { value: 0, message: "Stok tidak boleh negatif" },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Perbarui Produk"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
