import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'ETHSecurity Badges', path: '/ethsecurity-badges' },
  { label: 'Funding Rounds', path: '/funding-rounds', isNew: true },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile menu on route changes and on Escape.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <motion.nav
      className="fixed top-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Desktop / tablet horizontal pill */}
      <div className="hidden md:flex items-center gap-8 px-16 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
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
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -2 }}
                className="inline-block"
              >
                <Link
                  to={item.path}
                  className={`relative inline-block text-[20px] leading-[36px] whitespace-nowrap transition-colors duration-200 cursor-pointer font-inter-tight ${
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
                </Link>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden flex flex-col items-end">
        <motion.button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          whileTap={{ scale: 0.92 }}
          className="size-11 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 hover:text-dao-green flex items-center justify-center cursor-pointer transition-colors duration-200"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-menu"
              role="menu"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="origin-top-right mt-3 min-w-[220px] py-3 px-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    role="menuitem"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-[16px] leading-[24px] whitespace-nowrap transition-colors duration-200 cursor-pointer font-inter-tight ${
                      isActive
                        ? 'text-dao-green font-normal bg-white/5'
                        : 'text-white/85 hover:text-dao-green hover:bg-white/5 font-light'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className="text-[9px] font-bold tracking-wider uppercase bg-dao-red text-white px-1.5 py-0.5 rounded-full leading-none shadow-md shadow-red-900/40">
                        new
                      </span>
                    )}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
