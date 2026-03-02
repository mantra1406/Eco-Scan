import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, Sun, Moon } from 'lucide-react';
import { NAV_LINKS } from '../../config/constants';
import { useApp } from '../../context/AppContext';

/**
 * Eco-Tech Navbar — frosted glass, emerald accent, dark/light toggle
 */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useApp();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
                boxShadow: '0 0 20px rgba(16,185,129,0.5)',
              }}
            >
              <Leaf className="w-5 h-5 text-white" />
              {/* Ring glow */}
              <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-emerald-500" style={{ animationDuration: '3s' }} />
            </motion.div>
            <span className="font-syne font-bold text-xl gradient-text-eco">
              EcoScan
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${isActive(link.path)
                    ? 'text-emerald-400'
                    : 'text-[var(--eco-muted)] group-hover:text-[var(--eco-text)]'
                    }`}
                >
                  {link.label}
                </span>

                {/* Active glass pill */}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="ecoNavPill"
                    className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/25"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Hover underline */}
                <span className={`
                  absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full
                  transform origin-left transition-transform duration-200 ease-out
                  ${isActive(link.path) ? 'scale-x-0' : 'scale-x-0 group-hover:scale-x-100'}
                `} />
              </Link>
            ))}
          </div>

          {/* Right: Toggle + Mobile */}
          <div className="flex items-center gap-2">
            {/* Dark/Light toggle */}
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className={`
                relative w-14 h-7 rounded-full p-0.5 transition-all duration-300
                ${theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-600'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400'}
              `}
              style={{ boxShadow: theme === 'dark' ? '0 0 16px rgba(16,185,129,0.4)' : '0 0 16px rgba(251,191,36,0.4)' }}
              aria-label="Toggle theme"
            >
              <motion.div
                layout
                className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ x: theme === 'dark' ? 0 : 28 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {theme === 'dark'
                  ? <Moon className="w-3.5 h-3.5 text-emerald-700" />
                  : <Sun className="w-3.5 h-3.5 text-amber-500" />
                }
              </motion.div>
            </motion.button>

            {/* Mobile button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen
                  ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5 text-[var(--eco-text)]" />
                  </motion.div>
                  : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5 text-[var(--eco-text)]" />
                  </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-[rgba(16,185,129,0.1)] overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1 backdrop-blur-xl" style={{ background: 'var(--eco-bg)', borderBottom: '1px solid var(--eco-border)' }}>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-[var(--eco-muted)] hover:bg-white/5 hover:text-[var(--eco-text)]'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
