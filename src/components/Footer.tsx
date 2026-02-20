export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <a
            href="#"
            className="font-[family-name:var(--font-playfair)] text-lg font-semibold tracking-[0.2em] uppercase text-[var(--foreground)] hover:text-[var(--gold)] transition-colors"
          >
            Final Stage
          </a>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-[var(--muted)]">
            <a href="tel:+12062069868" className="hover:text-[var(--gold)] transition-colors">
              (206) 206-9868
            </a>
            <a
              href="mailto:pictureyour2day@gmail.com"
              className="hover:text-[var(--gold)] transition-colors"
            >
              pictureyour2day@gmail.com
            </a>
          </div>
        </div>
        <div className="divider-gold mt-8 mb-8" />
        <p className="text-center text-[var(--muted)] text-sm">
          © {currentYear} Final Stage. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
