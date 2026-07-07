"use client";

import { AlertCircle } from "lucide-react";

interface MinOrderWarningProps {
  current: number;
  minimum: number;
  productName: string;
}

export function MinOrderWarning({ current, minimum, productName }: MinOrderWarningProps) {
  const remaining = minimum - current;

  if (current >= minimum) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-500 mb-1">Minimum Order Not Met</p>
        <p className="text-sm text-[#fbdbd8]/70">
          {productName} requires a minimum order of <strong>{minimum} units</strong>.
          {remaining > 0 && (
            <>
              {" "}
              Add <strong>{remaining} more</strong> to continue.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
