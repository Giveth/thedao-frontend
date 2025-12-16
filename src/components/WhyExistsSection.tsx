export default function WhyExistsSection() {
  return (
    <section className="w-full bg-[#1f435f]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
          {/* Heading */}
          <h2
            className="text-[#5cb75a] text-4xl md:text-5xl lg:text-6xl font-light whitespace-nowrap shrink-0"
            style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
          >
            Why this exists
          </h2>

          {/* Content */}
          <div
            className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-relaxed"
            style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
          >
            <p>
              In 2016, unclaimed DAO funds were earmarked to support Ethereum
              security.
            </p>
            <br />
            <p>Nearly a decade later, those funds remain untouched.</p>
            <br />
            <p>
              TheDAO Security Fund exists to responsibly activate this legacy to
              support the people who protect Ethereum every day.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 flex justify-center lg:justify-start lg:ml-auto lg:max-w-[calc(100%-280px)]">
          <button className="bg-dao-red hover:bg-dao-red-hover text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

