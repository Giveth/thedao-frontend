import FadeContent from '../text-animations/FadeContent';

export default function WhyExistsSection() {
  return (
    <section className="w-full bg-dao-blue-dark">
      <div className="max-w-10xl mx-auto px-8 md:px-24 lg:px-44 pt-26 pb-42 flex flex-col items-center">
        {/* Main content container - 980px */}
        <div className="flex flex-col gap-12 w-full max-w-[980px]">
          {/* Title + Text container - 969px */}
          <div className="flex flex-col gap-7 max-w-[969px]">
            {/* Heading */}
            <h2 className="text-dao-green text-4xl md:text-5xl lg:text-[60px] font-light leading-[1.15]">
              TheDAO's story continues…
            </h2>

            {/* Text content */}
            <div className="text-white text-xl md:text-2xl lg:text-4xl font-light leading-[1.11] space-y-6 sm:w-[410px] md:w-[490px] lg:w-[740px]">
              <FadeContent blur duration={400}>
                <p>
                  In 2016, funds recovered from TheDAO hack{' '}
                  were made claimable by TheDAO Curators{' '}
                  with the intention that any unclaimed assets {' '}
                  would be used to support Ethereum security.
                </p>
              </FadeContent>
              <FadeContent blur duration={400} delay={200}>
                <p>
                  A decade later, the unclaimed ETH{' '}
                  has sat idle and significantly appreciated.
                </p>
              </FadeContent>
              <FadeContent blur duration={400} delay={400}>
                <p>
                  TheDAO Security Fund enables the community{' '}
                  to reallocate these funds toward the projects{' '}
                  and people that strengthen Ethereum security.
                </p>
              </FadeContent>
            </div>
          </div>

          {/* CTA Button */}
          <FadeContent blur duration={400} delay={600}>
            <a href="https://paragraph.com/@thedao.fund/thedao-security-fund-activating-75000-eth-for-ethereum-security" target="_blank" rel="noopener noreferrer" className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 h-12 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 w-fit inline-flex items-center">
              Learn More
            </a>
          </FadeContent>
        </div>
      </div>
    </section>
  )
}

