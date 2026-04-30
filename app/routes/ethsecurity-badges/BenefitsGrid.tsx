import { motion } from 'motion/react';

export type Benefit = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export default function BenefitsGrid({ benefits }: { benefits: Benefit[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {benefits.map((benefit, index) => (
        <BenefitCard key={benefit.id} benefit={benefit} index={index} />
      ))}
    </div>
  );
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#00ff88]/50 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00ff88]/0 to-[#00ff88]/0 group-hover:from-[#00ff88]/10 group-hover:to-[#00ff88]/5 transition-all duration-300" />

      <div className="relative z-10">
        <div className="mb-4 text-[#00ff88]">
          <img src={benefit.icon} alt="" className="w-20 h-20" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
        <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-[#00ff88]/20" />
    </motion.div>
  );
}
