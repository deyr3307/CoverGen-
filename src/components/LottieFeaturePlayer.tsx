import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download } from 'lucide-react';

interface LottieFeaturePlayerProps {
  type: 'preview' | 'watermark' | 'fonts' | 'export' | 'background' | 'layout';
  theme?: 'dark' | 'light';
}

export function LottieFeaturePlayer({ type, theme = 'dark' }: LottieFeaturePlayerProps) {
  const [fontIndex, setFontIndex] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);

  // Custom typography styles showcasing elegant academic script and premium fonts
  const fonts = [
    { name: 'Playball Script', className: 'font-cursive font-medium tracking-wide text-2xl', fontFamily: '"Playball", "Satisfy", "Dancing Script", cursive' },
    { name: 'Classic Garamond', className: 'font-serif font-bold uppercase text-lg', fontFamily: '"EB Garamond", "Playfair Display", Georgia, serif' },
    { name: 'Space Grotesk', className: 'font-display font-extrabold tracking-tighter text-xl', fontFamily: '"Space Grotesk", "Outfit", "Inter", sans-serif' },
    { name: 'JetBrains Mono', className: 'font-mono font-medium tracking-wider text-base', fontFamily: '"JetBrains Mono", monospace' }
  ];

  // Font style loop interval
  useEffect(() => {
    if (type !== 'fonts') return;
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fonts.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [type, fonts.length]);

  const exportFormats = ['PDF', 'JPG', 'PNG'];
  const [formatIndex, setFormatIndex] = useState(0);

  // Cycle export formats (PDF, PNG, JPG)
  useEffect(() => {
    if (type !== 'export') return;
    const interval = setInterval(() => {
      setFormatIndex((prev) => (prev + 1) % exportFormats.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [type]);

  // Export progress loop animation
  useEffect(() => {
    if (type !== 'export') return;
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          return 0; // seamless reset loop
        }
        return prev + 8;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [type]);

  // ==========================================
  // TYPE: PREVIEW (Animated Eyes with Laser Scanner Line)
  // ==========================================
  if (type === 'preview') {
    return (
      <div id="icon-anim-preview" className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 ${
        theme === 'light'
          ? 'bg-blue-50/70 border border-blue-200/80 text-blue-600'
          : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
      }`}>
        {/* Subtle grid background */}
        <div className={`absolute inset-0 opacity-20 bg-[size:10px_10px] ${
          theme === 'light'
            ? 'bg-[linear-gradient(to_right,rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.2)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)]'
        }`} />
        
        {/* Pulsing radar circle */}
        <div className={`absolute w-12 h-12 rounded-full border animate-ping opacity-60 pointer-events-none ${
          theme === 'light' ? 'border-blue-300/40' : 'border-blue-500/20'
        }`} />

        {/* Animated eye box */}
        <div className="w-8 h-8 relative flex items-center justify-center z-10">
          <motion.div
            animate={{
              scaleY: [1, 1, 1, 0.1, 1, 1, 1], // sudden natural eye blink
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-7 h-5 relative flex items-center justify-center"
          >
            {/* Elegant Vector outline eye */}
            <svg viewBox="0 0 100 60" className={`w-full h-full ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
              <path d="M10,30 C30,10 70,10 90,30 C70,50 30,50 10,30 Z" />
            </svg>

            {/* Panning Pupil center */}
            <motion.div
              animate={{
                x: [-3, 3, -3],
                y: [-1, 1, -1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3.5 h-3.5 rounded-full bg-blue-500 absolute flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            >
              {/* Highlight spot */}
              <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
            </motion.div>
          </motion.div>
        </div>

        {/* Up / down vertical scanning laser line */}
        <motion.div
          animate={{
            top: ['5%', '95%', '5%'],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent ${
            theme === 'light' ? 'via-blue-500' : 'via-cyan-400'
          } to-transparent shadow-[0_0_8px_#22d3ee] z-20 pointer-events-none`}
        />
      </div>
    );
  }

  // ==========================================
  // TYPE: FONTS (Morphing Letter-A Typography Icon)
  // ==========================================
  if (type === 'fonts') {
    return (
      <div id="icon-anim-fonts" className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 ${
        theme === 'light'
          ? 'bg-rose-50/70 border border-rose-200/80 text-rose-600'
          : 'bg-[#f43f5e]/10 border border-[#f43f5e]/20 text-[#f43f5e]'
      }`}>
        {/* Subtle grid background */}
        <div className={`absolute inset-0 opacity-15 bg-[size:10px_10px] ${
          theme === 'light'
            ? 'bg-[linear-gradient(to_right,rgba(244,63,94,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,63,94,0.15)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#f43f5e_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e_1px,transparent_1px)]'
        }`} />

        {/* Dynamic baseline metrics overlays */}
        <div className={`absolute w-[80%] h-[1px] top-[35%] z-0 ${theme === 'light' ? 'bg-rose-400/15' : 'bg-[#f43f5e]/30'}`} /> {/* Cap height */}
        <div className={`absolute w-[80%] h-[1px] top-[50%] z-0 border-dashed ${theme === 'light' ? 'bg-rose-450/15' : 'bg-[#f43f5e]/30'}`} /> {/* Meanline */}
        <div className={`absolute w-[80%] h-[1px] top-[65%] z-0 ${theme === 'light' ? 'bg-rose-450/30' : 'bg-[#f43f5e]/50'}`} /> {/* Baseline */}

        {/* Rotating compass/layout ring in back */}
        <div className={`absolute w-12 h-12 border-2 rounded-full animate-spin duration-[15000ms] ${
          theme === 'light' ? 'border-rose-300/20' : 'border-[#f43f5e]/10'
        }`} />
        
        {/* Dynamic Morphing Glyphs */}
        <div className={`relative h-11 w-12 flex items-center justify-center z-10 backdrop-blur-[1px] rounded p-1 border ${
          theme === 'light'
            ? 'bg-white border-rose-200/85 shadow-sm shadow-rose-100/50'
            : 'bg-slate-950/20 border-rose-500/10'
        }`}>
          <AnimatePresence mode="wait">
            <motion.span
              key={fontIndex}
              initial={{ scale: 0.7, opacity: 0, y: 4, filter: 'blur(3px)' }}
              animate={{ scale: [0.7, 1.1, 1], opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ scale: 1.2, opacity: 0, y: -4, filter: 'blur(3px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: fonts[fontIndex].fontFamily }}
              className={`select-none ${theme === 'light' ? 'text-rose-600 font-bold' : 'text-[#f43f5e]'} ${fonts[fontIndex].className} drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]`}
            >
              {['A', 'G', 'F', 'T'][fontIndex % 4]}
            </motion.span>
          </AnimatePresence>

          {/* Tiny vector node anchor dots - 100% dynamic, gliding, and pulsing */}
          <motion.div 
            animate={{ x: [-2, 2, -2], y: [-2, 2, -2], scale: [1, 1.3, 1] }} 
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -top-1.5 -left-1.5 w-2 h-2 rounded-sm border-2 border-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] ${
              theme === 'light' ? 'bg-white' : 'bg-[#fafafc]'
            }`} 
          />
          <motion.div 
            animate={{ x: [2, -2, 2], y: [2, -2, 2], scale: [1, 1.3, 1] }} 
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
            className={`absolute -bottom-1.5 -right-1.5 w-2 h-2 rounded-sm border-2 border-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] ${
              theme === 'light' ? 'bg-white' : 'bg-[#fafafc]'
            }`} 
          />
          <motion.div 
            animate={{ x: [2, -2, 2], y: [-2, 2, -2], scale: [1.2, 0.8, 1.2] }} 
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            className={`absolute -top-1.5 -right-1.5 w-2 h-2 rounded-sm border-2 border-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] ${
              theme === 'light' ? 'bg-white' : 'bg-[#fafafc]'
            }`} 
          />
          <motion.div 
            animate={{ x: [-2, 2, -2], y: [2, -2, 2], scale: [0.8, 1.2, 0.8] }} 
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.65 }}
            className={`absolute -bottom-1.5 -left-1.5 w-2 h-2 rounded-sm border-2 border-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)] ${
              theme === 'light' ? 'bg-white' : 'bg-[#fafafc]'
            }`} 
          />
        </div>

        {/* Type class indicator tag */}
        <div className={`absolute bottom-1.5 left-2.5 right-2.5 flex justify-between text-[6.5px] font-mono tracking-wider ${
          theme === 'light' ? 'text-rose-700 font-bold' : 'opacity-80 text-rose-300'
        }`}>
          <span>{fonts[fontIndex].name.toUpperCase()}</span>
          <span>100% VECTOR</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // TYPE: WATERMARK (Certificate Stamp with Glowing Ripple & Opacity Fade)
  // ==========================================
  if (type === 'watermark') {
    return (
      <div id="icon-anim-watermark" className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 ${
        theme === 'light'
          ? 'bg-purple-50/70 border border-purple-200/80 text-purple-600'
          : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
      }`}>
        {/* Subtle grid lines */}
        <div className={`absolute inset-0 opacity-15 bg-[size:10px_10px] ${
          theme === 'light'
            ? 'bg-[linear-gradient(to_right,rgba(168,85,247,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.15)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#a855f7_1px,transparent_1px),linear-gradient(to_bottom,#a855f7_1px,transparent_1px)]'
        }`} />

        {/* Miniature Document Page in the background */}
        <div className={`absolute w-[28px] h-[36px] rounded flex flex-col p-1 space-y-0.5 shadow-md transform -rotate-6 scale-95 opacity-60 transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border border-slate-200 shadow-sm'
            : 'bg-slate-900/80 border border-slate-700/50'
        }`}>
          <div className={`w-4 h-1 rounded-full ${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'}`} />
          <div className={`w-full h-[1px] ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`} />
          <div className={`w-full h-[1px] ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`} />
          <div className={`w-3/4 h-[1px] ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`} />
        </div>

        {/* Second Miniature Document Page slightly offset */}
        <div className={`absolute w-[28px] h-[36px] rounded flex flex-col p-1 space-y-0.5 shadow-md transform rotate-3 scale-100 z-0 transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-white border border-purple-200 shadow-sm shadow-purple-100'
            : 'bg-sky-950/40 border border-purple-900/40'
        }`}>
          <div className={`w-3 h-1 rounded-full ${theme === 'light' ? 'bg-purple-300' : 'bg-purple-500/30'}`} />
          <div className={`w-full h-[1px] ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-950/20'}`} />
          <div className={`w-full h-[1px] ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-950/20'}`} />
          <div className={`w-4/5 h-[1px] ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-950/20'}`} />
        </div>

        {/* Dynamic diagonal Text Watermark sliding behind the primary seal */}
        <motion.div
          animate={{
            opacity: [0.1, 0.45, 0.1],
            x: [-15, 15, -15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute text-[8px] font-mono tracking-widest font-bold uppercase select-none z-10 pointer-events-none transform -rotate-45 ${
            theme === 'light' ? 'text-purple-600/25' : 'text-purple-400/30'
          }`}
        >
          CONFIDENTIAL
        </motion.div>

        {/* Glowing concentric ripple waves representing the watermark alpha stamping key */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            animate={{ 
              scale: [0.6, 2.2], 
              opacity: [0.8, 0],
              borderWidth: ["1.5px", "0px"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="w-14 h-14 rounded-full border border-purple-400 absolute"
          />
          <motion.div
            animate={{ 
              scale: [0.6, 2.2], 
              opacity: [0.8, 0],
              borderWidth: ["1.5px", "0px"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
            className="w-14 h-14 rounded-full border border-pink-400 absolute"
          />
        </div>

        {/* Watermark Crest Stamp descending, locking, and rising */}
        <motion.div
          animate={{
            y: [-6, 3, -6],
            scale: [0.9, 1.15, 0.9],
            rotate: [0, 8, -8, 0]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center z-20 shadow-[0_0_12px_rgba(168,85,247,0.4)] relative transition-colors duration-300 ${
            theme === 'light'
              ? 'border-purple-400 bg-white shadow-purple-200'
              : 'border-purple-400/80 bg-slate-950/90'
          }`}
        >
          {/* Inner heraldic emblem crest lines */}
          <svg viewBox="0 0 100 100" className={`w-5 h-5 ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`} fill="none" stroke="currentColor" strokeWidth="10">
            <path d="M50,15 L80,30 L80,65 L50,85 L20,65 L20,30 Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="15" fill="currentColor" className="opacity-40" />
            <path d="M40,50 L47,57 L62,42" stroke={theme === 'light' ? '#7c3aed' : 'white'} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          {/* Glowing laser dots representing precise position anchors */}
          <div className="absolute -top-1 left-1.2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" />
          <div className="absolute -bottom-1 -right-0.5 w-1 h-1 bg-purple-400 rounded-full" />
        </motion.div>

        {/* Dynamic opacity slider simulation overlay at bottom */}
        <div className={`absolute bottom-1 left-2 right-2 h-1 rounded-full overflow-hidden border z-30 transition-colors duration-300 ${
          theme === 'light'
            ? 'bg-slate-200 border-slate-300/40 shadow-inner'
            : 'bg-slate-800/80 border-slate-700/30'
        }`}>
          <motion.div
            animate={{
              left: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-2.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_4px_#a855f7]"
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // TYPE: EXPORT (Interactive Compiler Loop)
  // ==========================================
  // TYPE: EXPORT (Interactive Compiler Loop)
  // ==========================================
  if (type === 'export') {
    const currentFormat = exportFormats[formatIndex % exportFormats.length];
    
    // Choose theme colors dynamically based on current output format
    const formatColors: Record<string, { border: string, text: string, textLight: string, bg: string, ring: string, halo: string, line: string, paperBg: string }> = {
      PDF: { 
        border: theme === 'light' ? 'border-rose-300' : 'border-rose-500/50', 
        text: theme === 'light' ? 'text-rose-700 font-extrabold' : 'text-rose-400', 
        textLight: 'text-rose-300', 
        bg: theme === 'light' ? 'bg-rose-50/50' : 'bg-rose-950/20',
        ring: '#f43f5e',
        halo: 'rgba(244,63,94,0.15)',
        line: theme === 'light' ? 'bg-slate-200' : 'bg-slate-800',
        paperBg: theme === 'light' ? 'bg-white shadow-[0_4px_12px_rgba(244,63,94,0.12)]' : 'bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.65)]'
      },
      JPG: { 
        border: theme === 'light' ? 'border-amber-300' : 'border-amber-500/50', 
        text: theme === 'light' ? 'text-amber-700 font-extrabold' : 'text-amber-400', 
        textLight: 'text-amber-200', 
        bg: theme === 'light' ? 'bg-amber-50/50' : 'bg-amber-950/20',
        ring: '#fbbf24',
        halo: 'rgba(251,191,36,0.15)',
        line: theme === 'light' ? 'bg-slate-200' : 'bg-slate-800',
        paperBg: theme === 'light' ? 'bg-white shadow-[0_4px_12px_rgba(251,191,36,0.12)]' : 'bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.65)]'
      },
      PNG: { 
        border: theme === 'light' ? 'border-purple-300' : 'border-purple-500/50', 
        text: theme === 'light' ? 'text-purple-700 font-extrabold' : 'text-purple-400', 
        textLight: 'text-purple-300', 
        bg: theme === 'light' ? 'bg-purple-50/50' : 'bg-purple-950/20',
        ring: '#a855f7',
        halo: 'rgba(168,85,247,0.15)',
        line: theme === 'light' ? 'bg-slate-200' : 'bg-slate-800',
        paperBg: theme === 'light' ? 'bg-white shadow-[0_4px_12px_rgba(168,85,247,0.12)]' : 'bg-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.65)]'
      }
    };
    
    const colorConfig = formatColors[currentFormat] || formatColors.PDF;

    return (
      <div id="icon-anim-export" className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 ${
        theme === 'light'
          ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
          : 'bg-slate-950/30 border border-slate-800/80 text-slate-100'
      }`}>
        {/* Subtle grid lines */}
        <div className={`absolute inset-0 opacity-15 bg-[size:8px_8px] ${
          theme === 'light'
            ? 'bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)]'
        }`} />

        {/* Ambient background pulsing halo corresponding to active compile layer */}
        <motion.div 
          animate={{
            scale: [0.8, 1.25, 0.8],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-24 h-24 rounded-full blur-2xl pointer-events-none z-0"
          style={{ backgroundColor: colorConfig.ring, opacity: 0.1 }}
        />

        {/* Compiled Document Frame popping up with format-specific status */}
        <motion.div
          key={currentFormat}
          animate={{
            y: [24, 0, 0, -28, 24],
            opacity: [0, 1, 1, 0, 0],
            scale: [0.85, 1, 1, 0.9, 0.85],
            rotateX: [15, 0, 0, -10, 15],
            rotateY: [-10, 0, 0, 10, -10]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: [0.25, 1, 0.5, 1]
          }}
          style={{ transformPerspective: '400px', borderTopColor: colorConfig.ring }}
          className={`absolute w-[38px] h-[48px] border ${colorConfig.border} ${colorConfig.paperBg} rounded-md p-1.5 flex flex-col justify-between border-t-[3px] z-10`}
        >
          {/* Header block with changing format type */}
          <div className="flex justify-between items-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorConfig.ring }} />
            <span className={`text-[6px] font-sans font-black ${colorConfig.text} tracking-wider`}>{currentFormat}</span>
          </div>
          
          {/* Content lines and active compiling flow state based on layout type */}
          {currentFormat === 'PDF' && (
            <div className="space-y-[3px] my-1 flex-1 flex flex-col justify-start relative w-full pt-1">
              {/* PDF Top Ribbon bookmark fold */}
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 rounded-bl-md border-l border-b border-rose-300 shadow-[1px_1px_2px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center">
                <span className="text-[3px] font-sans font-black text-white scale-[0.7] leading-none mb-[1px]">P</span>
              </div>
              
              {/* Compiling lines */}
              <motion.div 
                animate={{ width: ['40%', '80%', '40%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={`h-[1.5px] ${colorConfig.line} rounded-full`} 
              />
              <motion.div 
                animate={{ width: ['70%', '100%', '70%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className={`h-[1.5px] ${colorConfig.line} rounded-full`} 
              />
              <div className="flex space-x-0.5 items-center">
                <div className="w-1.5 h-[1.5px] bg-rose-500/60 rounded-full" />
                <motion.div 
                  animate={{ width: ['30%', '60%', '30%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className={`h-[1px] ${colorConfig.line} rounded-full flex-1`} 
                />
              </div>
              <div className={`w-[85%] h-[1.5px] ${colorConfig.line} rounded-full`} />
            </div>
          )}

          {currentFormat === 'JPG' && (
            <div className="my-[2px] flex-1 flex items-center justify-center overflow-hidden rounded relative border border-amber-500/25 w-full h-[18px] bg-gradient-to-b from-amber-500/10 to-transparent">
              {/* Crop brackets overlay in corners */}
              <div className="absolute inset-0.5 border border-dashed border-amber-500/30 rounded-[1.5px]" />
              <div className="absolute top-0.5 left-0.5 w-1 h-[1px] bg-amber-500" />
              <div className="absolute top-0.5 left-0.5 w-[1px] h-1 bg-amber-500" />
              <div className="absolute top-0.5 right-0.5 w-1 h-[1px] bg-amber-500" />
              <div className="absolute top-0.5 right-0.5 w-[1px] h-1 bg-amber-500" />
              <div className="absolute bottom-0.5 left-0.5 w-1 h-[1px] bg-amber-500" />
              <div className="absolute bottom-0.5 left-0.5 w-[1px] h-1 bg-amber-500" />
              <div className="absolute bottom-0.5 right-0.5 w-1 h-[1px] bg-amber-500" />
              <div className="absolute bottom-0.5 right-0.5 w-[1px] h-1 bg-amber-500" />

              {/* Landscape vector artwork */}
              <svg viewBox="0 0 24 16" className="w-full h-full text-amber-500/40 relative z-10 scale-90" fill="currentColor">
                <motion.polygon 
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  points="2,16 9,5 15,16" 
                />
                <motion.polygon 
                  animate={{ y: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  points="8,16 14,8 21,16" 
                  className="opacity-70 text-amber-500/30" 
                />
                <motion.circle 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  cx="16" cy="4" r="2.2" 
                  className="text-amber-500/60" 
                />
              </svg>

              {/* Shutter flash effect simulation */}
              <motion.div 
                animate={{ opacity: [0, 1, 0, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-white/40 z-20 pointer-events-none" 
              />
            </div>
          )}

          {currentFormat === 'PNG' && (
            <div className="my-[2px] flex-1 flex items-center justify-center overflow-hidden rounded relative border border-purple-500/25 w-full h-[18px]">
              {/* Designer transparency checkerboard grid background */}
              <div 
                className="absolute inset-0 opacity-[0.14] bg-[size:3px_3px]" 
                style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundPosition: '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
                }}
              />

              {/* Crop target vector overlays */}
              <div className="absolute inset-0.5 border border-dashed border-purple-500/30 rounded-[1.5px]" />
              <div className="absolute top-1 left-1.5 w-1.5 h-[1px] bg-purple-500/70" />
              <div className="absolute top-1 left-1.5 w-[1px] h-1.5 bg-purple-500/70" />
              <div className="absolute bottom-1 right-1.5 w-1.5 h-[1px] bg-purple-500/70" />
              <div className="absolute bottom-1 right-1.5 w-[1px] h-1.5 bg-purple-500/70" />

              {/* Transparent vector shape with rotating/pulsing ring */}
              <motion.svg 
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                viewBox="0 0 24 16" 
                className="w-full h-full text-purple-500/55 relative z-10 p-[1px]" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.75"
              >
                <circle cx="12" cy="8" r="4.5" strokeDasharray="2 1.5" />
              </motion.svg>

              <motion.div 
                animate={{ scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-2.5 h-2.5 rounded-sm bg-purple-500/25 border border-purple-500 z-10 flex items-center justify-center"
              >
                <div className="w-1 h-1 rounded-sm bg-purple-500" />
              </motion.div>

              {/* Shutter flash effect simulation */}
              <motion.div 
                animate={{ opacity: [0, 0, 1, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-white/40 z-20 pointer-events-none" 
              />
            </div>
          )}

          {/* Miniature signature stamp seal */}
          <div className="flex justify-between items-center">
            <span className="text-[4px] font-mono text-slate-500 scale-75 origin-left">HIGH DPI</span>
            <div className={`w-2 h-2 rounded-full ${colorConfig.bg} border ${colorConfig.border} flex items-center justify-center`}>
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: colorConfig.ring }} />
            </div>
          </div>
        </motion.div>

        {/* Dynamic laser scanning line reflecting active render thread */}
        <motion.div
          animate={{
            top: ['12%', '88%', '12%'],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.9)] z-20 pointer-events-none`}
        />

        {/* Loading compile circular ring overlay */}
        <svg className={`absolute w-[48px] h-[48px] transform -rotate-90 z-20 pointer-events-none ${
          theme === 'light' ? 'text-slate-200/80' : 'text-slate-800/80'
        }`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" fill="transparent" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke={colorConfig.ring}
            strokeWidth="6"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="263.89"
            animate={{
              strokeDashoffset: [263.89, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>

        {/* Radial success spark particles burst when document slides out */}
        <motion.div
          key={`burst-${currentFormat}`}
          animate={{
            scale: [0.5, 1.6],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
          className={`absolute w-14 h-14 rounded-full border border-dashed ${colorConfig.border} pointer-events-none z-10 shadow-[0_0_12px_rgba(255,255,255,0.15)]`}
        />

        {/* Moving download indicator arrow catching completed files */}
        <motion.div
          animate={{
            y: [-1, 3, -1],
            scale: [0.95, 1.15, 0.95]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1 right-1.5 z-30 text-sky-450"
        >
          <div className={`p-0.5 border rounded shadow-md flex items-center justify-center bg-gradient-to-br ${
            theme === 'light'
              ? 'bg-white border-slate-200/80 shadow-sm'
              : 'bg-slate-900 border border-slate-800/80 shadow-md from-slate-900 to-slate-950'
          }`}>
            <Download className="w-2.5 h-2.5 text-cyan-500 filter drop-shadow-[0_1px_3px_rgba(34,211,238,0.4)]" />
          </div>
        </motion.div>

        {/* Format indicators array bottom tab */}
        <div className="absolute bottom-1 left-2 flex space-x-1 justify-center items-center z-30 text-[5px] font-mono tracking-tighter">
          {exportFormats.map((fmt) => (
            <span 
              key={fmt} 
              className={`px-1 py-0.25 rounded-sm transition-all duration-300 ${
                currentFormat === fmt 
                  ? 'bg-sky-505 text-sky-600 font-extrabold border border-sky-300 shadow-sm' 
                  : 'text-slate-400 scale-90'
              }`}
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // TYPE: BACKGROUND (Cover Page Background Color Selection)
  // ==========================================
  if (type === 'background') {
    const bgColors = [
      '#ffffff', // Elegant White
      '#faf6ee', // Antique Cream
      '#eef6f8', // Ice Blue
      '#f0fcf4', // Mint Green
      '#1e293b', // Slate Dark
    ];
    return (
      <div id="icon-anim-background" className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 ${
        theme === 'light'
          ? 'bg-amber-50/70 border border-amber-200/80 text-amber-600'
          : 'bg-[#ffb020]/10 border border-[#ffb020]/20 text-[#ffb020]'
      }`}>
        {/* Subtle grid lines */}
        <div className={`absolute inset-0 opacity-15 bg-[size:10px_10px] ${
          theme === 'light'
            ? 'bg-[linear-gradient(to_right,rgba(251,191,36,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.15)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#ffb020_1px,transparent_1px),linear-gradient(to_bottom,#ffb020_1px,transparent_1px)]'
        }`} />

        {/* Dynamic miniature page that cycles colors */}
        <motion.div
          animate={{
            backgroundColor: bgColors,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute w-[30px] h-[38px] rounded border flex flex-col p-1.5 space-y-1 shadow-md z-10`}
          style={{ borderColor: theme === 'light' ? '#f59e0b' : '#ffb020' }}
        >
          {/* Mock lines on page */}
          <div className="w-4 h-1 bg-slate-400/40 rounded-full" />
          <div className="w-full h-[1.5px] bg-slate-350/20" />
          <div className="w-5/6 h-[1.5px] bg-slate-350/20" />
          <div className="w-full h-[1.5px] bg-slate-350/20" />
        </motion.div>

        {/* Color bubbles floating around the page like selection dots */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {[
            { color: '#fbbf24', delay: 0, x: -14, y: -12, scale: [0.8, 1.2, 0.8] }, // Amber
            { color: '#10b981', delay: 1.5, x: 14, y: 12, scale: [1, 0.7, 1] }, // Emerald
            { color: '#3b82f6', delay: 3, x: 14, y: -12, scale: [0.7, 1.1, 0.7] }, // Blue
            { color: '#ec4899', delay: 4.5, x: -14, y: 12, scale: [1.1, 0.8, 1.1] }, // Pink
          ].map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute w-3.5 h-3.5 rounded-full border border-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center"
              style={{
                backgroundColor: bubble.color,
                top: `calc(50% + ${bubble.y}px)`,
                left: `calc(50% + ${bubble.x}px)`,
              }}
              animate={{
                scale: bubble.scale,
                y: [0, -4, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: bubble.delay,
                ease: 'easeInOut',
              }}
            >
              {/* Central tick inside selection bubble to mimic selecting a color */}
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // TYPE: LAYOUT (Custom Template Builder with Moving Grid Blocks)
  // ==========================================
  if (type === 'layout') {
    return (
      <div id="icon-anim-layout" className={`w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 ${
        theme === 'light'
          ? 'bg-cyan-50/70 border border-cyan-200/80 text-cyan-600'
          : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
      }`}>
        {/* Subtle grid lines */}
        <div className={`absolute inset-0 opacity-15 bg-[size:10px_10px] ${
          theme === 'light'
            ? 'bg-[linear-gradient(to_right,rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.15)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)]'
        }`} />

        {/* Outer document blueprint border */}
        <div className={`absolute w-[44px] h-[52px] rounded-lg border-2 border-dashed flex flex-col justify-between p-1.5 transition-colors duration-300 ${
          theme === 'light' ? 'border-cyan-300 bg-white/60' : 'border-cyan-500/30 bg-slate-950/40'
        }`}>
          {/* Block 1 (Header/Logo Block) */}
          <motion.div
            animate={{
              y: [0, 24, 0],
              borderColor: ['rgba(6,182,212,0.3)', 'rgba(6,182,212,0.8)', 'rgba(6,182,212,0.3)'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-2.5 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-between px-1"
          >
            <div className="w-1.5 h-1 bg-cyan-500/40 rounded-sm" />
            <div className="w-3 h-0.5 bg-cyan-500/20 rounded-sm" />
          </motion.div>

          {/* Block 2 (Title Block) */}
          <motion.div
            animate={{
              scale: [1, 0.95, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-3 rounded border border-indigo-500/30 bg-indigo-500/5 flex flex-col justify-center space-y-0.5 px-1"
          >
            <div className="w-5 h-0.5 bg-indigo-500/30 rounded-full" />
            <div className="w-4 h-0.5 bg-indigo-500/15 rounded-full" />
          </motion.div>

          {/* Block 3 (Details / Footer Block) */}
          <motion.div
            animate={{
              y: [0, -24, 0],
              borderColor: ['rgba(6,182,212,0.3)', 'rgba(6,182,212,0.8)', 'rgba(6,182,212,0.3)'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-2.5 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center"
          >
            <div className="w-5 h-0.5 bg-cyan-500/35 rounded-full" />
          </motion.div>
        </div>

        {/* Drag and Drop gliding grabber handle cursor */}
        <motion.div
          animate={{
            x: [-12, 12, -12],
            y: [-12, 12, -12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute z-20 pointer-events-none"
        >
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-cyan-500 drop-shadow-[0_2px_4px_rgba(6,182,212,0.5)]" fill="currentColor">
            <path d="M4.5,10.5 L12,3 L19.5,10.5 M12,3 L12,21 M4.5,13.5 L12,21 L19.5,13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </motion.div>
      </div>
    );
  }

  return null;
}
