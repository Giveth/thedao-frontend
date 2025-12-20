import daoLogo from '/dao-logo.svg'
import TextType from '../text-animations/TextType'

function HeroSection() {
  const redColor = 'var(--color-dao-red)';
  const greenColor = 'var(--color-dao-green)';

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative bg-linear-to-br from-dao-blue to-dao-blue-dark">
      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center gap-12 max-w-10xl mx-auto w-full">
        {/* Logo */}
        <div>
          <img 
            src={daoLogo} 
            alt="The DAO Logo" 
            className="size-[240px] md:size-60 drop-shadow-logo"
          />
        </div>
        
        {/* Headline */}
        <h1 className="text-3xl md:text-4.5xl lg:text-6xl font-normal text-white tracking-tight leading-none font-inter min-h-[60px] md:min-h-[84px] lg:min-h-[120px]">
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
            textColors={[redColor, greenColor, redColor, greenColor]}
          />
        </h1>

        {/* CTA Button */}
        <a
          href="https://giveth.typeform.com/to/XB4mTMou"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 h-12 inline-flex items-center justify-center"
        >
          Get Involved
        </a>
      </main>
    </section>
  )
}

export default HeroSection

