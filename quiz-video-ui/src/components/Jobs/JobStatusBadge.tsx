"use client";

import { JobStatus } from "@/lib/types";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const cls =
    status === "QUEUED" ? "bg-zinc-100 text-zinc-700 border-zinc-200" :
    status === "RUNNING" ? "bg-blue-50 text-blue-700 border-blue-200" :
    status === "SUCCEEDED" ? "bg-green-50 text-green-700 border-green-200" :
    "bg-red-50 text-red-700 border-red-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${cls}`}>
      {status}
    </span>
  );
}
