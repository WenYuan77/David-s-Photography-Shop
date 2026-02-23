import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
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
        <Portfolio categories={categories} images={images} />
        <Services />
        <Contact phone={siteSettings.phone} email={siteSettings.email} />
        <Footer phone={siteSettings.phone} email={siteSettings.email} />
      </main>
    </>
  );
}
