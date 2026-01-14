"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { Card } from "@/components/UI/Card";
import { JobStatusBadge } from "@/components/Jobs/JobStatusBadge";
import { JobProgressBar } from "@/components/Jobs/JobProgressBar";
import { Spinner } from "@/components/UI/Spinner";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const { data: job, error, isLoading } = useSWR(
    ["job", jobId],
    () => apiClient.getJob(jobId),
    { refreshInterval: 1500 } // poll while it runs
  );

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-zinc-700">
        <Spinner size="sm" /> Loading…
      </div>
    );
  }

  if (error || !job) {
    return (
      <Card title="Job">
        <p className="text-sm text-red-600">Failed to load job.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card title={`Job ${job.id}`}>
        <div className="flex items-center gap-3">
          <JobStatusBadge status={job.status} />
          <span className="text-sm text-zinc-700">{job.message ?? ""}</span>
        </div>
        <div className="mt-3">
          <JobProgressBar progress={job.progress ?? 0} />
        </div>
      </Card>

      <Card title="Transcript">
        <pre className="whitespace-pre-wrap text-sm text-zinc-800">
          {job.result?.transcript ?? "No transcript available."}
        </pre>
      </Card>

      <Card title="Quiz output">
        <pre className="whitespace-pre-wrap text-sm text-zinc-800">
          {job.result?.quiz?.raw
            ? job.result.quiz.raw
            : job.result?.quiz
              ? JSON.stringify(job.result.quiz, null, 2)
              : "No quiz available."}
        </pre>
      </Card>

      <Card title="Chunks (debug)">
        <pre className="whitespace-pre-wrap text-xs text-zinc-700">
          {job.result?.chunks ? JSON.stringify(job.result.chunks.slice(0, 10), null, 2) : "No chunks."}
        </pre>
      </Card>
    </div>
  );
}
