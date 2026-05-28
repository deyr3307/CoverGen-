import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Type, Sliders, Shield, QrCode } from 'lucide-react';

interface TabIconProps {
  isActive: boolean;
  isDark: boolean;
}

/**
 * 1. Animated Templates Icon
 * A beautiful royal blue / indigo spectrum themed grid system.
 * Gently pulses and expands dynamically with dual-tone active block highlight.
 */
export const AnimatedTemplatesIcon: React.FC<TabIconProps> = ({ isActive, isDark }) => {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center select-none shrink-0">
      {/* Background rich neon blue grid dust */}
      <motion.div
        animate={isActive ? { scale: [1, 1.35, 1], opacity: [0.15, 0.45, 0.15] } : { opacity: 0.05 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-blue-500/25 blur-sm rounded-md"
      />
      
      {/* Interactive blue/indigo themed grid-structure */}
      <div className={`grid grid-cols-2 gap-[2px] w-4 h-4 p-[1px] rounded bg-transparent relative z-10 transition-colors border ${
        isActive 
          ? isDark ? 'border-blue-400/80' : 'border-blue-500/60'
          : 'border-slate-300 dark:border-slate-700/60'
      }`}>
        {[0, 1, 2, 3].map((idx) => {
          const pulseDelay = idx * 0.15;
          const activeAnimate = {
            scale: [1, 1.18, 1],
            opacity: [0.75, 1, 0.75],
            backgroundColor: idx === 0 || idx === 3 
              ? (isDark ? '#3b82f6' : '#2563eb') // Primary Blue
              : (isDark ? '#6366f1' : '#4f46e5') // Indigo
          };
          const normalAnimate = {
            scale: 1,
            opacity: 0.65,
            backgroundColor: isDark ? '#334155' : '#94a3b8'
          };

          return (
            <motion.div
              key={idx}
              animate={isActive ? activeAnimate : normalAnimate}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: pulseDelay
              }}
              style={{ borderRadius: '1.5px' }}
              className="w-full h-full"
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * 2. Animated Fonts Icon
 * A gorgeous purple / pink / magenta spectrum themed typography cage.
 * Features a morphing letter system with elegant purple backdrops and tiny floating neon nodes.
 */
export const AnimatedFontsIcon: React.FC<TabIconProps> = ({ isActive, isDark }) => {
  const [glyphIndex, setGlyphIndex] = useState(0);
  const glyphs = ['A', 'T', 'F', 'g'];
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setGlyphIndex((prev) => (prev + 1) % glyphs.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isActive]);

  const activeColor = isDark ? '#d946ef' : '#c026d3'; // Rich magenta/fuchsia for font selector

  return (
    <div className="relative w-5 h-5 flex items-center justify-center select-none shrink-0">
      {/* Background vector alignments & neon highlight */}
      <div className="absolute inset-x-0 h-[1px] bg-purple-300 dark:bg-purple-900/40 top-1 opacity-50" />
      <div className="absolute inset-y-0 w-[1px] bg-purple-300 dark:bg-purple-900/40 left-1 opacity-50" />
      <motion.div
        animate={isActive ? { scale: [0.9, 1.2, 0.9], opacity: [0.12, 0.38, 0.12] } : { opacity: 0.05 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-purple-500/20 blur-[3px] rounded-full"
      />
      
      {/* Letter glyph */}
      <div className="relative z-10 w-4 h-4 flex items-center justify-center font-serif text-xs font-black leading-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={isActive ? glyphIndex : 'static'}
            initial={{ scale: 0.5, opacity: 0, y: 1.5 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.25, opacity: 0, y: -1.5 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{ 
              color: isActive ? activeColor : isDark ? '#94a3b8' : '#64748b',
              textShadow: isActive ? `0 0 8px ${isDark ? '#d946ef55' : '#c026d345'}` : 'none'
            }}
            className="select-none tracking-tight leading-none"
          >
            {isActive ? glyphs[glyphIndex] : 'A'}
          </motion.span>
        </AnimatePresence>

        {/* Floating purple anchor node dot */}
        {isActive && (
          <motion.div
            animate={{
              x: [-1.2, 1.8, -1.2],
              y: [-1, 1.5, -1],
              scale: [0.8, 1.25, 0.8]
            }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full border border-purple-500 bg-white shadow-[0_0_5px_rgba(168,85,247,0.8)]"
          />
        )}
      </div>
    </div>
  );
};

/**
 * 3. Animated Borders Icon
 * Shows a gold / warm amber / orange miniature page layout.
 * Outer border glows and receives a continuous orbiting laser tracer beam.
 */
export const AnimatedBordersIcon: React.FC<TabIconProps> = ({ isActive, isDark }) => {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center select-none shrink-0 p-[2px]">
      {/* Glowing backdrop */}
      <motion.div
        animate={isActive ? { opacity: [0.15, 0.4, 0.15] } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-amber-500/20 blur-[4px] rounded"
      />

      {/* Page box outline with golden highlights */}
      <div className={`w-4 h-[18px] rounded border relative overflow-hidden transition-all flex flex-col justify-between p-0.5 ${
        isActive 
          ? isDark ? 'border-amber-500/90 bg-[#120d04]' : 'border-amber-600 bg-white shadow-sm'
          : isDark ? 'border-slate-700 bg-transparent' : 'border-slate-300 bg-transparent'
      }`}>
        {/* Tiny placeholder lines inside to complete document layout aesthetic */}
        <div className="space-y-[2px] w-full mt-[1.5px]">
          <div className="w-[75%] h-[1px] bg-slate-300 dark:bg-slate-700/90 rounded-sm" />
          <div className="w-full h-[1px] bg-slate-300 dark:bg-slate-700/90 rounded-sm" />
        </div>
        <div className={`w-2/3 h-[1px] rounded-sm self-center mb-[1.5px] ${isActive ? 'bg-amber-500/80 font-bold' : 'bg-slate-300'}`} />

        {/* Laser tracer loop around the card rim */}
        {isActive && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.rect
              x="3"
              y="3"
              width="94"
              height="94"
              rx="12"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="9"
              strokeDasharray="42 158"
              animate={{
                strokeDashoffset: [-200, 0]
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
        )}
      </div>
    </div>
  );
};

/**
 * 4. Animated Branding Icon
 * A beautiful mint / emerald-teal high-tech academic crest.
 * Stamps proudly down with gorgeous concentric expanding radar ripple rings.
 */
export const AnimatedBrandingIcon: React.FC<TabIconProps> = ({ isActive, isDark }) => {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center select-none shrink-0">
      {/* Expanding dual-layered mint green ripples */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [0.5, 1.95], opacity: [0.85, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-3.5 h-3.5 rounded-full border border-emerald-400 bg-emerald-400/5 shadow-[0_0_6px_#34d399]"
          />
          <motion.div
            animate={{ scale: [0.5, 1.95], opacity: [0.85, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
            className="absolute w-3.5 h-3.5 rounded-full border border-teal-400 bg-teal-400/5 shadow-[0_0_6px_#2dd4bf]"
          />
        </div>
      )}

      {/* Mini shield/badge vector */}
      <motion.div
        animate={isActive ? {
          y: [-1, 1.2, -1],
          scale: [0.9, 1.1, 0.9],
          rotate: [-3, 3, -3]
        } : { scale: 0.9 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className={`relative z-10 w-3.5 h-3.5 flex items-center justify-center rounded-sm transition-colors ${
          isActive 
            ? 'text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]' 
            : isDark ? 'text-slate-500' : 'text-slate-450'
        }`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full currentColor" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50,15 L80,30 L80,65 L50,85 L20,65 L20,30 Z" />
          <polyline points="35,50 45,60 65,40" stroke="currentColor" strokeWidth="14" className={isActive ? "opacity-100" : "opacity-0"} />
          {!isActive && <circle cx="50" cy="50" r="10" fill="currentColor" className="opacity-30" />}
        </svg>
      </motion.div>
    </div>
  );
};
