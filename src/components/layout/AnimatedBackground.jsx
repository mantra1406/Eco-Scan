import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Eco-Tech Animated Background
 * Layers:
 *  1. CSS gradient mesh orbs (animated)
 *  2. SVG wave lines
 *  3. Perspective grid
 *  4. Canvas floating particles
 */
export function AnimatedBackground() {
    const canvasRef = useRef(null);

    /* ── Canvas Particles ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animFrame;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particle config
        const PARTICLE_COUNT = 55;
        const colors = ['rgba(16,185,129,', 'rgba(6,182,212,', 'rgba(13,148,136,', 'rgba(52,211,153,'];

        class Particle {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = -(Math.random() * 0.5 + 0.15);
                this.r = Math.random() * 2.5 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.maxAlpha = this.alpha;
                this.life = 0;
                this.maxLife = Math.random() * 400 + 300;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                // Some particles connect via lines
                this.linked = Math.random() > 0.6;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life += 1;
                const progress = this.life / this.maxLife;
                this.alpha = this.maxAlpha * (1 - Math.pow(progress * 2 - 1, 4));
                if (this.life >= this.maxLife || this.y < -20) this.reset();
            }
            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}${this.alpha})`;
                ctx.fill();
                // Small inner bright point
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}${Math.min(this.alpha * 2, 0.8)})`;
                ctx.fill();
            }
        }

        const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

        // Connection lines between close particles
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                if (!particles[i].linked) continue;
                for (let j = i + 1; j < particles.length; j++) {
                    if (!particles[j].linked) continue;
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            particles.forEach((p) => { p.update(); p.draw(ctx); });
            animFrame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

            {/* ── Base gradient — adapts to theme ── */}
            <div className="absolute inset-0" style={{ background: 'var(--eco-bg)' }} />

            {/* ── Animated gradient orbs ── */}
            <motion.div
                animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="orb w-[700px] h-[700px] bg-emerald-600/18 top-[-150px] left-[-150px]"
                style={{ filter: 'blur(100px)', opacity: 0.22 }}
            />
            <motion.div
                animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="orb w-[600px] h-[600px] bg-cyan-600/15 top-[10%] right-[-100px]"
                style={{ filter: 'blur(90px)', opacity: 0.2 }}
            />
            <motion.div
                animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                className="orb w-[500px] h-[500px] bg-teal-600/12 bottom-[-50px] left-[35%]"
                style={{ filter: 'blur(80px)', opacity: 0.18 }}
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
                className="orb w-[400px] h-[400px] bg-emerald-500/10 bottom-[20%] right-[10%]"
                style={{ filter: 'blur(70px)', opacity: 0.15 }}
            />

            {/* ── Perspective grid ── */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    backgroundPosition: 'center center',
                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 80%)',
                }}
            />

            {/* ── SVG Wave Lines ── */}
            <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-30">
                <svg
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 w-[200%] h-full"
                    style={{ animation: 'wave 12s linear infinite' }}
                >
                    <path
                        d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,20 1440,60 L1440,120 L0,120 Z"
                        fill="none"
                        stroke="rgba(16,185,129,0.25)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M0,75 C200,35 400,100 600,70 C800,40 1000,90 1200,65 C1320,50 1400,80 1440,72 L1440,120 L0,120 Z"
                        fill="none"
                        stroke="rgba(6,182,212,0.15)"
                        strokeWidth="1"
                    />
                </svg>
                <svg
                    viewBox="0 0 1440 120"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 w-[200%] h-full"
                    style={{ animation: 'wave 18s linear infinite reverse', opacity: 0.4 }}
                >
                    <path
                        d="M0,40 C240,80 480,10 720,50 C960,90 1200,15 1440,50 L1440,120 L0,120 Z"
                        fill="none"
                        stroke="rgba(13,148,136,0.2)"
                        strokeWidth="1"
                    />
                </svg>
            </div>

            {/* ── Horizontal scan glow line ── */}
            <motion.div
                animate={{ y: ['0vh', '100vh'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                className="absolute left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.4) 30%, rgba(6,182,212,0.5) 50%, rgba(16,185,129,0.4) 70%, transparent 100%)',
                    boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                }}
            />

            {/* ── Soft radial glow at top center ── */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
                style={{
                    background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.12) 0%, transparent 70%)',
                }}
            />

            {/* ── Canvas particles ── */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.85 }}
            />

            {/* ── Vignette ── */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, var(--eco-bg) 100%)',
                    opacity: 0.65,
                }}
            />
        </div>
    );
}

export default AnimatedBackground;
