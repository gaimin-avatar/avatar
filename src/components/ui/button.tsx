import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b00ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-[#8b00ff] text-white shadow-[0_16px_38px_rgba(139,0,255,0.35)] hover:bg-[#9d2cff]",
        variant === "secondary" &&
          "border border-white/10 bg-white/[0.06] text-zinc-100 hover:border-[#8b00ff]/70 hover:bg-[#8b00ff]/15",
        variant === "ghost" && "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "icon" && "h-10 w-10",
        className,
      )}
      {...props}
    />
  );
}
