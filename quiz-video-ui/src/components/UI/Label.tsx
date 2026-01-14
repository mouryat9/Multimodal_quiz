"use client";

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-zinc-800">{children}</label>;
}
