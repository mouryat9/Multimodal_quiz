import { JobList } from "@/components/Jobs/JobList";

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      <JobList />
    </div>
  );
}
