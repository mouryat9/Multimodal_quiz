"use client";

import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { isValidYoutubeUrl } from "@/lib/validators";

export function YoutubeUrlInput({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ok = value.length === 0 ? true : isValidYoutubeUrl(value);

  return (
    <div className="space-y-2">
      <Label>YouTube URL</Label>
      <Input
        placeholder="https://www.youtube.com/watch?v=..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {!ok ? (
        <p className="text-xs text-red-600">Please enter a valid YouTube URL.</p>
      ) : (
        <p className="text-xs text-zinc-600">
          We’ll send this URL to the backend to fetch/parse the video.
        </p>
      )}
    </div>
  );
}
