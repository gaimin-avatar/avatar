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
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-lime-400 text-zinc-950 shadow-[0_10px_30px_rgba(132,204,22,0.22)] hover:bg-lime-300",
        variant === "secondary" &&
          "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800",
        variant === "ghost" && "text-zinc-300 hover:bg-zinc-900 hover:text-white",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "icon" && "h-10 w-10",
        className,
      )}
      {...props}
    />
  );
}
