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

export default async function Home() {
  const [{ categories, images }, siteSettings] = await Promise.all([
    getPortfolioData(),
    getSiteSettings(),
  ]);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <VideoSection
          url={siteSettings.intro_video_url}
          title="Our Studio"
          subtitle="Video"
          sectionId="intro-video"
        />
        <Portfolio categories={categories} images={images} />
        <VideoSection
          url={siteSettings.proposal_video_url}
          title="Featured Work"
          subtitle="Proposal Reel"
          sectionId="proposal-video"
          dark
        />
        <Services />
        <Contact phone={siteSettings.phone} email={siteSettings.email} />
        <Footer phone={siteSettings.phone} email={siteSettings.email} />
      </main>
    </>
  );
}
