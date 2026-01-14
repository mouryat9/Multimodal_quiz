import { NextResponse } from "next/server";
import { getJob, tickJobs } from "@/server/mockDb";

export async function GET(_: Request, ctx: { params: Promise<{ jobId: string }> }) {
  tickJobs();
  const { jobId } = await ctx.params;
  const job = getJob(jobId);
  if (!job) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(job);
}
