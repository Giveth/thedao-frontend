import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, X } from 'lucide-react';
import { getStreamUrl, SEAL_ONCHAIN } from './data';
import { formatEth, formatUsd } from './format';
import type { RankedProject } from './ProjectsTable';

function RoundTag() {
  return (
    <span className="ml-2 align-middle inline-block px-1.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-white/10 text-white/50 whitespace-nowrap">
      Round 1
    </span>
  );
}

function BreakdownRow({
  label,
  detail,
  valueDetail,
  children,
}: {
  label: React.ReactNode;
  detail?: React.ReactNode;
  valueDetail?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-white/10 last:border-b-0">
      <div className="min-w-0">
        <span className="text-[14px] text-white/80 font-inter-tight">{label}</span>
        {detail && <div className="text-[12px] text-white/40 mt-0.5">{detail}</div>}
      </div>
      <span className="shrink-0 max-w-[45%] text-right">
        <span className="block text-[14px] text-white tabular-nums whitespace-nowrap">
          {children}
        </span>
        {valueDetail && (
          <span className="block text-[12px] text-white/40 mt-0.5">{valueDetail}</span>
        )}
      </span>
    </div>
  );
}

export default function ProjectModal({
  project,
  streamedEth,
  onClose,
}: {
  project: RankedProject | null;
  /** ETH streamed so far to this project (live-ticking), 0 if no stream. */
  streamedEth: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  const onchain = project ? SEAL_ONCHAIN[project.name] : undefined;
  const streamRate = onchain
    ? Number(onchain.streamFallback.flowRate * 86400n) / 1e18
    : 0;

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative w-[460px] max-w-[92vw] max-h-[85vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl"
            style={{
              backgroundImage:
                'linear-gradient(160deg, rgba(44, 94, 134, 0.8) 0%, rgba(31, 67, 95, 0.95) 100%)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-[20px] text-white mb-1 font-inter-tight pr-8">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00ff88] transition-colors duration-200"
                >
                  {project.name}{' '}
                  <ExternalLink className="w-4 h-4 inline-block align-[center]" />
                </a>
              ) : (
                project.name
              )}
            </h4>
            <p className="text-[14px] text-white/50 mb-5 font-inter-tight">Full breakdown</p>

            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 mb-5">
              {project.matchingPool > 0 && (
                <BreakdownRow
                  label={
                    <>
                      Matching pool
                      <RoundTag />
                    </>
                  }
                >
                  {formatEth(project.matchingPool)} ETH
                </BreakdownRow>
              )}
              {project.extraRoundInflow > 0 && (
                <BreakdownRow
                  label={
                    <>
                      Extra round inflow
                      <RoundTag />
                    </>
                  }
                >
                  {formatEth(project.extraRoundInflow)} ETH
                </BreakdownRow>
              )}
              {project.otherDonors > 0 && (
                <BreakdownRow
                  label={
                    <>
                      Other donations
                      <RoundTag />
                    </>
                  }
                  valueDetail={`≈ ${formatUsd(project.otherDonorsUsd)} at donation time`}
                >
                  {formatEth(project.otherDonors)} ETH
                </BreakdownRow>
              )}
              {onchain &&
                onchain.grants.map((grant) => (
                  <BreakdownRow
                    key={grant.txHash}
                    label={
                      <a
                        href={`https://etherscan.io/tx/${grant.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#00ff88] transition-colors duration-200"
                      >
                        Direct grant
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    }
                    detail="One-off transfer from the operational multisig"
                  >
                    {formatEth(grant.amountEth)} ETH
                  </BreakdownRow>
                ))}
              {onchain && (
                <BreakdownRow
                  label={
                    <a
                      href={getStreamUrl(project.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/80 hover:text-[#00ff88] transition-colors duration-200"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full inline-block bg-dao-green"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      Streaming via Superfluid
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  }
                  detail={`≈ ${streamRate.toFixed(3)} ETH per day, ongoing`}
                >
                  <span className="text-dao-green">{formatEth(streamedEth, 6)} ETH</span>
                </BreakdownRow>
              )}
            </div>

            <div className="flex items-baseline justify-between gap-4 px-4">
              <span className="text-[14px] text-white/80 font-inter-tight font-bold uppercase">
                Total
              </span>
              <span className="text-right">
                <span className="block text-[18px] font-semibold text-dao-green tabular-nums font-inter-tight">
                  {formatEth(project.displayTotalEth)} ETH
                </span>
                <span className="block text-[12px] text-white/50 tabular-nums">
                  ≈ {formatUsd(project.displayUsdSent)} when sent
                </span>
              </span>
            </div>

            {onchain && (
              <p className="mt-4 px-4 text-[12px] text-white/40">
                On-chain amounts update in real time from Ethereum mainnet.
              </p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
