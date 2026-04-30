import { motion } from 'motion/react';

export type HeaderCta = { href: string; label: string };

export default function Header({
  title,
  subtitle,
  video,
  cta,
}: {
  title: string;
  subtitle: string;
  video?: string;
  cta?: HeaderCta;
}) {
  return (
    <>
      {video && (
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              src={video}
              className="max-w-md w-full rounded-full"
            />
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: video ? 0.2 : 0 }}
      >
        <h1 className="text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">{title}</h1>
        <p className={`text-xl text-dao-green ${cta ? 'mb-8' : 'mb-4'}`}>{subtitle}</p>

        {cta && (
          <motion.a
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-dao-red hover:bg-dao-red-hover text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-red-900/50 transition-all duration-300 mb-8"
          >
            {cta.label}
          </motion.a>
        )}

        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </motion.div>
    </>
  );
}
