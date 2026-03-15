import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoSection from "@/components/VideoSection";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/portfolio-data";
import { getSiteSettings } from "@/lib/site-settings";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [{ categories, images }, siteSettings, videoT] = await Promise.all([
    getPortfolioData(),
    getSiteSettings(),
    getTranslations("video"),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <VideoSection
          url={siteSettings.intro_video_url}
          title={videoT("ourStudio")}
          subtitle={videoT("videoLabel")}
          sectionId="intro-video"
          autoplay={siteSettings.intro_video_autoplay}
        />
        <Portfolio categories={categories} images={images} />
        <VideoSection
          url={siteSettings.proposal_video_url}
          title={videoT("featuredWork")}
          subtitle={videoT("proposalReel")}
          sectionId="proposal-video"
          dark
          autoplay={siteSettings.proposal_video_autoplay}
        />
        <Services />
        <Contact phone={siteSettings.phone} email={siteSettings.email} />
        <Footer phone={siteSettings.phone} email={siteSettings.email} />
      </main>
    </>
  );
}
