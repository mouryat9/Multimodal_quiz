export function cn(...xs: Array<string | undefined | false | null>) {
  return xs.filter(Boolean).join(" ");
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}
