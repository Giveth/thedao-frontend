import HeroSection from '~/components/sections/HeroSection'
import TreasurySection from '~/components/sections/TreasurySection'
import CuratorsSection from '~/components/sections/CuratorsSection'
import WhyExistsSection from '~/components/sections/WhyExistsSection'
import Footer from '~/components/Footer'
import { generateMeta } from '~/utils/meta'
import { generateHomepageStructuredData, structuredDataToMetaTags } from '~/utils/structured-data'

export function meta() {
  const metaTags = generateMeta();
  const structuredData = generateHomepageStructuredData();
  const structuredDataTags = structuredDataToMetaTags(structuredData);

  return [...metaTags, ...structuredDataTags];
}

export function links() {
  return [
    // Preload critical assets
    {
      rel: "preload",
      href: "/dao-logo.svg",
      as: "image",
      type: "image/svg+xml",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-dao-blue relative overflow-x-hidden">
      <HeroSection />
      
      {/* Treasury + Curators shared background */}
      <div className="relative">
        <div 
          className="absolute inset-0 pointer-events-none bg-[url('/curators-background.svg')] bg-bottom bg-no-repeat bg-size-[auto_100%]"
        />
        <TreasurySection />
        <CuratorsSection />
      </div>
      <WhyExistsSection />
      <Footer />
    </div>
  )
}

