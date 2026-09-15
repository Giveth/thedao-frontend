import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2 } from 'lucide-react';
import ShareDialog from '~/components/ShareDialog';
import { getRoundDeadline, getRoundStatus, type Round, type RoundStatus } from './data';

const STATUS_STYLES: Record<RoundStatus, { dot: string; text: string; bg: string }> = {
  'Open Round': { dot: '#5CB75A', text: '#5CB75A', bg: 'rgba(92,183,90,0.15)' },
  Closed: { dot: '#FF3B38', text: '#FF9B99', bg: 'rgba(255,59,56,0.28)' },
  'Coming Soon': { dot: '#FFB432', text: '#FFB432', bg: 'rgba(255,180,50,0.15)' },
};

export default function RoundCard({
  round,
  reversed,
  index,
}: {
  round: Round;
  reversed: boolean;
  index: number;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const status = getRoundStatus(round);
  const deadline = getRoundDeadline(round);
  const isOpen = status === 'Open Round';
  const isComingSoon = status === 'Coming Soon';
  const isClosed = status === 'Closed';
  const statusStyle = STATUS_STYLES[status];

  return (
    <div
      style={{ animationDelay: `${800 + index * 300}ms` }}
      className={`group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#00ff88]/50 transition-all duration-300 flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 animate-in fade-in duration-1000 fill-mode-backwards`}
    >
      {/* Card glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-[#00ff88]/20" />

      {round.shareUrl && (
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          url={round.shareUrl}
          title="Share this round"
          subtitle={
            <>
              Spread the word about <span className="text-dao-green">{round.title}</span>
            </>
          }
          shareMessage={`Check out the ${round.title} funding round on TheDAO Security Fund!`}
        />
      )}

      {/* Image */}
      <div className="relative z-10 md:w-[45%] shrink-0">
        <div className="aspect-video overflow-hidden flex items-center justify-center">
          <img
            src={round.image}
            alt={round.title}
            width={1280}
            height={730}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center flex-1">
        {/* Status pill + share */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-sm"
            style={{ background: statusStyle.bg, color: statusStyle.text }}
          >
            {isClosed ? (
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: statusStyle.dot }}
              />
            ) : (
              <motion.span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: statusStyle.dot }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {status}
          </span>
          {round.shareUrl && (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="shrink-0 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white/60 hover:text-[#00ff88] hover:border-[#00ff88]/50 transition-all duration-300 cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <h3 className="text-2xl text-white mb-3">
          {isComingSoon ? 'Stay tuned for upcoming rounds' : round.title}
        </h3>

        {!isComingSoon ? (
          <>
            <p className="leading-relaxed mb-4 text-white">{round.description}</p>

            {/* Meta */}
            {(round.pool || round.startDate) && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm mb-6">
                {round.pool && (
                  <span className="text-white">
                    Matching Pool: <span className="text-gray-300">{round.pool}</span>
                  </span>
                )}
                {round.startDate && (
                  <span className="text-white">
                    Round duration and dates: <span className="text-gray-300">{deadline}</span>
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            {isOpen && (round.cta || round.secondaryCta) && (
              <div className="flex flex-wrap gap-3">
                {round.cta && (
                  <motion.a
                    href={round.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block w-fit bg-dao-red hover:bg-dao-red-hover text-white text-sm px-5 py-2 rounded-lg shadow-lg shadow-red-900/50 transition-all duration-300"
                  >
                    {round.cta.label}
                  </motion.a>
                )}
                {round.secondaryCta && (
                  <motion.a
                    href={round.secondaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block w-fit bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 hover:text-[#00ff88] hover:border-[#00ff88]/50 text-sm px-5 py-2 rounded-lg transition-all duration-300"
                  >
                    {round.secondaryCta.label}
                  </motion.a>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="leading-relaxed mb-6 text-white">
              More funding opportunities are coming soon.{' '}
              <a
                href="https://x.com/thedaofund"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dao-green hover:text-[#00ff88] underline transition-colors duration-200"
              >
                Follow our updates
              </a>{' '}
              and be the first to know when new rounds open.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://giveth.typeform.com/TheDAO-RO-App1"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block w-fit bg-dao-red hover:bg-dao-red-hover text-white px-8 py-3 rounded-xl shadow-lg shadow-red-900/50 transition-all duration-300"
              >
                Apply to host
              </motion.a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
