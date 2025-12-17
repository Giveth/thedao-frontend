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
              TheDAO's story continues
            </h2>

            {/* Text content */}
            <div className="text-white text-xl md:text-2xl lg:text-4xl font-light leading-[1.11] space-y-6">
              <p>
                In 2016, TheDAO hard fork rescued DAO holders and TheDAO Curators addressed the edge cases, stipulating that unclaimed funds would support Ethereum security.
              </p>
              <p>
                While over 80% was claimed, the remaining ETH has sat idle for over 9 years and has appreciated significantly.
              </p>
              <p>
                TheDAO Security Fund will responsibly steward these funds to support Ethereum security and improve the DAO tooling ecosystem.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 h-12 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 w-fit">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

