import AdminSettingsForm from "./AdminSettingsForm";
import { getSiteSettingsFull } from "@/lib/site-settings";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

const HERO_ERROR_KEYS: Record<string, string> = {
  "no-file": "heroErrorNoFile",
  "invalid-type": "heroErrorInvalidType",
  "file-too-large": "heroErrorTooLarge",
  "upload-failed": "heroErrorUploadFailed",
  failed: "heroErrorUploadFailed",
  config: "heroErrorConfig",
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const initialData = await getSiteSettingsFull({ forAdmin: true });
  const params = await searchParams;
  const t = await getTranslations("admin.settings");
  const heroErrorKey = params.error ? HERO_ERROR_KEYS[params.error] : null;
  const heroError = heroErrorKey ? t(heroErrorKey) : params.error ?? null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-8">
        {t("title")}
      </h1>
      <AdminSettingsForm initialData={initialData} heroError={heroError} />
    </div>
  );
}
