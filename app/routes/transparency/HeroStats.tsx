import { motion } from 'motion/react';
import CountUp from '~/components/text-animations/CountUp';
import { CO_FUNDER_USD_RAISED, projects } from './data';
import { formatEth, formatUsd } from './format';

function StatCard({
  label,
  children,
  sub,
  index,
}: {
  label: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-8 text-center hover:border-[#00ff88]/50 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-inter-tight">
          {label}
        </span>
        <span className="text-4xl md:text-5xl font-semibold font-inter-tight tracking-tight tabular-nums">
          {children}
        </span>
        {sub && <span className="text-sm text-white/60">{sub}</span>}
      </div>
    </motion.div>
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
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      <StatCard
        label="Sent to Ethereum security"
        index={0}
        sub={<>≈ {formatUsd(sentUsd)} when sent</>}
      >
        <span className="text-dao-green whitespace-nowrap">~{formatEth(sentEth, 0)}</span>
        <span className="text-white/60 text-3xl md:text-4xl"> ETH</span>
      </StatCard>

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
          <span className="text-white/60 text-3xl md:text-4xl">$</span>
          <CountUp to={CO_FUNDER_USD_RAISED} duration={1.5} separator="," />
        </span>
      </StatCard>
    </div>
  );
}
