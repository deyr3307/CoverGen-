import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // Navigation timer states
  const [phase, setPhase] = useState<'base' | 'launch' | 'swarm' | 'return' | 'settled'>('base');
  const [showRipples, setShowRipples] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Pre-generate launch trailing path (Bezier Curve)
  const launchParticles: Particle[] = React.useMemo(() => {
    return Array.from({ length: 38 }).map((_, i) => {
      const t = i / 37;
      // Coordinates ofBezier trajectory
      const p0x = 0;
      const p0y = 0;
      const p1x = 100;
      const p1y = -190;
      const p2x = 180;
      const p2y = -260;

      const x = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
      const y = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

      return {
        id: i,
        // Trailing spread jitter
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 22,
        // Triggers dynamically as the cap flies by between 1.0s and 1.8s
        delay: 1.0 + t * 0.76,
        size: Math.random() * 4 + 2,
      };
    });
  }, []);

  // Pre-generate return trailing path (Bezier Curve back)
  const returnParticles: Particle[] = React.useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const t = i / 27;
      const p0x = 180;
      const p0y = -260;
      const p1x = 75;
      const p1y = -115;
      const p2x = 0;
      const p2y = 0;

      const x = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
      const y = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

      return {
        id: i + 100,
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        // Triggers dynamically as the cap flies back between 3.0s and 3.7s
        delay: 3.0 + t * 0.66,
        size: Math.random() * 3 + 2,
      };
    });
  }, []);

  useEffect(() => {
    // Phase Timeline Sequencer
    // 0.0s - 1.0s: 'base'
    // 1.0s - 1.8s: 'launch'
    // 1.8s - 3.0s: 'swarm' (swirling celebration dance at the peak)
    // 3.0s - 3.7s: 'return' (glides back to center)
    // 3.7s - 4.4s: 'settled'
    // 4.4s: Start elegant background exit fade
    // 4.9s: Trigger onComplete

    const launchTimer = setTimeout(() => setPhase('launch'), 1000);
    const swarmTimer = setTimeout(() => setPhase('swarm'), 1800);
    const returnTimer = setTimeout(() => setPhase('return'), 3000);
    
    const settleTimer = setTimeout(() => {
      setPhase('settled');
      setShowRipples(true);
    }, 3700);

    const exitSplashTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4500);

    const completionTimer = setTimeout(() => {
      onComplete();
    }, 4950);

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(swarmTimer);
      clearTimeout(returnTimer);
      clearTimeout(settleTimer);
      clearTimeout(exitSplashTimer);
      clearTimeout(completionTimer);
    };
  }, [onComplete]);

  // Framer Motion Keyframes for Original Cap
  const primaryCapVariants = {
    base: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.5 }
    },
    launch: {
      x: [0, 95, 180],
      y: [0, -170, -260],
      rotate: [0, -35, 45],
      scale: [1, 1.15, 0.95],
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // Snappy fast ease-out
      }
    },
    swarm: {
      x: [180, 150, 195, 180],
      y: [-260, -280, -235, -260],
      rotate: [45, 105, 15, 45],
      scale: 0.95,
      transition: {
        duration: 1.2,
        ease: "easeInOut"
      }
    },
    return: {
      x: [180, 90, 0],
      y: [-260, -115, 0],
      rotate: [45, -25, 0],
      scale: [0.95, 1.12, 1],
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1] // Graceful physical curve with elastic settle landing
      }
    },
    settled: {
      scale: [1, 1.16, 0.96, 1],
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="splash-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center overflow-hidden select-none"
        >
          {/* Subtle magical star sparks in the background to build cosmic context */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 bg-orange-400 rounded-full"
                style={{
                  top: `${15 + (i * 47) % 70}%`,
                  left: `${10 + (i * 61) % 80}%`,
                }}
                animate={{
                  scale: [0.5, 1.1, 0.5],
                  opacity: [0.15, 0.7, 0.15],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.25,
                }}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center w-full h-full max-w-lg">
            
            {/* 1. Trailing Light Dust Particles from launch */}
            {launchParticles.map((p) => (
              <motion.div
                key={`launch-p-${p.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, p.size / 2.5, 1.3, 0],
                  opacity: [0, 0.9, 0.4, 0],
                  filter: 'blur(0.5px)',
                }}
                transition={{
                  duration: 0.75,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#fb923c] to-[#f97316] pointer-events-none"
                style={{
                  x: p.x,
                  y: p.y,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* 2. Trailing Light Dust Particles from return path */}
            {returnParticles.map((p) => (
              <motion.div
                key={`return-p-${p.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, p.size / 2.5, 1.2, 0],
                  opacity: [0, 0.85, 0.35, 0],
                  filter: 'blur(0.4px)',
                }}
                transition={{
                  duration: 0.65,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fb923c] pointer-events-none"
                style={{
                  x: p.x,
                  y: p.y,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* 3. The Secondary Swarm Caps - Flying translucent celebrating hats */}
            <AnimatePresence>
              {phase === 'swarm' && (
                <>
                  {/* Swarm Cap 1: Flies from left-bottom towards top-right */}
                  <motion.div
                    initial={{ x: -260, y: -190, rotate: -45, scale: 0, opacity: 0 }}
                    animate={{
                      x: [ -230, -110, 80 ],
                      y: [ -170, -220, -300 ],
                      rotate: [ -45, 45, 180 ],
                      scale: [ 0.3, 0.72, 0.65 ],
                      opacity: [ 0, 0.7, 0.55, 0 ],
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="absolute text-[#f97316]/50 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                  >
                    <GraduationCap className="w-14 h-14" strokeWidth={2.4} fill="none" />
                  </motion.div>

                  {/* Swarm Cap 2: Flies from top-right towards peak */}
                  <motion.div
                    initial={{ x: 380, y: -380, rotate: 120, scale: 0, opacity: 0 }}
                    animate={{
                      x: [ 340, 240, 130 ],
                      y: [ -340, -260, -240 ],
                      rotate: [ 120, 10, -90 ],
                      scale: [ 0.2, 0.68, 0.6 ],
                      opacity: [ 0, 0.72, 0.45, 0 ],
                    }}
                    transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
                    className="absolute text-[#fb923c]/45 filter drop-shadow-[0_0_6px_rgba(251,146,60,0.35)]"
                  >
                    <GraduationCap className="w-14 h-14" strokeWidth={2.2} fill="none" />
                  </motion.div>

                  {/* Swarm Cap 3: Flies from bottom-right up high */}
                  <motion.div
                    initial={{ x: 280, y: -80, rotate: -90, scale: 0, opacity: 0 }}
                    animate={{
                      x: [ 240, 170, 110 ],
                      y: [ -120, -240, -320 ],
                      rotate: [ -90, 60, 210 ],
                      scale: [ 0.3, 0.65, 0.55 ],
                      opacity: [ 0, 0.68, 0.5, 0 ],
                    }}
                    transition={{ duration: 1.15, delay: 0.05, ease: "easeOut" }}
                    className="absolute text-[#f59e0b]/40 filter drop-shadow-[0_0_7px_rgba(245,158,11,0.3)]"
                  >
                    <GraduationCap className="w-14 h-14" strokeWidth={2.2} fill="none" />
                  </motion.div>

                  {/* Swarm Cap 4: Tiny high cap swirling at very top center */}
                  <motion.div
                    initial={{ x: -60, y: -450, rotate: 200, scale: 0, opacity: 0 }}
                    animate={{
                      x: [ -40, 30, 95 ],
                      y: [ -420, -360, -340 ],
                      rotate: [ 200, 310, 420 ],
                      scale: [ 0.2, 0.55, 0.48 ],
                      opacity: [ 0, 0.65, 0.4, 0 ],
                    }}
                    transition={{ duration: 0.95, delay: 0.15, ease: "easeOut" }}
                    className="absolute text-[#ea580c]/35 filter drop-shadow-[0_0_5px_rgba(234,88,12,0.3)]"
                  >
                    <GraduationCap className="w-14 h-14" strokeWidth={2.0} fill="none" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* 4. The Lock-in Ripple Effects (Fires at 3.7s upon perfect settle) */}
            <AnimatePresence>
              {showRipples && (
                <>
                  {/* Sonic Ripple Outer Ring */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0.9 }}
                    animate={{ scale: 3.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.1, 0.8, 0.2, 1] }}
                    className="absolute w-16 h-16 rounded-full border-2 border-[#f76e11] pointer-events-none"
                    style={{ x: 0, y: 0 }}
                  />

                  {/* Sonic Ripple Inner Ring */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0.75 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, delay: 0.1, ease: [0.1, 0.8, 0.2, 1] }}
                    className="absolute w-16 h-16 rounded-full border border-[#f59e0b]/70 pointer-events-none"
                    style={{ x: 0, y: 0 }}
                  />

                  {/* Warm breathing light pulse ripple disk */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0.8, filter: 'blur(8px)' }}
                    animate={{ scale: 4.8, opacity: 0, filter: 'blur(28px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 pointer-events-none"
                    style={{ x: 0, y: 0 }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* 5. ORIGINAL GRADUATION CAP (THE PRIMARY HERO) */}
            <motion.div
              variants={primaryCapVariants}
              animate={phase}
              className="relative z-50 flex items-center justify-center pointer-events-none"
              style={{ x: 0, y: 0 }}
            >
              {/* Continuous subtle breathing/glow that aligns with the cap */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [0.85, 1.3, 0.9, 1.4, 0.85],
                    opacity: [0.22, 0.55, 0.3, 0.6, 0.22],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 blur-lg opacity-40"
                />
              </div>

              {/* The high-visibility neon-orange line-art graduation cap matching image_8.png perfectly */}
              <GraduationCap
                strokeWidth={3}
                fill="none"
                className="w-20 h-20 text-[#f97316] filter drop-shadow-[0_0_15px_rgba(249,115,22,0.85)]"
              />
            </motion.div>

          </div>

          {/* Prompt / App Name indicator at the bottom */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: [0, 0.8, 0.8, 1, 0], y: 0 }}
            transition={{
              times: [0, 0.2, 0.7, 0.9, 1.0],
              duration: 4.4,
              ease: "easeInOut",
            }}
            className="absolute bottom-16 text-center"
          >
            <h1 className="text-xl font-bold tracking-[0.25em] text-white uppercase font-sans">
              Cover<span className="text-[#f97316] font-black">Gen</span>
            </h1>
            <p className="text-[10px] tracking-[0.4em] font-mono text-slate-500 uppercase mt-2">
              Preparing Your Creative Studio
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
