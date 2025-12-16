import daoLogo from '/dao-logo.svg'
import TextType from './components/TextType'
import TreasurySection from './components/TreasurySection'

function App() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-dao-blue-light to-dao-blue-dark relative overflow-x-hidden">
      {/* Background decoration - fixed to viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-dao-red/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative">
        <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
          {/* Logo */}
          <div className="mb-8 animate-float animate-pulse-glow">
            <img 
              src={daoLogo} 
              alt="The DAO Logo" 
              className="w-40 h-40 md:w-60 md:h-60 drop-shadow-2xl"
            />
          </div>
          
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight mb-8">
            THE DAO IS{' '}
            <TextType
              text={["BACK.", "CODE.", "REVOLUTIONARY.", "AUTONOMOUS.", "BACK."]}
              as="span"
              typingSpeed={190}
              deletingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              loop={false}
              textColors={["#FF3C38", "#5CB75A", "#FF3C38", "#5CB75A", "#FF3C38"]}
            />
          </h1>
          
          {/* Subtitle */}
          <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10">
            Decentralized. Autonomous. Unstoppable. Join the next chapter of community-driven governance.
          </p>
          
          {/* CTA Button */}
          <button className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm md:text-base px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
            Get Involved
          </button>
        </main>
      </section>

      {/* Treasury Section */}
      <TreasurySection />
    </div>
  )
}

export default App
