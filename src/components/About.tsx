import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-6">
              About Us
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-white mb-8 leading-tight">
              Capturing the final stage
              <br />
              <span className="text-[var(--muted)]">of your story</span>
            </h2>
            <div className="space-y-6 text-[var(--muted)] font-[family-name:var(--font-cormorant)] text-lg leading-relaxed">
              <p>
                Final Stage is a boutique photography studio dedicated to creating
                timeless imagery that transcends the ordinary. With years of
                experience and an unwavering attention to detail, we specialize in weddings, engagement, family, portraits, and events.
              </p>
              <p>
                Every frame we capture is crafted with intention—light, shadow,
                and emotion converge to tell your unique narrative. We believe
                that photography is not merely documentation, but the art of
                preserving the moments that define you.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="/portfolio_pictures/Engagement/Couple3.jpeg"
                alt=""
                fill
                className="object-cover object-center"
                loading="lazy"
                quality={88}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-[var(--gold)]/30 m-6 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
