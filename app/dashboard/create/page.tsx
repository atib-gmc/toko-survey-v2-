"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: FileList;
};

export default function CreateProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>();

  const watchImages = watch("images");

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
  function deletePreviewImage(index: number) {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    // Remove the file from the FileList in the form
    const files = watchImages ? Array.from(watchImages) : [];
    const newFiles = files.filter((_, i) => i !== index);
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    setValue("images", dataTransfer.files);
  }

  // Drag and drop logic
  const dropRef = useRef<HTMLLabelElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      setValue("images", dataTransfer.files, { shouldValidate: true });
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const images = data.images ? Array.from(data.images) : [];

      // 1. Unggah semua gambar secara paralel dan kumpulkan URL-nya
      const uploadPromises = images.map(async (image) => {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        return publicUrl; // Mengembalikan URL dari setiap promise
      });

      // 2. Tunggu semua janji (promise) selesai
      const urls = await Promise.all(uploadPromises);

      const parseUrls = urls.join(",");
      const pgArray = `{${parseUrls}}`;
      // console.log("Uploaded URLs:", urls);
      // console.log("PostgreSQL Array Format:", pgArray);

      // 3. Lakukan insert ke database dengan URL yang sudah lengkap
      const { data: product, error } = await supabase.from("products").insert({
        images: pgArray,
        name: data.name,
        price: data.price,
        stock: data.stock,
        description: data.description,
      });

      if (error) {
        alert("Gagal membuat produk. Silakan coba lagi.");
        // Log error secara detail untuk debugging
        console.error("Supabase insert error:", error);
        return; // Hentikan eksekusi jika insert gagal
      }

      // Reset form dan berikan notifikasi
      reset();
      setImagePreview([]);
      alert("Produk berhasil dibuat!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Gagal membuat produk: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  //         <div className="text-center">
  //           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-spin">
  //             <svg
  //               className="w-8 h-8 text-white"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  //               />
  //             </svg>
  //           </div>
  //           <p className="text-gray-600">Memuat halaman...</p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!user) return null;

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
                Buat Produk Baru
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto  py-8">
        <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Informasi Produk
            </h2>
            <p className="text-gray-600">
              Isi form di bawah untuk menambahkan produk baru ke katalog Anda.
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    ref={dropRef}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      dragActive
                        ? "border-blue-600 bg-blue-100"
                        : "border-blue-200 bg-blue-50 hover:bg-blue-100"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
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
                        PNG, JPG, JPEG (Max. 1MB per file)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      {...register("images", {
                        validate: (img) => {
                          if (!img || img.length === 0) {
                            return "Gambar produk wajib diupload";
                          }
                          if (img.length > 3) {
                            return "Maksimal 3 gambar yang dapat diupload";
                          }
                          for (const file of img) {
                            if (file.size > 1024 * 1024) {
                              return "Ukuran gambar maksimal 1MB";
                            }
                          }
                          return true;
                        },
                      })}
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div
                        key={index}
                        onClick={() => deletePreviewImage(index)}
                        className="relative group"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-blue-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">
                            Preview {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.images.message}
                  </p>
                )}
                {imagePreview.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Klik gambar untuk menghapus
                  </p>
                )}
              </div>
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
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
            </div>

            {/* Stock */}
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
