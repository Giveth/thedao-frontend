import React from "react";
import { CuratorsSection } from "./sections/CuratorsSection";
import { StatsSection } from "./sections/StatsSection";

export const TheDaoWireframe = (): JSX.Element => {
  return (
    <main className="bg-[#28567a] w-full relative flex flex-col">
      <img
        className="absolute top-0 left-0 w-full h-auto pointer-events-none"
        alt="Frame"
        src="/frame-76.svg"
      />

      <div className="flex flex-col w-full items-center gap-[104px] pt-56 relative z-10">
        <StatsSection />
        <CuratorsSection />
      </div>
    </main>
  );
};
