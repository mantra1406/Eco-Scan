import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useTransform as useT, useInView } from 'framer-motion';
import {
  ArrowRight, Scan, BarChart3, Trophy, Leaf, Users, Zap,
  Shield, Globe, Star, Github, Twitter, Linkedin, ChevronRight,
  TreePine, Recycle, Target, Sparkles, Wind, Activity, Cpu,
} from 'lucide-react';
import { AnimatedBackground } from '../components/layout/AnimatedBackground';
import { FuturisticEarth } from '../components/layout/FuturisticEarth';
import { useApp } from '../context/AppContext';

/* ─────────────────────────────────────────────────────────────────────────
   Animated Counter
───────────────────────────────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2400, bounce: 0 });
  const displayValue = useT(springValue, (v) => Math.round(v).toLocaleString());
  useEffect(() => { if (inView) motionValue.set(value); }, [inView, value, motionValue]);
  return <span ref={ref} className="tabular-nums">{prefix}<motion.span>{displayValue}</motion.span>{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────
   Floating Glass Card  (hero UI widget)
───────────────────────────────────────────────────────────────────────── */
function HeroGlassCard({ style, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className="absolute glass-eco rounded-2xl px-4 py-3 shadow-glass"
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const { scrollY } = useScroll();
  const mockY = useTransform(scrollY, [0, 600], [0, -80]);

  const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.13, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-emerald-300">Eco-Tech AI Platform</span>
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="font-syne font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-[1.08]"
              style={{ color: 'var(--eco-text)' }}
            >
              Scan. Save.{' '}
              <span className="gradient-text-eco block">Sustain the</span>
              <span className="gradient-text-eco">Planet.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'var(--eco-muted)' }}
            >
              EcoScan uses AI to identify waste instantly and calculate your real
              environmental impact. Every scan turns into{' '}
              <span style={{ color: 'var(--eco-text)' }} className="font-medium">measurable CO₂ savings</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3} initial="hidden" animate="visible" variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/scanner">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-eco-glow inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-semibold text-base"
                >
                  <Scan className="w-4.5 h-4.5" />
                  Start Scanning
                  <ArrowRight className="w-4.5 h-4.5" />
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-eco-glass inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-base"
                  style={{ color: 'var(--eco-text)' }}
                >
                  <BarChart3 className="w-4.5 h-4.5 text-emerald-400" />
                  View Dashboard
                </motion.button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              custom={4} initial="hidden" animate="visible" variants={fadeUp}
              className="flex items-center gap-4 mt-10"
            >
              <div className="flex -space-x-2">
                {['from-emerald-500 to-teal-500', 'from-cyan-500 to-blue-500', 'from-teal-500 to-emerald-600', 'from-green-400 to-cyan-500'].map((g, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 flex items-center justify-center`} style={{ borderColor: 'var(--eco-bg)' }}>
                    <Users className="w-3.5 h-3.5 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: 'var(--eco-muted)' }}>
                <span style={{ color: 'var(--eco-text)' }} className="font-semibold">1,200+</span> eco-warriors active
              </p>
            </motion.div>
          </div>

          {/* Right: Futuristic Earth Globe */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: mockY }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Outer glow behind Earth */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 75%)', filter: 'blur(40px)' }} />
            <FuturisticEarth size={440} />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-9 rounded-full border-2 flex items-start justify-center p-1.5"
          style={{ borderColor: 'rgba(16,185,129,0.3)' }}
        >
          <div className="w-1 h-2 rounded-full bg-emerald-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Stats Section
───────────────────────────────────────────────────────────────────────── */
function StatsSection() {
  const { getTotalScans, getTotalCO2Saved, getTotalGreenPoints } = useApp();
  const stats = [
    { label: 'Total Scans', value: Math.max(getTotalScans(), 1284), suffix: '+', icon: Scan, g: 'from-emerald-600 to-teal-600' },
    { label: 'CO₂ Saved', value: Math.max(Math.round(getTotalCO2Saved()), 890), suffix: ' kg', icon: Globe, g: 'from-cyan-600 to-blue-600' },
    { label: 'Green Points', value: Math.max(getTotalGreenPoints(), 47200), suffix: '+', icon: Trophy, g: 'from-teal-600 to-emerald-600' },
    { label: 'Trees Saved', value: 42, suffix: '+', icon: TreePine, g: 'from-blue-600 to-cyan-600' },
  ];
  return (
    <section className="relative py-20 border-y" style={{ borderColor: 'rgba(16,185,129,0.1)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-2">Real Impact</p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl" style={{ color: 'var(--eco-text)' }}>
            Numbers That <span className="gradient-text-eco">Inspire</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-eco rounded-3xl p-6 text-center eco-card-hover"
              style={{ border: '1px solid rgba(16,185,129,0.1)' }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.g} flex items-center justify-center mx-auto mb-4`}
                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-syne font-bold text-3xl sm:text-4xl gradient-text-eco mb-1">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm" style={{ color: 'var(--eco-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Features Section
───────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Cpu, title: 'AI Classification', desc: 'Upload any image. Our model identifies waste type instantly with confidence scoring.', g: 'from-emerald-600 to-teal-600', badge: 'Core AI' },
  { icon: Wind, title: 'Carbon Analytics', desc: 'Every scan calculates real CO₂ savings using validated emission factors from research databases.', g: 'from-cyan-600 to-blue-600', badge: 'Insights' },
  { icon: Trophy, title: 'Green Rewards', desc: 'Gamified eco-points for proper waste segregation. Compete, inspire, and win on the leaderboard.', g: 'from-teal-600 to-emerald-600', badge: 'Gamified' },
  { icon: Users, title: 'Community', desc: 'Join thousands of eco-warriors. Compare impact, celebrate milestones, and inspire others.', g: 'from-blue-600 to-cyan-600', badge: 'Social' },
  { icon: Zap, title: 'Real-time Results', desc: 'Instant feedback on every scan. No delay — classify, learn, and act in seconds.', g: 'from-emerald-500 to-cyan-500', badge: 'Fast' },
  { icon: Shield, title: 'Admin Dashboard', desc: 'Powerful monitoring panel for data export and full platform management at scale.', g: 'from-cyan-700 to-teal-600', badge: 'Admin' },
];

function FeaturesSection() {
  return (
    <section className="relative py-24" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--eco-text)' }}>
            How <span className="gradient-text-eco">EcoScan</span> Works
          </h2>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--eco-muted)' }}>
            Three powerful engines working together to transform waste disposal into measurable environmental action.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-eco glass-eco-hover rounded-3xl p-7 group cursor-default"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Icon + Badge */}
              <div className="flex items-start justify-between mb-5">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }} transition={{ duration: 0.2 }}
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.g} flex items-center justify-center`}
                  style={{ boxShadow: '0 0 20px rgba(16,185,129,0.35)' }}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                  {f.badge}
                </span>
              </div>
              <h3 className="font-syne font-bold text-xl mb-3 transition-colors group-hover:text-emerald-400" style={{ color: 'var(--eco-text)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--eco-muted)' }}>{f.desc}</p>
              {/* Bottom glow bar on hover */}
              <div className={`mt-5 h-px w-0 group-hover:w-full bg-gradient-to-r ${f.g} transition-all duration-500 rounded-full`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Dashboard Preview Section
───────────────────────────────────────────────────────────────────────── */
function DashboardPreview() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: 'rgba(255,255,255,0.01)' }}>
      {/* Section glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.08) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-3">Dashboard</p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl mb-4" style={{ color: 'var(--eco-text)' }}>
            Your <span className="gradient-text-eco">Impact Hub</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--eco-muted)' }}>
            Track every scan, measure your CO₂ savings, and rise through the leaderboard — all from one clean interface.
          </p>
        </motion.div>

        {/* Semi-transparent dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* Outer glow frame */}
          <div className="absolute inset-0 rounded-3xl blur-2xl" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 80%)', transform: 'scale(1.05)' }} />

          <div className="relative glass-eco rounded-3xl p-6 sm:p-8" style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {['bg-red-500/70', 'bg-yellow-500/70', 'bg-green-500/70'].map((c, i) => <div key={i} className={`w-3 h-3 rounded-full ${c}`} />)}
                </div>
                <span className="font-syne font-bold text-sm gradient-text-eco">EcoScan Dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--eco-muted)' }}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Left: main stat */}
              <div className="md:col-span-1 space-y-4">
                {[
                  { label: 'Total Scans', value: '1,284', icon: Scan, trend: '+12%' },
                  { label: 'CO₂ Saved', value: '89 kg', icon: Globe, trend: '+28%' },
                  { label: 'Eco Points', value: '4,720', icon: Trophy, trend: '+8%' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#059669,#0891b2)', boxShadow: '0 0 14px rgba(16,185,129,0.3)' }}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs" style={{ color: 'var(--eco-muted)' }}>{item.label}</div>
                      <div className="font-syne font-bold text-base gradient-text-eco">{item.value}</div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">{item.trend}</span>
                  </div>
                ))}
              </div>

              {/* Right: fake chart area */}
              <div className="md:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.1)', minHeight: '220px' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-sm" style={{ color: 'var(--eco-text)' }}>CO₂ Impact Over Time</span>
                  <div className="flex gap-3 text-xs" style={{ color: 'var(--eco-muted)' }}>
                    {['7d', '30d', '90d'].map(d => <span key={d} className={d === '30d' ? 'text-emerald-400 font-semibold' : 'cursor-pointer hover:text-emerald-400'}>{d}</span>)}
                  </div>
                </div>
                {/* SVG area chart */}
                <svg viewBox="0 0 400 140" className="w-full h-32" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[30, 60, 90, 120].map(y => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  ))}
                  {/* Area fill */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    d="M 0 120 L 40 105 L 80 90 L 120 80 L 160 70 L 200 55 L 240 65 L 280 45 L 320 35 L 360 25 L 400 15"
                    fill="none"
                    stroke="url(#ecoLineGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="ecoLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  {/* Area below */}
                  <path
                    d="M 0 120 L 40 105 L 80 90 L 120 80 L 160 70 L 200 55 L 240 65 L 280 45 L 320 35 L 360 25 L 400 15 L 400 140 L 0 140 Z"
                    fill="url(#chartGrad)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Testimonials
───────────────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Environmental Lead', avatar: 'from-emerald-500 to-teal-500', quote: 'EcoScan completely changed how I think about waste. Real CO₂ numbers make every scan feel meaningful.', stars: 5 },
  { name: 'Rohan Mehta', role: 'Sustainability Director', avatar: 'from-cyan-500 to-blue-500', quote: 'The AI classification is incredibly accurate. Deployed at our office — engagement has been amazing.', stars: 5 },
  { name: 'Divya Iyer', role: 'Green Tech Enthusiast', avatar: 'from-teal-500 to-emerald-600', quote: 'The leaderboard is addictive in the best way. Our team competes weekly to save the most CO₂!', stars: 5 },
];

function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-3">Community</p>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl" style={{ color: 'var(--eco-text)' }}>
            Loved by <span className="gradient-text-eco">Eco-Warriors</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-eco eco-card-hover rounded-3xl p-6"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--eco-muted)' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${t.avatar} flex items-center justify-center text-white text-sm font-bold`}
                  style={{ boxShadow: '0 0 14px rgba(16,185,129,0.3)' }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--eco-text)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--eco-muted)' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CTA Banner
