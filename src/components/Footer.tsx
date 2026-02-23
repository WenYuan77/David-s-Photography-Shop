type Props = {
  phone: string;
  email: string;
};

export default function Footer({ phone, email }: Props) {
  const currentYear = new Date().getFullYear();
  const telHref = phone.replace(/\D/g, "");

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
            <a
              href={telHref ? `tel:+${telHref}` : "#"}
              className="hover:text-[var(--gold)] transition-colors"
            >
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="hover:text-[var(--gold)] transition-colors"
            >
              {email}
            </a>
          </div>
        </div>
        <div className="divider-gold mt-8 mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-[var(--muted)]">
          <p>© {currentYear} Final Stage. All rights reserved.</p>
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[var(--muted)]/80 hover:text-[var(--gold)] transition-colors duration-300 tracking-[0.1em]"
            aria-label="Admin"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 opacity-70"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                clipRule="evenodd"
              />
            </svg>
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
