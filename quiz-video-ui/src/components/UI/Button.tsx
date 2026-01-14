"use client";

import { cn } from "@/lib/format";

export function Button({
  children,
  variant = "primary",
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-400"
      : "border bg-white hover:bg-zinc-50 disabled:opacity-60";

  return (
    <button className={cn(base, styles)} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
