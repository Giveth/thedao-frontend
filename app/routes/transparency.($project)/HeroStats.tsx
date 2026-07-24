import { CO_FUNDER_USD_RAISED, projects } from './data';
import { formatEth, formatUsd } from './format';

export default function HeroStats({
  sentEth,
  sentUsd,
}: {
  /** Total ETH sent to security (CSV totals + grants + live streamed). */
  sentEth: number;
  /** USD value of the above, frozen at the time each payment moved. */
  sentUsd: number;
}) {
  return (
    <div
      style={{ animationDelay: '0.2s' }}
      className="motion-safe:animate-fade-in-up group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-8 text-center hover:border-[#00ff88]/50 transition-all duration-300 mb-16"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />
      <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8">
        <span className="text-base md:text-xl uppercase tracking-[0.2em] text-white/60 font-inter-tight">
          Sent to Ethereum security
        </span>

        <span className="text-4xl md:text-8xl font-semibold tracking-tight leading-tight whitespace-nowrap">
          <span className="text-white tabular-nums">{formatEth(sentEth, 0)}</span>
          <span className="text-white"> ETH</span>
        </span>

        <p className="-mt-1 md:-mt-4 text-xl md:text-3xl font-normal leading-normal text-white">
          = {formatUsd(sentUsd)} at the time of sending · {projects.length} security projects
        </p>

        <p className="-mt-2 md:-mt-6 text-base md:text-xl">
          <span className="text-dao-green">{formatUsd(CO_FUNDER_USD_RAISED)}</span>
          <span className="text-white/60"> raised from co-funders &amp; donors</span>
        </p>
      </div>
    </div>
  );
}
