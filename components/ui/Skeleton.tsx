import React from "react";
import SkeletonCard from "./SkeletonCard";

const SkeletonLoader = ({ S }: { S: number }) => {
  return (
    <div className="flex gap-3 flex-wrap w-full justify-between">
      {[...Array(S)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
