"use client";

import { useCallback, useRef } from "react";
import { FilePicker } from "@/components/Upload/FilePicker";
import { Card } from "@/components/UI/Card";

const ACCEPTED = ["video/mp4", "video/quicktime", "video/webm"];

export function UploadDropzone({
  file,
  onFileSelected
}: {
  file: File | null;
  onFileSelected: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0];
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      alert("Please upload MP4/MOV/WEBM.");
      return;
    }
    onFileSelected(f);
  }, [onFileSelected]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="rounded-xl border-2 border-dashed border-zinc-300 bg-white p-4"
    >
      <div className="flex flex-col gap-3">
        <div className="text-sm text-zinc-700">
          Drag & drop a video here, or click to choose a file.
        </div>

        <FilePicker
          inputRef={inputRef}
          accept="video/mp4,video/quicktime,video/webm"
          onPicked={(f) => onFileSelected(f)}
        />

        {file ? (
          <Card title="Selected file">
            <div className="text-sm">
              <div><span className="font-medium">Name:</span> {file.name}</div>
              <div><span className="font-medium">Size:</span> {(file.size / (1024 * 1024)).toFixed(2)} MB</div>
              <div><span className="font-medium">Type:</span> {file.type}</div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
