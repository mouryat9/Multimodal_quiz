export type JobStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export type JobInput =
  | { type: "file"; filename: string }
  | { type: "youtube"; youtubeUrl: string };

export type JobResult = {
  transcript: string;
  chunks: Array<{ start: number; end: number; text: string }>;
  quiz?: any; // for now
};

export type Job = {
  id: string;
  status: JobStatus;
  progress: number;
  message?: string;
  input: JobInput;
  result?: JobResult;
};
