import { UploadForm } from "@/components/Upload/UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Upload Video / YouTube URL</h1>
      <UploadForm />
    </div>
  );
}
