export default function WhyExistsSection() {
  return (
    <section className="w-full bg-dao-blue-dark">
      <div className="max-w-10xl mx-auto px-8 md:px-24 lg:px-44 pt-26 pb-42">
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8 xl:gap-[75px]">
          {/* Heading */}
          <h2
            className="text-dao-green text-4xl md:text-5xl lg:text-[60px] font-light leading-[1.15] max-w-[479px] shrink-0"
          >
            TheDAO's story continues
          </h2>

          {/* Content + Button Column */}
          <div className="flex flex-col gap-10">
            {/* Content */}
            <div
              className="text-white text-xl md:text-2xl lg:text-4xl font-light leading-normal max-w-[863px] space-y-6"
            >
              <p>
                In 2016, TheDAO Curators rescued hacked funds with the expectation that any unclaimed assets would be used to support Ethereum security.
              </p>
              <p>
                Nearly a decade later, the remaining funds have sat idle and significantly appreciated.
              </p>
              <p>
                TheDAO Security Fund exists to responsibly steward assets that support people and projects securing Ethereum.
              </p>
            </div>

            {/* CTA Button */}
            <button className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2 h-10 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 w-fit">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

