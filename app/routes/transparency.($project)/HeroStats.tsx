import CountUp from '~/components/text-animations/CountUp';
import { CO_FUNDER_USD_RAISED, projects } from './data';
import { formatEth, formatUsd } from './format';

function StatCard({
  label,
  children,
  sub,
  index,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <div
      style={{ animationDelay: `${0.2 + index * 0.15}s` }}
      className={`motion-safe:animate-fade-in-up group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-8 text-center hover:border-[#00ff88]/50 transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="text-sm md:text-base uppercase tracking-[0.2em] text-white/60 font-inter-tight">
          {label}
        </span>
        <span className="text-4xl md:text-5xl font-bold font-inter-tight tracking-tight tabular-nums">
          {children}
        </span>
        {sub && <span className="text-sm text-white/60">{sub}</span>}
      </div>
    </div>
  );
}

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
    <div className="grid md:grid-cols-2 gap-6 mb-16">
      <div
        style={{ animationDelay: '0.2s' }}
        className="motion-safe:animate-fade-in-up group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-8 text-center hover:border-[#00ff88]/50 transition-all duration-300 md:col-span-2"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />
        <div className="relative z-10 flex flex-col items-center gap-4 md:gap-8">
          <span className="text-base md:text-xl uppercase tracking-[0.2em] text-white/60 font-inter-tight">
            Sent to Ethereum security
          </span>

          {/* ETH Amount with Icon */}
          <div className="flex flex-row items-center justify-center gap-4 md:gap-8">
            <img
              src="/eth-logo.svg"
              alt="ETH"
              className="w-[38px] h-15 md:w-[76px] md:h-[121px]"
            />
            <span className="text-4xl md:text-8xl font-semibold tracking-tight leading-tight whitespace-nowrap">
              <span className="text-white tabular-nums">~{formatEth(sentEth, 0)}</span>
              <span className="text-white"> ETH</span>
            </span>
          </div>

          {/* USD Value */}
          <p className="-mt-1 md:-mt-4 text-xl md:text-4xl font-normal leading-normal text-center">
            <span className="text-white">≈ {formatUsd(sentUsd)} when sent</span>
          </p>

        </div>
      </div>

      <StatCard
        label="Security projects funded"
        index={1}
        sub="during one Ethereum Security round"
      >
        <span className="text-dao-green">
          <CountUp to={projects.length} duration={1.5} />
        </span>
      </StatCard>

      <StatCard
        label="Alongside the matching pool"
        index={2}
        sub="from co-funders and individual donors"
      >
        <span className="text-dao-green">
          <span className="text-3xl md:text-4xl">$</span>
          <CountUp to={CO_FUNDER_USD_RAISED} duration={1.5} separator="," />
        </span>
      </StatCard>
    </div>
  );
}
