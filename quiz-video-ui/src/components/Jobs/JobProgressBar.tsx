"use client";

export function JobProgressBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-zinc-900" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-xs text-zinc-600">{pct}%</div>
    </div>
  );
}
