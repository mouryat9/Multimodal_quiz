export function isValidYoutubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    const isYoutube = host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com";
    if (!isYoutube) return false;

    if (host === "youtu.be") return u.pathname.length > 1; // /VIDEOID
    if (u.pathname === "/watch") return !!u.searchParams.get("v");
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/").filter(Boolean).length >= 2;

    return true;
  } catch {
    return false;
  }
}
