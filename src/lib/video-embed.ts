/**
 * Converts Google Drive share/view URL to embed (preview) URL.
 * e.g. https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk → https://drive.google.com/file/d/FILE_ID/preview
 */
export function googleDriveUrlToEmbed(url: string): string | null {
  const trimmed = (url || "").trim();
  if (!trimmed) return null;
  const match = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}
