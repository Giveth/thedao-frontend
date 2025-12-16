import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const curatorsRow1 = [
  {
    image: "/mask-group.png",
    name: "Vitalik Buterin",
    organization: "Ethereum Foundation",
  },
  {
    image: "/mask-group-1.png",
    name: "Taylor Monahan",
    organization: "Metamask",
  },
  {
    image: "/mask-group-2.png",
    name: "Jordi Baylina",
    organization: "ZisK",
  },
];

const curatorsRow2 = [
  {
    image: "/mask-group-3.png",
    name: "Alex Van de Sande",
    organization: "ENS",
  },
  {
    image: "/mask-group-4.png",
    name: "Griff Green",
    organization: "Giveth",
  },
  {
    image: "/mask-group-5.png",
    name: "pcaversaccio",
    organization: "SEAL 911",
  },
];

export const StatsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center gap-[104px] w-full max-w-[1621px] mx-auto">
      <div className="flex flex-col items-center gap-[264px] w-full">
        <div className="flex flex-col items-center gap-10 w-full max-w-[631px]">
          <div className="flex flex-col items-center gap-24 w-full">
            <img className="w-[264px] h-[264px]" alt="Logo" src="/logo.png" />

            <h1 className="[font-family:'Arial-Regular',Helvetica] font-normal text-7xl tracking-[0] leading-[72px] whitespace-nowrap">
              <span className="text-white leading-[0.1px]">THE DAO IS </span>
              <span className="text-[#5cb75a]">BACK</span>
            </h1>
          </div>

          <Button className="h-10 px-6 py-2 bg-[#ff3b38] hover:bg-[#ff3b38]/90 rounded-lg">
            <span className="font-text-sm-leading-normal-medium font-[number:var(--text-sm-leading-normal-medium-font-weight)] text-neutral-50 text-[length:var(--text-sm-leading-normal-medium-font-size)] tracking-[var(--text-sm-leading-normal-medium-letter-spacing)] leading-[var(--text-sm-leading-normal-medium-line-height)] [font-style:var(--text-sm-leading-normal-medium-font-style)]">
              Get Involved
            </span>
          </Button>
        </div>

        <Card className="w-full max-w-[1621px] bg-[#2c5e86] rounded-[32px] shadow-shadow-md border-0">
          <CardContent className="flex flex-col items-center gap-8 py-[204.5px] px-4">
            <div className="flex items-start justify-center gap-8 w-full max-w-[786px]">
              <img
                className="w-[76px] h-[121px]"
                alt="Layer"
                src="/layer-1.svg"
              />

              <h2 className="[font-family:'Inter_Tight',Helvetica] font-normal text-8xl text-center tracking-[0] leading-[96px]">
                <span className="font-semibold text-[#5cb75a] leading-[128px]">
                  75,224
                </span>
                <span className="font-semibold text-white leading-[128px]">
                  {" "}
                  ETH
                </span>
              </h2>
            </div>

            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-7xl text-center tracking-[0] leading-[72px]">
              <span className="text-[#5cb75a]"> $238.2</span>
              <span className="text-white">&nbsp;</span>
              <span className="text-white">Million</span>
            </p>

            <div className="flex flex-col items-center gap-8 w-full max-w-[836px]">
              <p className="font-text-2xl-leading-none-normal font-[number:var(--text-2xl-leading-none-normal-font-weight)] text-white text-[length:var(--text-2xl-leading-none-normal-font-size)] text-center tracking-[var(--text-2xl-leading-none-normal-letter-spacing)] leading-[var(--text-2xl-leading-none-normal-line-height)] [font-style:var(--text-2xl-leading-none-normal-font-style)]">
                For Ethereum Security.
              </p>
            </div>

            <Button className="h-10 px-6 py-2 bg-[#ff3b38] hover:bg-[#ff3b38]/90 rounded-lg">
              <span className="font-text-sm-leading-normal-medium font-[number:var(--text-sm-leading-normal-medium-font-weight)] text-neutral-50 text-[length:var(--text-sm-leading-normal-medium-font-size)] tracking-[var(--text-sm-leading-normal-medium-letter-spacing)] leading-[var(--text-sm-leading-normal-medium-line-height)] [font-style:var(--text-sm-leading-normal-medium-font-style)]">
                Learn More
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-16 w-full max-w-[1172px]">
        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-[750px]">
          <h2 className="[font-family:'Inter_Tight',Helvetica] font-light text-white text-6xl text-center tracking-[0] leading-[69px]">
            TheDAO Curators
          </h2>
        </div>

        <div className="flex flex-col items-center gap-16 w-full">
          <div className="flex items-center justify-center gap-16 w-full">
            {curatorsRow1.map((curator, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-4 w-[245px]"
              >
                <img
                  className="w-[245px] h-[245px]"
                  alt="Mask group"
                  src={curator.image}
                />

                <div className="flex flex-col items-center justify-center gap-2 w-full">
                  <h3 className="w-full font-text-2xl-leading-normal-bold font-[number:var(--text-2xl-leading-normal-bold-font-weight)] text-white text-[length:var(--text-2xl-leading-normal-bold-font-size)] text-center tracking-[var(--text-2xl-leading-normal-bold-letter-spacing)] leading-[var(--text-2xl-leading-normal-bold-line-height)] [font-style:var(--text-2xl-leading-normal-bold-font-style)]">
                    {curator.name}
                  </h3>

                  <p className="w-full font-text-2xl-leading-none-normal font-[number:var(--text-2xl-leading-none-normal-font-weight)] text-white text-[length:var(--text-2xl-leading-none-normal-font-size)] text-center tracking-[var(--text-2xl-leading-none-normal-letter-spacing)] leading-[var(--text-2xl-leading-none-normal-line-height)] [font-style:var(--text-2xl-leading-none-normal-font-style)]">
                    {curator.organization}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-16">
            {curatorsRow2.map((curator, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-4 w-[245px]"
              >
                <img
                  className="w-[245px] h-[245px]"
                  alt="Mask group"
                  src={curator.image}
                />

                <div className="flex flex-col items-start gap-2 w-full">
                  <h3 className="w-full font-text-2xl-leading-normal-bold font-[number:var(--text-2xl-leading-normal-bold-font-weight)] text-white text-[length:var(--text-2xl-leading-normal-bold-font-size)] text-center tracking-[var(--text-2xl-leading-normal-bold-letter-spacing)] leading-[var(--text-2xl-leading-normal-bold-line-height)] [font-style:var(--text-2xl-leading-normal-bold-font-style)]">
                    {curator.name}
                  </h3>

                  <p className="w-full font-text-2xl-leading-none-normal font-[number:var(--text-2xl-leading-none-normal-font-weight)] text-white text-[length:var(--text-2xl-leading-none-normal-font-size)] text-center tracking-[var(--text-2xl-leading-none-normal-letter-spacing)] leading-[var(--text-2xl-leading-none-normal-line-height)] [font-style:var(--text-2xl-leading-none-normal-font-style)]">
                    {curator.organization}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
