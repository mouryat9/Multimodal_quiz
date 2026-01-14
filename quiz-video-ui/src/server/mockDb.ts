import { Job, JobResult } from "@/lib/types";

export type CreateJobInput =
  | { type: "file"; filename: string }
  | { type: "youtube"; youtubeUrl: string };

const jobs = new Map<string, Job>();

function id() {
  return Math.random().toString(16).slice(2, 10);
}

export function createJob(input: CreateJobInput): Job {
  const job: Job = {
    id: id(),
    status: "QUEUED",
    progress: 0,
    message: "Queued",
    createdAt: new Date().toISOString(),
    input
  };
  jobs.set(job.id, job);
  return job;
}

export function listJobs(): Job[] {
  return Array.from(jobs.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getJob(jobId: string): Job | null {
  return jobs.get(jobId) ?? null;
}

function buildResult(): JobResult {
  return {
    transcriptPreview:
      "Today we covered retrieval-augmented generation (RAG), chunking strategies, and evaluation...",
    detectedSections: [
      { title: "Intro to RAG", startSec: 0, endSec: 210 },
      { title: "Chunking + Embeddings", startSec: 210, endSec: 620 },
      { title: "Quiz Generation", startSec: 620, endSec: 980 }
    ],
    notes:
      "Replace this stub with your pipeline outputs: transcript, chunk metadata, citations, and generated quiz items."
  };
}

/**
 * Simulate job progression.
 * Each tick: QUEUED -> RUNNING -> SUCCEEDED, with progress increments.
 */
export function tickJobs() {
  for (const job of jobs.values()) {
    if (job.status === "SUCCEEDED" || job.status === "FAILED") continue;

    if (job.status === "QUEUED") {
      job.status = "RUNNING";
      job.progress = 10;
      job.message = "Extracting audio / metadata…";
      continue;
    }

    // RUNNING
    const next = Math.min(100, job.progress + 15);
    job.progress = next;

    if (next < 45) job.message = "Transcribing audio…";
    else if (next < 70) job.message = "Chunking + embedding…";
    else if (next < 95) job.message = "Indexing + preparing quiz…";
    else job.message = "Finalizing…";

    if (next >= 100) {
      job.status = "SUCCEEDED";
      job.message = "Done";
      job.result = buildResult();
    }
  }
}
