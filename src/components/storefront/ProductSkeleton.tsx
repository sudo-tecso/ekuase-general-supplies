export const ProductSkeleton = () => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden animate-pulse shadow-sm">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-10 bg-muted rounded" />
        </div>
        <div className="h-4 w-full bg-muted rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-10 w-10 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
