import React from "react";
import ProductTable from "./productTbale";

export default function page() {
  return (
    <div>
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Selamat Datang! 👋
        </h2>
        <p className="text-gray-600">
          Anda berhasil masuk ke dashboard. Mulai kelola aktivitas Anda di sini.
        </p>
      </div>

      {/* Stats Cards */}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Product Terbaru
        </h3>
        <div className="space-y-4">
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