───────────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative glass-eco rounded-3xl p-10 sm:p-14 overflow-hidden"
          style={{ border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 80px rgba(16,185,129,0.1)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(16,185,129,0.12) 0%, transparent 60%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 100%, rgba(6,182,212,0.1) 0%, transparent 60%)' }} />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-emerald-300 mb-6"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Target className="w-4 h-4" />
              Make Your Impact Today
            </span>
            <h2 className="font-syne font-bold text-3xl sm:text-5xl mb-5" style={{ color: 'var(--eco-text)' }}>
              Ready to Start <br /><span className="gradient-text-eco">Saving the Planet?</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--eco-muted)' }}>
              Join 1,200+ eco-warriors already making a difference. Every scan counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/scanner">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn-eco-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-white font-semibold text-base">
                  <Scan className="w-5 h-5" />
                  Start Scanning Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/leaderboard">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn-eco-glass inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base"
                  style={{ color: 'var(--eco-text)' }}>
                  <Trophy className="w-5 h-5 text-amber-400" />
                  View Leaderboard
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Footer  (frosted glass)
───────────────────────────────────────────────────────────────────────── */
const FOOTER_COLS = {
  Product: [
    { label: 'Scanner', to: '/scanner' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Leaderboard', to: '/leaderboard' },
    { label: 'Admin', to: '/admin' },
  ],
  Platform: [
    { label: 'AI Classification', to: '/scanner' },
    { label: 'Carbon Analytics', to: '/dashboard' },
    { label: 'Green Rewards', to: '/leaderboard' },
    { label: 'Insights', to: '/admin' },
  ],
};
const SOCIALS = [
  { Icon: Github, href: '#', label: 'GitHub' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
];

function Footer() {
  return (
    <footer style={{ background: 'var(--eco-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid var(--eco-border)' }}>
      {/* Gradient top border */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #10b981 30%, #06b6d4 60%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#059669,#0891b2)', boxShadow: '0 0 18px rgba(16,185,129,0.5)' }}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-syne font-bold text-xl gradient-text-eco">EcoScan</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: 'var(--eco-muted)' }}>
              AI-powered sustainability platform. Turning waste identification into measurable environmental change.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <motion.a key={label} href={href} aria-label={label}
                  whileHover={{ scale: 1.12, y: -3 }} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl glass-eco flex items-center justify-center transition-colors hover:border-emerald-500/40"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--eco-muted)' }}>
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_COLS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-syne font-bold text-sm uppercase tracking-widest mb-5 text-emerald-400">{section}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="flex items-center gap-1.5 text-sm group transition-colors hover:text-emerald-400"
                      style={{ color: 'var(--eco-muted)' }}>
                      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(16,185,129,0.1)' }}>
          <p className="text-xs" style={{ color: 'var(--eco-muted)' }}>© 2024 EcoScan. Built for a sustainable future. 🌱</p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--eco-muted)' }}>
            <span>Team EcoScan</span><span>·</span>
            <span>Hackathon 2024</span><span>·</span>
            <span className="text-emerald-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Landing Page
───────────────────────────────────────────────────────────────────────── */
export function Landing() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--eco-bg)' }}>
      <AnimatedBackground />
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DashboardPreview />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}

export default Landing;
