import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'ETHSecurity Badges', path: '/ethsecurity-badges', isNew: true },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-8 px-16 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} className="relative">
              {item.isNew && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 + i * 0.08 }}
                  className="absolute top-0 -right-9 z-0 text-[9px] font-bold tracking-wider uppercase bg-dao-red text-white px-1.5 py-0.5 rounded-full leading-none shadow-md shadow-red-900/40"
                >
                  new
                </motion.span>
              )}
              <motion.button
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -2 }}
                className={`relative text-[20px] leading-[36px] whitespace-nowrap transition-colors duration-200 cursor-pointer font-inter-tight ${
                  isActive
                    ? 'text-dao-green font-normal'
                    : 'text-white/80 hover:text-dao-green font-light'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-dao-green rounded-full"
                    layoutId="navIndicator"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
    </motion.nav>
  );
}
