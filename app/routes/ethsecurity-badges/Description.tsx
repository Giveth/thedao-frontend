import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export default function Description({ children }: { children: ReactNode }) {
  return (
    <motion.p
      className="text-center text-gray-300 text-lg max-w-3xl mx-auto mb-16 leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {children}
    </motion.p>
  );
}
