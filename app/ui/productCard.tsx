import Image from "next/image";
import Link from "next/link";

// components/ProductCard.tsx
export default async function ProductCard({ product }: { product: any }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition"
    >
      <Image
        src={product?.images[0] || "https://placehold.co/600x400"}
        alt={"card image"}
        className="w-16 h-16 mb-4"
        width={600}
        height={400}
      />
      <h3 className="text-lg font-bold text-blue-800">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
    </Link>
  );
}
