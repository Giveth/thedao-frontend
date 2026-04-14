import { motion } from 'motion/react';
import Footer from '~/components/Footer';
import { generateMeta } from '~/utils/meta';

export function meta() {
  return generateMeta({
    title: "ETHSecurity Badge",
    description: "The ETHSecurity Badge recognizes leading researchers helping secure the Ethereum ecosystem. Badge holders gain visibility and direct influence over security funding.",
    url: "/ethsecurity-badges",
  });
}

export default function EthSecurityBadge() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-[120px]"
      style={{ backgroundImage: "linear-gradient(142.716deg, rgb(44, 94, 134) 31.459%, rgb(31, 67, 95) 90.396%)" }}>
      <FloatingSquares />
      
      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        {/* GIF */}
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
              src="/eth-security-badge.mp4"
              className="max-w-md w-full rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">ETHSecurity Badge</h1>
          <p className="text-xl mb-8 text-dao-green">For the top Ethereum Security Experts</p>
          
          <motion.a
            href="https://t.me/ETHSecurityBadges_bot"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-dao-red hover:bg-dao-red-hover text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-red-900/50 transition-all duration-300 mb-8"
          >Apply</motion.a>

          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-center text-gray-300 text-lg max-w-3xl mx-auto mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >The ETHSecurity Badge recognizes leading researchers helping secure the Ethereum ecosystem. Badge holders gain visibility in the community and direct influence over which security initiatives receive funding.</motion.p>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <BenefitCard
            icon={<img src="/icon-badge-1.svg" alt="" className="w-20 h-20" />}
            title="Trusted Reputation"
            description="Badge holder's address will be instantly trusted in incidents"
            index={0}
          />
          <BenefitCard
            icon={<img src="/icon-badge-2.svg" alt="" className="w-20 h-20" />}
            title="Telegram Group"
            description="The badge holders' token-gated chat will be very high signal!"
            index={1}
          />
          <BenefitCard
            icon={<img src="/icon-badge-3.svg" alt="" className="w-20 h-20" />}
            title="Funding Influence"
            description="TheDAO has $150M and badge holders influence where it goes!"
            index={2}
          />
        </div>

        {/* Green decorative line */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent mb-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />

        {/* Influence Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Help shape Ethereum security
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-[20px]">
            Badge holders participate in signaling which security initiatives deserve support from the community.
          </p>
        </motion.div>

        {/* CTA Block */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href="https://paragraph.com/@thedao.fund/thedao-is-becoming-a-dao-again"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-dao-red hover:bg-dao-red-hover text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-red-900/50 transition-all duration-300"
          >
            Read More
          </motion.a>
        </motion.div>

        <Footer />
      </div>
    </section>
  );
}

function BenefitCard({ icon, title, description, index = 0 }: { icon: React.ReactNode; title: string; description: string; index?: number }) {
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
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-[#00ff88]/20" />
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
            ease: "easeInOut",
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
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}
