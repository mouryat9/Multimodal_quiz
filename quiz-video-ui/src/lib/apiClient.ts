import { Job } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  async createJobFromFile(file: File): Promise<Job> {
    const form = new FormData();
    form.append("file", file);

    return http<Job>(`${API_BASE}/upload`, {
      method: "POST",
      body: form
    });
  },

  async createJobFromYoutube(youtubeUrl: string): Promise<Job> {
    return http<Job>(`${API_BASE}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeUrl })
    });
  },

  async runJob(jobId: string): Promise<Job> {
    return http<Job>(`${API_BASE}/jobs/${jobId}/run`, {
      method: "POST"
    });
  },

  async listJobs(): Promise<Job[]> {
    return http<Job[]>(`${API_BASE}/jobs`, { method: "GET" });
  },

  async getJob(jobId: string): Promise<Job> {
    return http<Job>(`${API_BASE}/jobs/${jobId}`, {
      method: "GET",
      cache: "no-store"
    });
  }
};
