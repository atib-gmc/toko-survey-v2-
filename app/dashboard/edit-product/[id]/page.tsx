"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import RichTextEditor from "@/app/richtext/RichTextEditor";

type ProductFormData = {
  name: string;
  // description: string;
  price: number;
  stock: number;
  images: FileList;
  category: any;
};

export default function EditProduct() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [change, setChange] = useState<string>("");
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
    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  // Handle new image previews
  useEffect(() => {
    // Pastikan watchImages ada dan memiliki file
    if (watchImages && watchImages.length > 0) {
      const files = Array.from(watchImages);
      const previews: string[] = [];

      files.forEach((file) => {
        // ✅ Tambahkan pemeriksaan keamanan di sini
        if (file && file.type && file.type.startsWith("image/")) {
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
  // console.log(
  //   "image preview:",
  //   imagePreview.map((data) => data)
  // );

  const fetchProduct = async () => {
    setProductLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      const { data: cat, error: catError } = await supabase
        .from("category")
        .select("*");
      if (error) {
        console.error("Error fetching product:", error);
        alert("Produk tidak ditemukan");
        router.push("/dashboard");
        return;
      }

      // Set form values
      setValue("name", data.name);
      setCategories(cat || []);
      setValue("category", data.category_id);
      // setValue("description", data.description);
      setChange(data.description);
      setValue("price", data.price);
      setValue("stock", data.stock);
      //   setExistingImages(data.images || []);
      setExistingImages(data.images);
      setLoading(false);
      // console.log(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal memuat data produk");
      router.push("/dashboard");
    } finally {
      setLoading(false);
      setProductLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const images = data.images ? Array.from(data.images) : [];

      // Handle new image uploads
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
        //menghapus deleted image dari storage
        if (deletedImages.length > 0) {
          const imageName = deletedImages.map((img) => {
            const parts = img.split("/");
            return parts.slice(-1).join("/");
          });
          await supabase.storage
            .from("images")
            .remove(imageName)
            .catch((error) => {
              console.error("Error removing images:", error);
            });
        }

        return publicUrl; // Mengembalikan URL dari setiap promise
      });

      // 2. Tunggu semua janji (promise) selesai
      const urls = await Promise.all(uploadPromises);
      const allurls = [...existingImages, ...urls];
      const parseUrls = allurls.join(",");
      const pgArray = `{${parseUrls}}`;
      // console.log("Uploaded URLs:", allurls);
      // console.log("PostgreSQL Array Format:", pgArray);

      // Update product in database
      const { error: dbError } = await supabase
        .from("products")
        .update({
          name: data.name,
          description: change,
          price: data.price,
          stock: data.stock,
          images: allurls,
          category_id: data.category,
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

  const removeExistingImage = (index: number, imageUrl: string) => {
    const newImages = existingImages.filter((_, i) => i !== index);
    setDeletedImages((prev) => [...prev, imageUrl]);
    setExistingImages(newImages);
  };

  function deletePreviewImage(index: number) {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    // Remove the file from the FileList in the form
    const files = watchImages ? Array.from(watchImages) : [];
    const newFiles = files.filter((_, i) => i !== index);
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    setValue("images", dataTransfer.files);
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 lg:px-0  py-8">
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
            {/* <div>
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
            </div> */}

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Saat Ini
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        width={240}
                        height={320}
                        src={imageUrl}
                        alt={`Current ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index, imageUrl)}
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
                          if (existingImages.length + img.length > 3) {
                            return "Maksimal 3 gambar yang dapat diupload";
                          }
                          for (const file of img) {
                            if (file.size > 1024 * 1024) {
                              return "Ukuran gambar maksimal 1MB";
                            }
                          }
                        },
                      })}
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
                        <div
                          onClick={() => deletePreviewImage(index)}
                          key={index}
                          className="relative group"
                        >
                          <Image
                            width={100}
                            height={100}
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
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.images.message}
                  </p>
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
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                id="category"
                {...register("category")}
                className="border rounded px-3 py-2 w-[220px]  "
              >
                <option value="" disabled>
                  pilih kategori
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* <SelectOption
                label="Pilih Kategori"
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                defaultValue={selectedCategory}
                placeholder="Pilih kategori..."
                onChange={(value) => {
                  setSelectedCategory(value);
                }}
              /> */}
            </div>
            {/* deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <RichTextEditor value={change} onchange={setChange} />
              {change && change.length < 5 && (
                <p className="text-red-500 text-sm mt-1">
                  Deskripsi produk wajib diisi
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
