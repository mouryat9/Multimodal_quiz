"use client";

import useSWR from "swr";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { Card } from "@/components/UI/Card";
import { Spinner } from "@/components/UI/Spinner";
import { JobStatusBadge } from "@/components/Jobs/JobStatusBadge";
import { formatDateTime } from "@/lib/format";

export function JobList() {
  const { data, isLoading, error } = useSWR("jobs", () => apiClient.listJobs(), {
    refreshInterval: 1500
  });

  if (isLoading) return <div className="flex items-center gap-2"><Spinner /> Loading jobs…</div>;
  if (error) return <p className="text-sm text-red-600">Failed to load jobs.</p>;

  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <Card title="No jobs yet">
          <p className="text-sm text-zinc-700">
            Create your first job from the <Link className="underline" href="/upload">upload</Link> page.
          </p>
        </Card>
      ) : null}

      {data.map((job) => (
        <Card key={job.id} title={`Job ${job.id}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 text-sm text-zinc-700">
              <div className="flex items-center gap-2">
                <JobStatusBadge status={job.status} />
                <span className="text-xs text-zinc-500">{formatDateTime(job.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium">Input:</span>{" "}
                {job.input.type === "file" ? job.input.filename : job.input.youtubeUrl}
              </div>
              <div className="text-xs text-zinc-600">{job.message ?? ""}</div>
            </div>

            <Link
              className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-zinc-50"
              href={`/jobs/${job.id}`}
            >
              View
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
