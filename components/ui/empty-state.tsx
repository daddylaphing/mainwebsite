import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="w-16 h-16 bg-white/[0.05] rounded-2xl flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-[#8F857B]" />
      </div>
      <h3
        className="text-lg font-bold text-[#F8F5EE] mb-2"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm text-[#8F857B] max-w-md mb-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#E7B52C] text-black font-bold rounded-xl hover:bg-[#F4C542] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
