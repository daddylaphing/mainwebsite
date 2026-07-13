import { ProductCardSkeleton } from "@/components/ui/loading-skeleton";

export function ProductsSectionLoading() {
  return (
    <section className="pt-10 md:pt-20" id="products">
      {/* Title Skeleton */}
      <div className="flex flex-col items-center md:items-start mb-8 md:mb-12">
        <div className="h-12 w-64 bg-[#E6DFD5]/40 rounded-lg animate-pulse" />
        <div className="h-[3px] w-16 bg-[#6E1D25]/10 rounded-full mt-3 animate-pulse" />
      </div>

      {/* 3-column product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>

      {/* Bulk Order Banner Skeleton */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#E6DFD5] rounded-[24px] px-6 py-5 shadow-sm">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-48 bg-[#E6DFD5]/40 rounded animate-pulse" />
          <div className="h-4 w-64 bg-[#E6DFD5]/40 rounded animate-pulse" />
        </div>
        <div className="h-10 w-48 bg-[#E6DFD5]/40 rounded-[14px] animate-pulse" />
      </div>
    </section>
  );
}
