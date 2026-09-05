/** Placeholders de carga con la geometría real de las tarjetas. */

export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-card bg-surface-2 ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="overflow-hidden rounded-card border border-line bg-white">
    <Skeleton className="aspect-square rounded-none" />
    <div className="flex flex-col gap-3 p-5">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/3 rounded-md" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);
