export default function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-md p-4 w-64 shadow animate-pulse bg-white">
      <div className="h-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
