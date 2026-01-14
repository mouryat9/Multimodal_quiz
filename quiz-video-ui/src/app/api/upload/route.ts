import { NextResponse } from "next/server";
import { createJob, type CreateJobInput } from "@/server/mockDb";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";

  let input: CreateJobInput | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return new NextResponse("Missing file", { status: 400 });
    }
    input = { type: "file", filename: file.name };
  } else if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body?.youtubeUrl || typeof body.youtubeUrl !== "string") {
      return new NextResponse("Missing youtubeUrl", { status: 400 });
    }
    input = { type: "youtube", youtubeUrl: body.youtubeUrl };
  } else {
    return new NextResponse("Unsupported content type", { status: 415 });
  }

  const job = createJob(input);
  return NextResponse.json(job);
}
