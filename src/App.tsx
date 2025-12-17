import daoLogo from '/dao-logo.svg'
import TextType from './components/TextType'
import TreasurySection from './components/TreasurySection'
import CuratorsSection from './components/CuratorsSection'
import WhyExistsSection from './components/WhyExistsSection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen w-full bg-[#28567A] relative overflow-x-hidden">
      {/* Background decoration - fixed to viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-dao-red/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative">
        <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center gap-12">
          {/* Logo */}
          <div className="animate-float animate-pulse-glow">
            <img 
              src={daoLogo} 
              alt="The DAO Logo" 
              className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] drop-shadow-2xl"
            />
          </div>
          
          {/* Headline */}
          <h1 className="text-[30px] md:text-[40px] font-normal text-white tracking-tight leading-none">
            THE DAO IS{' '}
            <TextType
              text={["BACK.", "REVOLUTIONARY.", "SECURITY.", "REWARDING."]}
              as="span"
              typingSpeed={190}
              deletingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              loop={true}
              textColors={["#FF3C38", "#5CB75A", "#FF3C38", "#5CB75A"]}
            />
          </h1>

          {/* CTA Button */}
          <a
            href="https://giveth.typeform.com/to/XB4mTMou"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 h-10 inline-flex items-center justify-center"
          >
            Get Involved
          </a>
        </main>
      </section>

      {/* Treasury Section */}
      <TreasurySection />

      {/* Curators Section */}
      <CuratorsSection />

      {/* Why This Exists Section */}
      <WhyExistsSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
