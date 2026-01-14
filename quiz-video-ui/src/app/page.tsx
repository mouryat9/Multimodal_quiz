import Link from "next/link";
import { Card } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="Quiz Generation (Video + RAG)">
        <p className="text-sm text-zinc-700">
          Upload a lecture video (MP4/MOV/WEBM) or paste a YouTube URL. We’ll create a parse job you can
          monitor, then view parsed output (later: connect to your RAG pipeline + quiz generation).
        </p>

        <div className="mt-4 flex gap-3">
          <Link href="/upload">
            <Button>Go to Upload</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="secondary">View Jobs</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
