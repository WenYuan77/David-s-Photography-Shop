"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/portfolio_pictures/Wedding/W7.jpeg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={88}
          sizes="100vw"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-6 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-[var(--gold)] tracking-[0.4em] uppercase text-sm mb-4 animate-fade-in">
          Professional Photography
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-6 animate-fade-in-up">
          Final Stage
        </h1>
        <div className="divider-gold w-32 mx-auto mb-8" />
        <p className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl text-[var(--muted)] max-w-2xl mx-auto mb-12 font-light animate-fade-in-up animation-delay-200">
          Where moments become masterpieces
        </p>
        <a
          href="#contact"
          className="inline-block px-10 py-4 border border-[var(--gold)] text-[var(--gold)] font-medium tracking-[0.2em] uppercase text-sm hover:bg-[var(--gold)] hover:text-[var(--background)] transition-all duration-500 animate-fade-in-up animation-delay-300"
        >
          Book a Session
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce-slow">
        <div className="w-px h-12 bg-gradient-to-b from-[var(--gold)] to-transparent opacity-60" />
      </div>
    </section>
  );
}
