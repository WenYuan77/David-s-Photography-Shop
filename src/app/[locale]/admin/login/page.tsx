import { getTranslations } from "next-intl/server";

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = await getTranslations("admin.login");
  const errorMessage =
    error === "required"
      ? t("errorRequired")
      : error === "invalid"
        ? t("errorInvalid")
        : error === "config"
          ? t("errorConfig")
          : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <form
        method="post"
        action="/api/auth/login-form"
        className="surface-card w-full max-w-sm p-8 border"
      >
        <input type="hidden" name="locale" value={locale} />
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-6 text-center">
          {t("title")}
        </h1>
        <input
          type="password"
          name="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          required
          autoFocus
          className="w-full px-4 py-3 bg-transparent border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors mb-4"
        />
        {errorMessage && (
          <p className="text-[var(--accent-red)] text-sm mb-4">{errorMessage}</p>
        )}
        <button
          type="submit"
          className="w-full py-3 border border-[var(--gold)] text-[var(--gold)] font-medium tracking-[0.2em] uppercase text-sm hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all cursor-pointer"
        >
          {t("signIn")}
        </button>
      </form>
    </div>
  );
}
