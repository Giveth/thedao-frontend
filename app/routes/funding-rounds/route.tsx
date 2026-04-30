import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Check, X, Copy } from 'lucide-react';
import Footer from '~/components/Footer';
import { generateMeta } from '~/utils/meta';

export function meta() {
  return generateMeta({
    title: "Funding Rounds",
    description:
      "TheDAO Security Fund Quadratic Funding rounds — supporting people and projects making Ethereum safer. The Ethereum Security round on Giveth has a 500 ETH matching pool, open April 23 – May 14, 2026.",
    url: "/funding-rounds",
  });
}

type Round = {
  id: number;
  status: 'Open Round' | 'Coming Soon';
  title: string;
  description: string;
  pool: string;
  deadline: string;
  image: string;
  /** Canonical URL to share for this round. Omit to hide the share button. */
  shareUrl?: string;
};

const rounds: Round[] = [
  {
    id: 1,
    status: 'Open Round',
    title: 'Ethereum Security',
    description:
      'A quadratic funding round on Giveth with a 500 ETH matching pool scoped broadly to support any project providing a public benefit to Ethereum security.',
    pool: '500 ETH',
    deadline: 'April 23 – May 14, 2026',
    image: '/funding-rounds/ethsecurity-round.webp',
    shareUrl: 'https://qf.giveth.io/qf/ethereum-security',
  },
  {
    id: 2,
    status: 'Coming Soon',
    title: 'TBD - Coming late summer',
    description: '',
    pool: 'TBC',
    deadline: 'TBA',
    image: '/funding-rounds/coming-soon.webp',
  },
];

export default function FundingRounds() {
  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden pt-32 pb-[120px]"
        style={{ backgroundImage: 'linear-gradient(142.716deg, rgb(44, 94, 134) 31.459%, rgb(31, 67, 95) 90.396%)' }}
      >
        <FloatingSquares />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">Funding Rounds</h1>
            <p className="text-xl mb-4 text-dao-green">
              Our funding rounds support the people and projects making Ethereum safer.
            </p>
            <motion.div
              className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </motion.div>

          {/* Rounds List */}
          <div className="flex flex-col gap-8">
            {rounds.map((round, index) => (
              <RoundCard key={round.id} round={round} reversed={false} index={index} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function RoundCard({
  round,
  reversed,
  index,
}: {
  round: Round;
  reversed: boolean;
  index: number;
}) {
  const [copied, setCopied] = React.useState(false);
  const [showSharePopup, setShowSharePopup] = React.useState(false);
  const isOpen = round.status === 'Open Round';

  const shareUrl = round.shareUrl ?? '';

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore — user can still copy from the input field manually.
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSharePopup(true);
  };

  const socialLinks = [
    {
      name: 'X / Twitter',
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out the ${round.title} funding round on TheDAO Security Fund!`)}`,
    },
    {
      name: 'Telegram',
      color: '#26A5E4',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out the ${round.title} funding round!`)}`,
    },
    {
      name: 'LinkedIn',
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Farcaster',
      color: '#8465CB',
      url: `https://warpcast.com/~/compose?text=${encodeURIComponent(`Check out the ${round.title} funding round on TheDAO Security Fund! ${shareUrl}`)}`,
    },
  ];

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

      {/* Share button */}
      {round.shareUrl && (
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white/60 hover:text-[#00ff88] hover:border-[#00ff88]/50 transition-all duration-300 cursor-pointer"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}

      {/* Share Popup */}
      <AnimatePresence>
        {showSharePopup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSharePopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative w-[420px] max-w-[90vw] bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl"
              style={{ backgroundImage: 'linear-gradient(160deg, rgba(44, 94, 134, 0.8) 0%, rgba(31, 67, 95, 0.95) 100%)' }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setShowSharePopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-[20px] text-white mb-1 font-inter-tight">Share this round</h4>
              <p className="text-[14px] text-white/50 mb-5 font-inter-tight">
                Spread the word about <span className="text-dao-green">{round.title}</span>
              </p>

              {/* Copy link */}
              <div className="flex items-center gap-2 mb-5 bg-white/5 border border-white/10 rounded-xl p-3">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-white/80 text-[13px] outline-none truncate font-inter-tight"
                />
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dao-green/20 text-dao-green text-[13px] hover:bg-dao-green/30 transition-all duration-200 cursor-pointer font-inter-tight"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[14px] hover:bg-white/10 hover:border-white/20 transition-all duration-200 font-inter-tight"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: social.color }}
                    />
                    {social.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

function FloatingSquares() {
  const squares = Array.from({ length: 12 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {squares.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 border border-white/5 rounded-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute w-32 h-32 rounded-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}
