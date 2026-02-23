export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage =
    error === "required"
      ? "Password required"
      : error === "invalid"
        ? "Invalid password"
        : error === "config"
          ? "Server not configured"
          : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <form
        method="post"
        action="/api/auth/login-form"
        className="w-full max-w-sm p-8 border border-[var(--border)] bg-[#0d0d0d]"
      >
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--gold)] tracking-[0.2em] uppercase mb-6 text-center">
          Admin Login
        </h1>
        <input
          type="password"
          name="password"
          placeholder="Password"
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
          Sign in
        </button>
      </form>
    </div>
  );
}
