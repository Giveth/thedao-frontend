import React from "react";
import { Button } from "../../../../components/ui/button";

export const CuratorsSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center gap-[72px] w-full">
      <div className="flex flex-col items-start gap-2 px-44 py-[168px] w-full bg-[#1f435f]">
        <div className="w-full max-w-[1375px] mx-auto gap-10 flex flex-col items-center">
          <div className="flex items-center gap-[120px] w-full">
            <h2 className="[font-family:'Inter_Tight',Helvetica] font-light text-[#5cb75a] text-6xl tracking-[0] leading-[69px] whitespace-nowrap">
              Why this exists
            </h2>

            <p className="flex-1 font-text-4xl-leading-normal-light font-[number:var(--text-4xl-leading-normal-light-font-weight)] text-white text-[length:var(--text-4xl-leading-normal-light-font-size)] tracking-[var(--text-4xl-leading-normal-light-letter-spacing)] leading-[var(--text-4xl-leading-normal-light-line-height)] [font-style:var(--text-4xl-leading-normal-light-font-style)]">
              In 2016, unclaimed DAO funds were earmarked to support Ethereum
              security.
              <br />
              <br />
              Nearly a decade later, those funds remain untouched.
              <br />
              <br />
              TheDAO Security Fund exists to responsibly activate this legacy to
              support the people who protect Ethereum every day.
            </p>
          </div>

          <Button className="h-10 px-6 py-2 bg-[#ff3b38] hover:bg-[#ff3b38]/90 rounded-lg font-text-sm-leading-normal-medium font-[number:var(--text-sm-leading-normal-medium-font-weight)] text-neutral-50 text-[length:var(--text-sm-leading-normal-medium-font-size)] tracking-[var(--text-sm-leading-normal-medium-letter-spacing)] leading-[var(--text-sm-leading-normal-medium-line-height)] [font-style:var(--text-sm-leading-normal-medium-font-style)]">
            Learn More
          </Button>
        </div>
      </div>

      <footer className="flex items-center justify-center w-full font-text-base-leading-normal-normal font-[number:var(--text-base-leading-normal-normal-font-weight)] text-white text-[length:var(--text-base-leading-normal-normal-font-size)] text-center tracking-[var(--text-base-leading-normal-normal-letter-spacing)] leading-[var(--text-base-leading-normal-normal-line-height)] [font-style:var(--text-base-leading-normal-normal-font-style)]">
        © 2025 THEDAO. All rights reserved.
      </footer>
    </section>
  );
};
