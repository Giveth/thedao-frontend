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
  {
    image: "/pcaversaccio.png",
    name: "pcaversaccio",
    organization: "SEAL 911",
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
    image: "/pol-lanski.png",
    name: "Pol Lanski",
    organization: "Dappnode",
  },
]

export default function CuratorsSection() {
  return (
    <section className="w-full px-4 py-16 md:py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[url('/curators-background.svg')] bg-top md:bg-no-repeat bg-size-[200%_auto] md:bg-cover"
      />
      
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-16 relative z-10">
        {/* Section Title */}
        <h2 className="text-white text-[30px] md:text-[60px] font-light text-center leading-[1.15]">
          TheDAO Curators
        </h2>

        {/* Curators Grid */}
        <div className="flex flex-col items-center gap-16 w-full">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full">
            {curatorsRow1.map((curator, index) => (
              <CuratorCard key={index} {...curator} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full">
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
    <div className="flex flex-col items-center gap-4 w-[245px] group">
      <div className="relative overflow-hidden rounded-full">
        <img
          className="w-[245px] h-[245px] object-cover transition-transform duration-300 group-hover:scale-105"
          alt={name}
          src={image}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col items-center gap-2 w-full text-center">
        <h3 className="text-white text-[24px] font-bold leading-[1.33]">
          {name}
        </h3>
        <p className="text-white text-[24px] font-normal leading-none">
          {organization}
        </p>
      </div>
    </div>
  )
}

