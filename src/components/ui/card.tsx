import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-[#0d0a14]/82 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
