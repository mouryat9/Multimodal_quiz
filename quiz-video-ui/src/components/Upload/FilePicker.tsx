"use client";

import { Button } from "@/components/UI/Button";

export function FilePicker({
  inputRef,
  accept,
  onPicked
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  onPicked: (f: File | null) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef as any}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onPicked(e.target.files?.[0] ?? null)}
      />
      <Button
        variant="secondary"
        onClick={() => inputRef.current?.click()}
      >
        Choose file
      </Button>
      <p className="text-xs text-zinc-600">Accepted: MP4 / MOV / WEBM</p>
    </div>
  );
}
