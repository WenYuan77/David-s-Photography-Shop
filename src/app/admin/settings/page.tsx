import AdminSettingsForm from "./AdminSettingsForm";
import { getSiteSettingsFull } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const HERO_ERRORS: Record<string, string> = {
  "no-file": "Please select a file.",
  "invalid-type": "Invalid file type. Use JPEG, PNG, WebP or GIF.",
  "file-too-large": "File too large. Max 10MB.",
  "upload-failed": "Upload failed.",
  failed: "Upload failed. Please try again.",
  config: "Supabase not configured.",
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const initialData = await getSiteSettingsFull();
  const params = await searchParams;
  const heroError = params.error ? HERO_ERRORS[params.error] ?? params.error : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-8">
        Site Settings
      </h1>
      <AdminSettingsForm initialData={initialData} heroError={heroError} />
    </div>
  );
}
