"use client";

import { cn } from "@/lib/format";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none",
        "focus:border-zinc-900",
        props.className
      )}
    />
  );
}
