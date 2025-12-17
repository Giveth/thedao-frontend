export default function WhyExistsSection() {
  return (
    <section className="w-full bg-dao-blue-dark">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-start gap-10">
          {/* Heading */}
          <h2
            className="text-dao-green text-4xl md:text-5xl lg:text-6xl font-light"
          >
            TheDAO's story continues
          </h2>

          {/* Content */}
          <div
            className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-relaxed"
          >
            <p>
              In 2016, TheDAO hard fork rescued DAO holders and TheDAO Curators addressed the edge cases, stipulating that unclaimed funds would support Ethereum security.
            </p>
            <br />
            <p>While over 80% was claimed, the remaining ETH has sat idle for over 9 years and has appreciated significantly.</p>
            <br />
            <p>
              TheDAO Security Fund will responsibly steward these funds to support Ethereum security and improve the DAO tooling ecosystem.
            </p>
          </div>

          {/* CTA Button */}
          <button className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

