import HeroSection from './components/HeroSection'
import TreasurySection from './components/TreasurySection'
import CuratorsSection from './components/CuratorsSection'
import WhyExistsSection from './components/WhyExistsSection'
import Footer from './components/Footer'

function App() {
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

export default App
