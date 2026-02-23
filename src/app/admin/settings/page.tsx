import AdminSettingsForm from "./AdminSettingsForm";
import { getSiteSettingsFull } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const initialData = await getSiteSettingsFull();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-8">
        Site Settings
      </h1>
      <AdminSettingsForm initialData={initialData} />
    </div>
  );
}
