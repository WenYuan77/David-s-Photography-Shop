import { urlToEmbed } from "@/lib/video-embed";

type Props = {
  url: string;
  title: string;
  subtitle?: string;
  sectionId?: string;
  dark?: boolean;
  autoplay?: boolean;
};

export default function VideoSection({ url, title, subtitle, sectionId, dark, autoplay }: Props) {
  const embedUrl = urlToEmbed(url, autoplay);
  if (!embedUrl) return null;

  return (
    <section
      id={sectionId}
      className={`scroll-mt-24 py-24 md:py-32 ${dark ? "bg-[#0d0d0d]" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[var(--gold)] tracking-[0.3em] uppercase text-sm mb-4">
            {subtitle}
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-white">
            {title}
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full aspect-video overflow-hidden bg-[#0d0d0d] border border-[var(--border)] shadow-[0_0_40px_rgba(201,169,98,0.08)]">
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
