import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[#E6DFD5]/40",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E6DFD5] rounded-[24px] overflow-hidden shadow-sm">
      <Skeleton className="h-[250px] rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-end justify-between pt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 w-full rounded-[14px]" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-16 w-full" />
        <div className="pt-4 border-t border-[#E6DFD5]/40 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="border-b border-[#E6DFD5]/40">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
