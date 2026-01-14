"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";
import { Toast } from "@/components/UI/Toast";
import { UploadDropzone } from "@/components/Upload/UploadDropzone";
import { YoutubeUrlInput } from "@/components/Upload/YoutubeUrlInput";
import { apiClient } from "@/lib/apiClient";
import { isValidYoutubeUrl } from "@/lib/validators";
import { Spinner } from "@/components/UI/Spinner";
import { useRouter } from "next/navigation";

type Mode = "file" | "youtube";

export function UploadForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (mode === "file") return !!file;
    return isValidYoutubeUrl(youtubeUrl);
  }, [mode, file, youtubeUrl, submitting]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
        const job =
        mode === "file"
            ? await apiClient.createJobFromFile(file!)
            : await apiClient.createJobFromYoutube(youtubeUrl);

        // NEW: kick off backend pipeline
        await apiClient.runJob(job.id);

        router.push(`/jobs/${job.id}`);
    } catch (e: any) {
        Toast.show(e?.message ?? "Failed to create job");
    } finally {
        setSubmitting(false);
    }
 }


  return (
    <div className="space-y-4">
      <Card title="Choose input">
        <div className="flex gap-2">
          <Button
            variant={mode === "file" ? "primary" : "secondary"}
            onClick={() => setMode("file")}
          >
            Upload File
          </Button>
          <Button
            variant={mode === "youtube" ? "primary" : "secondary"}
            onClick={() => setMode("youtube")}
          >
            YouTube URL
          </Button>
        </div>

        <div className="mt-4">
          {mode === "file" ? (
            <UploadDropzone file={file} onFileSelected={setFile} />
          ) : (
            <YoutubeUrlInput value={youtubeUrl} onChange={setYoutubeUrl} />
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" /> Submitting
              </span>
            ) : (
              "Parse"
            )}
          </Button>

          <p className="text-xs text-zinc-600">
            This UI creates a job and simulates parsing. Replace the API routes later with your pipeline.
          </p>
        </div>
      </Card>

      <Card title="What happens next (pipeline steps)">
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>Extract audio + frames</li>
          <li>Transcribe (ASR) + OCR key frames (optional)</li>
          <li>Chunk + embed + index into vector store</li>
          <li>Generate quiz items with citations (timestamps/chunks)</li>
        </ul>
      </Card>
    </div>
  );
}
