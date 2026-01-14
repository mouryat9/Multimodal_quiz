import { NextResponse } from "next/server";
import { listJobs, tickJobs } from "@/server/mockDb";

export async function GET() {
  // simulate progress advancing over time
  tickJobs();
  return NextResponse.json(listJobs());
}
