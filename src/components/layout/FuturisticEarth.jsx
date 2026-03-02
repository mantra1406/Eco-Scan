import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Futuristic animated Earth globe using Canvas + CSS
 * Renders: rotating wireframe globe, atmospheric glow, orbiting rings, data nodes
 */
export function FuturisticEarth({ size = 420 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        const cx = size / 2;
        const cy = size / 2;
        const R = size * 0.36;

        let raf;
        let t = 0;

        // Points on a sphere (latitude/longitude lines)
        const latLines = 10;
        const lonLines = 16;
        const dataNodes = Array.from({ length: 18 }, () => ({
            lat: (Math.random() - 0.5) * Math.PI,
            lon: Math.random() * Math.PI * 2,
            pulse: Math.random() * Math.PI * 2,
            r: Math.random() * 2.5 + 1.5,
            color: Math.random() > 0.5 ? 'rgba(16,185,129,' : 'rgba(6,182,212,',
        }));

        const project = (lat, lon, rotation) => {
            const x = Math.cos(lat) * Math.cos(lon + rotation);
            const y = Math.sin(lat);
            const z = Math.cos(lat) * Math.sin(lon + rotation);
            return { x: cx + x * R, y: cy - y * R, z };
        };

        const draw = () => {
            ctx.clearRect(0, 0, size, size);
            t += 0.004;
            const rot = t;

            // 0. Deep atmosphere glow layers
            const atmo = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.45);
            atmo.addColorStop(0, 'rgba(16,185,129,0.0)');
            atmo.addColorStop(0.5, 'rgba(16,185,129,0.07)');
            atmo.addColorStop(0.8, 'rgba(6,182,212,0.09)');
            atmo.addColorStop(1, 'rgba(6,182,212,0.0)');
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.45, 0, Math.PI * 2);
            ctx.fillStyle = atmo;
            ctx.fill();

            // 1. Globe base fill
            const globeGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
            globeGrad.addColorStop(0, 'rgba(13,60,50,0.85)');
            globeGrad.addColorStop(0.5, 'rgba(10,35,45,0.9)');
            globeGrad.addColorStop(1, 'rgba(6,15,30,0.95)');
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = globeGrad;
            ctx.fill();

            // 2. Latitude lines
            for (let i = 1; i < latLines; i++) {
                const lat = -Math.PI / 2 + (Math.PI / latLines) * i;
                const r = Math.cos(lat) * R;
                const yPos = cy - Math.sin(lat) * R;
                ctx.beginPath();
                ctx.ellipse(cx, yPos, r, r * 0.18, 0, 0, Math.PI * 2);
                const visible = Math.abs(Math.sin(lat)) < 0.9;
                if (visible) {
                    ctx.strokeStyle = 'rgba(16,185,129,0.15)';
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }

            // 3. Longitude lines
            for (let i = 0; i < lonLines; i++) {
                const lon = (Math.PI / (lonLines / 2)) * i + rot;
                const pts = [];
                const steps = 60;
                for (let j = 0; j <= steps; j++) {
                    const lat = -Math.PI / 2 + (Math.PI / steps) * j;
                    const p = project(lat, 0, lon - Math.PI / 2);
                    pts.push(p);
                }
                ctx.beginPath();
                let moveDone = false;
                for (const p of pts) {
                    if (p.z >= -0.05) {
                        if (!moveDone) { ctx.moveTo(p.x, p.y); moveDone = true; }
                        else ctx.lineTo(p.x, p.y);
                    } else {
                        moveDone = false;
                    }
                }
                const brightness = 0.08 + 0.12 * Math.max(0, Math.sin(lon));
                ctx.strokeStyle = `rgba(16,185,129,${brightness})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }

            // 4. Continent-like land shapes (SVG paths approximated as arcs)
            const lands = [
                { lat: 0.4, lon: 0.5, size: 0.18 },
                { lat: 0.6, lon: 1.1, size: 0.12 },
                { lat: -0.3, lon: -0.4, size: 0.14 },
                { lat: 0.3, lon: -1.2, size: 0.16 },
                { lat: -0.5, lon: 1.8, size: 0.10 },
                { lat: 0.1, lon: 2.4, size: 0.09 },
            ];
            for (const land of lands) {
                const p = project(land.lat, land.lon, rot);
                if (p.z > 0.1) {
                    const alpha = Math.min(1, p.z) * 0.5;
                    const lR = land.size * R * p.z;
                    const landGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, lR);
                    landGrad.addColorStop(0, `rgba(16,185,129,${alpha * 0.7})`);
                    landGrad.addColorStop(1, `rgba(13,148,136,${alpha * 0.1})`);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, lR, 0, Math.PI * 2);
                    ctx.fillStyle = landGrad;
                    ctx.fill();
                }
            }

            // 5. Data nodes (glowing dots)
            for (const node of dataNodes) {
                const p = project(node.lat, node.lon, rot);
                if (p.z > 0) {
                    node.pulse += 0.04;
                    const alpha = 0.5 + 0.5 * Math.sin(node.pulse);
                    const nR = node.r * (0.8 + 0.4 * Math.sin(node.pulse)) * p.z;

                    // Pulse ring
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, nR * 3.5 * (0.6 + 0.4 * Math.sin(node.pulse)), 0, Math.PI * 2);
                    ctx.strokeStyle = `${node.color}${alpha * 0.3})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, nR, 0, Math.PI * 2);
                    ctx.fillStyle = `${node.color}${alpha * 0.9})`;
                    ctx.fill();
                }
            }

            // 6. Specular highlight (top-left shine)
            const shine = ctx.createRadialGradient(cx - R * 0.45, cy - R * 0.45, 0, cx - R * 0.3, cy - R * 0.3, R * 0.7);
            shine.addColorStop(0, 'rgba(255,255,255,0.12)');
            shine.addColorStop(0.4, 'rgba(255,255,255,0.04)');
            shine.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fillStyle = shine;
            ctx.fill();

            // 7. Edge glow ring
            const edgeGlow = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.02);
            edgeGlow.addColorStop(0, 'rgba(16,185,129,0)');
            edgeGlow.addColorStop(0.6, 'rgba(16,185,129,0.18)');
            edgeGlow.addColorStop(1, 'rgba(6,182,212,0.08)');
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2);
            ctx.fillStyle = edgeGlow;
            ctx.fill();

            // 8. Scan sweep line
            const sweepAngle = t * 0.35;
            const sweepX = cx + Math.cos(sweepAngle) * R;
            const sweepY = cy + Math.sin(sweepAngle) * R;
            const sweep = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
            sweep.addColorStop(0, 'rgba(16,185,129,0.0)');
            sweep.addColorStop(0.7, 'rgba(16,185,129,0.12)');
            sweep.addColorStop(1, 'rgba(16,185,129,0.0)');
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, R, sweepAngle - 0.5, sweepAngle);
            ctx.closePath();
            ctx.fillStyle = sweep;
            ctx.fill();

            raf = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(raf);
    }, [size]);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Outer halo rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full"
                style={{
                    width: size * 1.18,
                    height: size * 1.18,
                    border: '1px solid rgba(16,185,129,0.12)',
                    boxShadow: '0 0 40px rgba(16,185,129,0.08) inset',
                }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                className="absolute rounded-full"
                style={{
                    width: size * 1.36,
                    height: size * 1.36,
                    border: '1px dashed rgba(6,182,212,0.08)',
                }}
            />

            {/* Orbiting dot ring 1 */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{ width: size * 1.18, height: size * 1.18 }}
            >
                {[0, 72, 144, 216, 288].map((deg, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-emerald-400"
                        style={{
                            top: '50%',
                            left: '50%',
                            marginTop: '-4px',
                            marginLeft: '-4px',
                            transform: `rotate(${deg}deg) translateX(${size * 0.59}px)`,
                            boxShadow: '0 0 8px rgba(16,185,129,0.8)',
                            opacity: 0.6 + i * 0.08,
                        }}
                    />
                ))}
            </motion.div>

            {/* Orbiting dot ring 2 (tilted) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute"
                style={{ width: size * 1.36, height: size * 1.36, transform: 'rotateX(60deg)' }}
            >
                {[0, 120, 240].map((deg, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
                        style={{
                            top: '50%',
                            left: '50%',
                            marginTop: '-3px',
                            marginLeft: '-3px',
                            transform: `rotate(${deg}deg) translateX(${size * 0.68}px)`,
                            boxShadow: '0 0 6px rgba(6,182,212,0.8)',
                            opacity: 0.65,
                        }}
                    />
                ))}
            </motion.div>

            {/* The canvas globe */}
            <canvas
                ref={canvasRef}
                style={{ width: size, height: size, display: 'block', position: 'relative', zIndex: 1 }}
            />

            {/* Floating data labels */}
            <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute text-xs font-mono text-emerald-400"
                style={{ top: '12%', left: '5%', background: 'rgba(6,20,16,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.25)' }}
            >
                CO₂ ↓ 2.4kg
            </motion.div>

            <motion.div
                animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute text-xs font-mono text-cyan-400"
                style={{ bottom: '14%', right: '3%', background: 'rgba(6,16,26,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(6,182,212,0.25)' }}
            >
                AI Active ●
            </motion.div>

            <motion.div
                animate={{ y: [0, -6, 0], opacity: [0.6, 0.95, 0.6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute text-xs font-mono text-emerald-300"
                style={{ bottom: '26%', left: '2%', background: 'rgba(6,20,16,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}
            >
                🌱 1,284 Scans
            </motion.div>
        </div>
    );
}

export default FuturisticEarth;
