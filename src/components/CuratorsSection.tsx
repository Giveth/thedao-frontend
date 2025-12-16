const curatorsRow1 = [
  {
    image: "/vitalik-buterin.png",
    name: "Vitalik Buterin",
    organization: "Ethereum Foundation",
  },
  {
    image: "/taylor-monahan.png",
    name: "Taylor Monahan",
    organization: "Metamask",
  },
  {
    image: "/jordi-baylina.png",
    name: "Jordi Baylina",
    organization: "ZisK",
  },
]

const curatorsRow2 = [
  {
    image: "/alex-van-de-sande.png",
    name: "Alex Van de Sande",
    organization: "ENS",
  },
  {
    image: "/griff-green.png",
    name: "Griff Green",
    organization: "Giveth",
  },
  {
    image: "/pcaversaccio.png",
    name: "pcaversaccio",
    organization: "SEAL 911",
  },
]

export default function CuratorsSection() {
  return (
    <section className="w-full px-4 py-16 md:py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url('/curators-background.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      />
      
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12 relative z-10">
        {/* Section Title */}
        <h2
          className="text-white text-4xl md:text-5xl lg:text-6xl font-light text-center"
          style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
        >
          TheDAO Curators
        </h2>

        {/* Curators Grid */}
        <div className="flex flex-col items-center gap-10 md:gap-16 w-full">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12 lg:gap-16 w-full">
            {curatorsRow1.map((curator, index) => (
              <CuratorCard key={index} {...curator} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12 lg:gap-16 w-full">
            {curatorsRow2.map((curator, index) => (
              <CuratorCard key={index} {...curator} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CuratorCard({
  image,
  name,
  organization,
}: {
  image: string
  name: string
  organization: string
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-[200px] md:w-[220px] lg:w-[245px] group">
      <div className="relative overflow-hidden rounded-full">
        <img
          className="w-[200px] h-[200px] md:w-[220px] md:h-[220px] lg:w-[245px] lg:h-[245px] object-cover transition-transform duration-300 group-hover:scale-105"
          alt={name}
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col items-center gap-1 w-full text-center">
        <h3
          className="text-white text-xl md:text-2xl font-bold"
          style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
        >
          {name}
        </h3>
        <p
          className="text-white/80 text-base md:text-lg font-normal"
          style={{ fontFamily: "'Inter Tight', Inter, sans-serif" }}
        >
          {organization}
        </p>
      </div>
    </div>
  )
}

