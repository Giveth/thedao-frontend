import { motion } from 'motion/react';

export default function InfluenceSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <motion.div
        className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent mb-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      />

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-[20px]">{description}</p>
      </motion.div>
    </>
  );
}
