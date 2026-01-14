"use client";

export function Spinner({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span
      className={`${cls} inline-block animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900`}
      aria-label="Loading"
    />
  );
}
