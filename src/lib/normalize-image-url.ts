export function normalizeImageUrl(input?: string | null): string {
  if (!input) return "";

  const url = input.trim();
  if (!url) return "";

  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1200`;
  }

  try {
    const parsed = new URL(url);
    const isGoogleDrive = parsed.hostname === "drive.google.com" || parsed.hostname.endsWith(".drive.google.com");

    if (isGoogleDrive) {
      if (parsed.pathname === "/thumbnail") return url;

      const id = parsed.searchParams.get("id");
      if (id && (parsed.pathname === "/open" || parsed.pathname === "/uc")) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
      }
    }

    return url;
  } catch {
    return url;
  }
}
