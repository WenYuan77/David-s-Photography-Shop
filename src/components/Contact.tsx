type Props = {
  phone: string;
  email: string;
};

export default function Contact({ phone, email }: Props) {
  const telHref = phone.replace(/\D/g, "");

  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-32 bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-4">Contact</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-white mb-8">
            Let&apos;s Create Together
          </h2>
          <div className="divider-gold w-24 mx-auto mb-16" />
          <p className="text-[var(--muted)] font-[family-name:var(--font-cormorant)] text-lg mb-12">
            Ready to capture your story? Reach out to schedule a consultation or discuss your
            project.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <a
              href={telHref ? `tel:+${telHref}` : "#"}
              className="group flex items-center gap-4 text-[var(--foreground)] hover:text-[var(--gold)] transition-colors duration-300"
            >
              <span className="text-[var(--gold)] group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <span className="font-[family-name:var(--font-cormorant)] text-lg tracking-wide">
                {phone}
              </span>
            </a>
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-4 text-[var(--foreground)] hover:text-[var(--gold)] transition-colors duration-300"
            >
              <span className="text-[var(--gold)] group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span className="font-[family-name:var(--font-cormorant)] text-lg tracking-wide">
                {email}
              </span>
            </a>
          </div>

          <a
            href={`mailto:${email}`}
            className="inline-block mt-12 px-10 py-4 bg-[var(--accent-red)] text-white font-medium tracking-[0.2em] uppercase text-sm hover:bg-[#a52d3d] transition-colors duration-300"
          >
            Book Your Session
          </a>
        </div>
      </div>
    </section>
  );
}
