import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2 } from 'lucide-react';
import ShareDialog from '~/components/ShareDialog';
import type { Round } from './data';

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
  const isOpen = round.status === 'Open Round';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 * index }}
      className={`group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#00ff88]/50 transition-all duration-300 flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6`}
    >
      {/* Card glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-[#00ff88]/20" />

      {/* Share */}
      {round.shareUrl && (
        <>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white/60 hover:text-[#00ff88] hover:border-[#00ff88]/50 transition-all duration-300 cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
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
        </>
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
        {/* Status pill */}
        <span
          className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-sm mb-4"
          style={{
            background: round.status === 'Open Round' ? 'rgba(92,183,90,0.15)' : 'rgba(255,180,50,0.15)',
            color: round.status === 'Open Round' ? '#5CB75A' : '#FFB432',
          }}
        >
          <motion.span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: round.status === 'Open Round' ? '#5CB75A' : '#FFB432' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {round.status}
        </span>

        <h3 className="text-2xl text-white mb-3">
          {isOpen ? round.title : 'Stay tuned for upcoming rounds'}
        </h3>

        {isOpen ? (
          <>
            <p className="leading-relaxed mb-4 text-white">{round.description}</p>

            {/* Meta */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm mb-6">
              <span className="text-white">
                Matching Pool: <span className="text-gray-300">{round.pool}</span>
              </span>
              <span className="text-white">
                Round duration and dates: <span className="text-gray-300">{round.deadline}</span>
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://qf.giveth.io/qf/ethereum-security"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block w-fit bg-dao-red hover:bg-dao-red-hover text-white px-8 py-3 rounded-xl shadow-lg shadow-red-900/50 transition-all duration-300"
              >
                Donate
              </motion.a>
              <motion.a
                href="https://qf.giveth.io/qf/apply?apcid=0063975a838645fd68131600"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block w-fit bg-dao-red hover:bg-dao-red-hover text-white px-8 py-3 rounded-xl shadow-lg shadow-red-900/50 transition-all duration-300"
              >
                Apply Now
              </motion.a>
            </div>
          </>
        ) : (
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
        )}
      </div>
    </motion.div>
  );
}
