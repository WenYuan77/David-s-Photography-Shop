/**
 * Converts video URLs to embed URLs.
 * - Google Drive: https://drive.google.com/file/d/FILE_ID/view → preview URL
 * - Vimeo: https://vimeo.com/ID or player.vimeo.com/video/ID → player embed URL
 * @param url - Share or embed URL from Google Drive or Vimeo
 * @param autoplay - If true (only for Vimeo), adds autoplay=1&muted=1 for browser compliance
 */
export function urlToEmbed(url: string, autoplay?: boolean): string | null {
  const trimmed = (url || "").trim();
  if (!trimmed) return null;

  // Google Drive
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // Vimeo: vimeo.com/ID or player.vimeo.com/video/ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    const base = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return autoplay ? `${base}?autoplay=1&muted=1` : base;
  }

  return null;
}

/** @deprecated Use urlToEmbed(url) instead. Kept for backward compatibility with Drive URLs. */
export function googleDriveUrlToEmbed(url: string): string | null {
  return urlToEmbed(url, false);
}
