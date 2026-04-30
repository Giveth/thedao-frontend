import { motion } from 'motion/react';

export default function CtaSection({ href, label }: { href: string; label: string }) {
  return (
    <motion.div
      className="text-center mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block bg-dao-red hover:bg-dao-red-hover text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-red-900/50 transition-all duration-300"
      >
        {label}
      </motion.a>
    </motion.div>
  );
}
