import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold">
            Quiz Video UI
          </Link>
          <nav className="flex gap-4 text-sm text-zinc-700">
            <Link href="/upload" className="hover:text-zinc-900">Upload</Link>
            <Link href="/jobs" className="hover:text-zinc-900">Jobs</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-zinc-500">
          UI scaffold for video → parsing → quiz generation (RAG).
        </div>
      </footer>
    </div>
  );
}
