import React from 'react';
import { Sparkles, Eye, Type, Image as ImageIcon, Download, GraduationCap, Sun, Moon, Palette, Layout } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedLogo } from './AnimatedLogo';
import { LottieFeaturePlayer } from './LottieFeaturePlayer';

interface AnimatedFeatureHeadlineProps {
  text: string;
  theme: 'dark' | 'light';
  activeColorClass: string;
}

function AnimatedFeatureHeadline({ text, theme, activeColorClass }: AnimatedFeatureHeadlineProps) {
  // Split the text into words while keeping spaces
  const words = text.split(/(\s+)/);

  // Framer motion variants for each word
  const wordVariants = {
    hidden: { 
      opacity: 0, 
      x: -18,
      filter: 'blur(3px)'
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 90,
        delay: i * 0.08
      }
    }),
    hover: (i: number) => ({
      opacity: [1, 0, 1],
      x: [0, -14, 0],
      filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
      transition: {
        duration: 0.55,
        ease: 'easeInOut',
        delay: i * 0.08
      }
    })
  };

  return (
    <div
      role="heading"
      aria-level={3}
      className={`text-2xl font-bold tracking-tight transition-colors ${activeColorClass}`}
    >
      {words.map((word, idx) => {
        if (word.trim() === '') {
          return <span key={idx} className="inline-block">&nbsp;</span>;
        }

        return (
          <motion.span
            key={idx}
            custom={idx}
            variants={wordVariants}
            className="inline-block whitespace-nowrap"
            style={{ originX: 0 }}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  isInstallable?: boolean;
  onInstallApp?: () => void;
}

export function LandingPage({ 
  onGetStarted, 
  onExploreFeatures, 
  theme, 
  setTheme,
  isInstallable = false,
  onInstallApp
}: LandingPageProps) {

  return (
    <div id="landing-page-root" className={`relative min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#fafafc] text-slate-800'
    }`}>
      
      {/* Beautiful styled animation keyframes for moving grid */}
      <style>{`
        @keyframes slow-pulse {
          0%, 100% { opacity: 0.12; transform: scale(0.9) translate(-50%, -50%); }
          50% { opacity: 0.45; transform: scale(1.3) translate(-50%, -50%); }
        }
      `}</style>

      {/* Dynamic tech-grid backdrop overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-300">
        
        {/* Subtle base minor grid: 40px x 40px */}
        <div 
          className="absolute inset-0 opacity-[0.24] md:opacity-[0.28] transition-opacity duration-300"
          style={{
            backgroundImage: theme === 'dark' 
              ? `
                linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px)
              `
              : `
                linear-gradient(to right, rgba(99, 102, 241, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
              `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Master major grid: 200px x 200px */}
        <div 
          className="absolute inset-0 opacity-[0.38] transition-opacity duration-300"
          style={{
            backgroundImage: theme === 'dark' 
              ? `
                linear-gradient(to right, rgba(99, 102, 241, 0.08) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1.5px, transparent 1.5px)
              `
              : `
                linear-gradient(to right, rgba(99, 102, 241, 0.05) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1.5px, transparent 1.5px)
              `,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Flowing interconnecting animated line paths built out of pure responsive SVGs */}
        <div className="absolute inset-x-0 top-0 h-[2200px] opacity-35">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="horizontalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                <stop offset="30%" stopColor="#818cf8" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="verticalGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Animated flowing visual energy streams locked precisely to the 200px major grids */}
            <motion.path
              d="M 0 200 L 2400 200 M 0 600 L 2400 600 M 0 1000 L 2400 1000"
              fill="none"
              stroke="url(#horizontalGlow)"
              strokeWidth="1.5"
              strokeDasharray="160 380"
              animate={{
                strokeDashoffset: [0, -1620],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.path
              d="M 200 0 L 200 2200 M 800 0 L 800 2200 M 1400 0 L 1400 2200"
              fill="none"
              stroke="url(#verticalGlow)"
              strokeWidth="1.5"
              strokeDasharray="120 340"
              animate={{
                strokeDashoffset: [0, 1380],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* High-fidelity draftsmanship crosshairs matching engineering blue-prints */}
            {/* Coordinates for crossings: x=[200, 400, 600, 800, 1000, 1200, 1400], y=[200, 400, 600, 800, 1000] */}
            <g stroke={theme === 'dark' ? 'rgba(99, 102, 241, 0.28)' : 'rgba(99, 102, 241, 0.16)'} strokeWidth="1">
              {/* Row 1 Coordinate crosshairs */}
              <path d="M 194,200 L 206,200 M 200,194 L 200,206" />
              <path d="M 594,200 L 606,200 M 600,194 L 600,206" />
              <path d="M 994,200 L 1006,200 M 1000,194 L 1000,206" />
              <path d="M 1394,200 L 1406,200 M 1400,194 L 1400,206" />
              
              {/* Row 2 Coordinate crosshairs */}
              <path d="M 394,400 L 406,400 M 400,394 L 400,406" />
              <path d="M 794,400 L 806,400 M 800,394 L 800,406" />
              <path d="M 1194,400 L 1206,400 M 1200,394 L 1200,406" />

              {/* Row 3 Coordinate crosshairs */}
              <path d="M 194,600 L 206,600 M 200,594 L 200,606" />
              <path d="M 594,600 L 606,600 M 600,594 L 600,606" />
              <path d="M 994,600 L 1006,600 M 1000,594 L 1000,606" />
              <path d="M 1394,600 L 1406,600 M 1400,594 L 1400,606" />

              {/* Row 4 Coordinate crosshairs */}
              <path d="M 394,800 L 406,800 M 400,794 L 400,806" />
              <path d="M 794,800 L 806,800 M 800,794 L 800,806" />
              <path d="M 1194,800 L 1206,800 M 1200,794 L 1200,806" />

              {/* Row 5 Coordinate crosshairs */}
              <path d="M 194,1000 L 206,1000 M 200,994 L 200,1006" />
              <path d="M 594,1000 L 606,1000 M 600,994 L 600,1006" />
              <path d="M 994,1000 L 1006,1000 M 1000,994 L 1000,1006" />
              <path d="M 1394,1000 L 1406,1000 M 1400,994 L 1400,1006" />
            </g>

            {/* Glowing core bullet vertices */}
            <circle cx="200" cy="200" r="2.5" fill="#6366f1" />
            <circle cx="600" cy="200" r="2.5" fill="#a855f7" />
            <circle cx="1000" cy="200" r="2" fill="#818cf8" opacity="0.6" />
            <circle cx="1394" cy="200" r="2.5" fill="#22d3ee" />
            <circle cx="400" cy="400" r="2" fill="#818cf8" opacity="0.6" />
            <circle cx="800" cy="400" r="2.5" fill="#6366f1" />
            <circle cx="1200" cy="400" r="2" fill="#818cf8" opacity="0.6" />
            <circle cx="200" cy="600" r="2.5" fill="#22d3ee" />
            <circle cx="600" cy="600" r="2" fill="#818cf8" opacity="0.6" />
            <circle cx="1000" cy="600" r="3" fill="#a855f7" />
            <circle cx="1394" cy="600" r="2.5" fill="#6366f1" />
            <circle cx="400" cy="800" r="2.5" fill="#34d399" />
            <circle cx="800" cy="800" r="2" fill="#818cf8" opacity="0.6" />
            <circle cx="1200" cy="800" r="2.5" fill="#6366f1" />
          </svg>
        </div>

        {/* Moving ambient halo rings overlaid precisely on specific grid vertices */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Node 1: (200, 200) */}
          <div className="absolute w-8 h-8 rounded-full border border-indigo-500/30" style={{ left: '200px', top: '200px', transform: 'translate(-50%, -50%)', animation: 'slow-pulse 5s infinite ease-in-out' }} />
          {/* Node 2: (1000, 600) */}
          <div className="absolute w-10 h-10 rounded-full border border-purple-500/25" style={{ left: '1000px', top: '600px', transform: 'translate(-50%, -50%)', animation: 'slow-pulse 6s infinite ease-in-out', animationDelay: '1s' }} />
          {/* Node 3: (1394, 200) */}
          <div className="absolute w-8 h-8 rounded-full border border-cyan-400/30" style={{ left: '1394px', top: '200px', transform: 'translate(-50%, -50%)', animation: 'slow-pulse 4.5s infinite ease-in-out', animationDelay: '2s' }} />
          {/* Node 4: (400, 800) */}
          <div className="absolute w-9 h-9 rounded-full border border-emerald-400/25" style={{ left: '400px', top: '800px', transform: 'translate(-50%, -50%)', animation: 'slow-pulse 5.5s infinite ease-in-out', animationDelay: '0.7s' }} />
        </div>

        {/* Responsive, high-fidelity draftsmanship side rulers & metric scales */}
        <div className={`absolute inset-0 z-10 pointer-events-none text-[9px] font-mono select-none tracking-widest leading-none ${
          theme === 'dark' ? 'text-indigo-400/15' : 'text-indigo-500/10'
        }`}>
          {/* Top Horizontal Metric Scale / Ruler */}
          <div className="absolute top-0 left-0 right-0 h-8 border-b border-dashed border-indigo-500/5 px-4 flex items-end pb-1 overflow-hidden">
            <span className="mr-6 font-extrabold text-[8px] uppercase tracking-wider">X-Scale</span>
            <div className="flex-1 flex justify-between pr-12 relative h-5">
              {/* Generate ticks and coordinate markers at interval scales */}
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full">
                  <span className="text-[7.5px] font-mono">{(i * 100).toString().padStart(3, '0')}</span>
                  <div className={`w-[1px] h-2 bg-indigo-500/${i % 2 === 0 ? '30' : '15'} mt-0.5`} />
                </div>
              ))}
              {/* Animated sliding horizontal indicator gauge */}
              <motion.div
                animate={{ x: ['0%', '100%', '0%'] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 w-8 h-[2px] bg-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>

          {/* Left Vertical Metric Scale / Ruler */}
          <div className="absolute top-12 left-0 w-8 bottom-0 border-r border-dashed border-indigo-500/5 pt-4 flex flex-col items-center overflow-hidden">
            <span className="mb-6 font-extrabold text-[8px] uppercase tracking-wider [writing-mode:vertical-lr] rotate-180">Y-Scale</span>
            <div className="flex-1 flex flex-col justify-between pb-24 relative w-5">
              {/* Generate vertical ticks */}
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center justify-end w-full h-8">
                  <span className="text-[7.5px] font-mono mr-1">{(i * 100).toString().padStart(3, '0')}</span>
                  <div className={`h-[1px] w-2 bg-indigo-500/${i % 2 === 0 ? '30' : '15'}`} />
                </div>
              ))}
              {/* Animated sliding vertical indicator gauge */}
              <motion.div
                animate={{ y: ['0%', '100%', '0%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 w-[2px] h-8 bg-indigo-500/40 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>

          {/* Blueprint Engineering Metadata Block (Subtle corners) */}
          <div className="absolute bottom-6 left-12 flex flex-col space-y-1 text-[7.5px] uppercase tracking-widest opacity-80 font-mono">
            <div className="flex items-center space-x-2">
              <span className="h-1 w-1 bg-indigo-500/30 rounded-full animate-pulse" />
              <span>SYSTEM: READY</span>
            </div>
            <span>CANVAS_FORMAT: A4 STANDARD</span>
            <span>GRID_RES: 200px (40px SUB)</span>
          </div>

          <div className="absolute bottom-6 right-12 flex flex-col items-end space-y-1 text-[7.5px] uppercase tracking-widest opacity-80 font-mono">
            <span>SCALE: 1:1 INTUITIVE</span>
            <span>VECTOR: COMPLIANT</span>
            <span>FLOW: SYNTAX_OK</span>
          </div>
        </div>
      </div>
      
      {/* Radiant ambient lights */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/[0.04]'
      }`} />
      <div className={`absolute top-[50vh] right-[10%] w-[350px] h-[350px] rounded-full blur-[110px] pointer-events-none z-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-purple-500/5' : 'bg-purple-500/[0.03]'
      }`} />
      <div className={`absolute top-[80vh] left-[5%] w-[400px] h-[400px] rounded-full blur-[130px] pointer-events-none z-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-emerald-500/5' : 'bg-emerald-500/[0.02]'
      }`} />

      {/* ==================== LANDING HEADER ==================== */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center select-none -ml-2.5 sm:-ml-1">
          <AnimatedLogo size="medium" theme={theme} />
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {isInstallable && onInstallApp && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInstallApp}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  : 'bg-[#10b981] hover:bg-[#059669] text-white shadow-emerald-500/10'
              }`}
              title="Install App as PWA"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span>Install App</span>
            </motion.button>
          )}

          {/* STATEFUL THEME TOGGLER (SUN / MOON) */}
          <motion.button
            key={theme}
            initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center animate-pulse-glow hover:scale-[1.08] ${
              theme === 'dark' 
                ? 'bg-[#0f1423] hover:bg-[#161d31] border border-slate-800' 
                : 'bg-white hover:bg-[#fafafc] border border-slate-200/80 shadow-md'
            }`}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500 hover:text-amber-400 transition-colors animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 hover:text-indigo-800 transition-colors" />
            )}
          </motion.button>

          <button 
            onClick={onGetStarted}
            className="relative px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-xs sm:text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-500/10 hover:scale-[1.05] active:scale-[0.98] transition-all cursor-pointer overflow-hidden group animate-pulse-glow"
            id="gt-btn-1"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12 md:py-20 max-w-4xl mx-auto w-full">
        
        {/* Sparkly Badge */}
        <div className={`inline-flex items-center space-x-2.5 px-4 py-2 text-xs font-bold rounded-full mb-10 tracking-[0.08em] uppercase transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-[#0d1421] border border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/5'
            : 'bg-orange-50 border border-orange-200/85 text-orange-600 shadow-sm shadow-orange-500/5'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Cover Page Generator 2.0</span>
        </div>

        {/* Hero title mimicking handwritten typography with vertical animation */}
        <div className="flex flex-col items-center space-y-1 select-none leading-none mb-10">
          {[
            { text: "Craft", className: 'font-image1 ' + (theme === 'dark' ? 'text-white' : 'text-slate-900'), sizeClass: 'text-6xl md:text-8xl tracking-wide' },
            { text: "perfect", className: 'font-image1 ' + (theme === 'dark' ? 'text-slate-100' : 'text-slate-800'), sizeClass: 'text-5xl md:text-7xl tracking-wide' },
            { 
              text: "cover", 
              className: 'font-image1 bg-gradient-to-r from-[#fa8c35] via-[#f43f5e] to-[#fa8c35] bg-clip-text text-transparent select-none bg-[length:200%_auto] animate-gradient', 
              style: { WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' },
              sizeClass: 'text-6xl md:text-8xl tracking-tight',
              isGradient: true
            },
            { 
              text: "pages", 
              className: 'font-image1 bg-gradient-to-r from-[#c084fc] via-[#3b82f6] to-[#c084fc] bg-clip-text text-transparent select-none bg-[length:200%_auto] animate-gradient', 
              style: { WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' },
              sizeClass: 'text-6xl md:text-8xl tracking-tight',
              isGradient: true
            },
            { text: "in seconds.", className: 'font-image1 ' + (theme === 'dark' ? 'text-[#ffffff]' : 'text-slate-900'), sizeClass: 'text-5xl md:text-7xl tracking-wide' }
          ].map((item: any, idx) => (
            <div key={idx} className="overflow-hidden py-1 flex items-center justify-center">
              <motion.h1
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "tween",
                  ease: [0.16, 1, 0.3, 1], // sudden snap to instant stand-still
                  duration: 0.65,
                  delay: idx * 0.12
                }}
                className={`py-1 text-center ${item.isGradient ? '' : 'transition-colors duration-300'} ${item.sizeClass} ${item.className}`}
                style={{ display: 'inline-block', ...(item.style || {}) }}
              >
                {item.text}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Description paragraph matching the font-serif look with slow staggered reveal */}
        <p className={`font-serif text-lg md:text-xl max-w-2xl mb-12 leading-relaxed opacity-90 select-text transition-colors duration-300 ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {"Stop fighting with formatting. CoverGen helps you create beautifully structured assignment cover pages instantly.".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(2px)', y: 4 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.6 + index * 0.08, // Starts after hero title lines slide in, showing up word by word
                ease: 'easeOut'
              }}
              className="inline-block mr-1.5"
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col items-center space-y-5 w-full max-w-md">
          <button 
            onClick={onGetStarted}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-505 hover:to-purple-500 text-white font-bold text-sm tracking-wider shadow-xl hover:scale-[1.03] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center border border-white/10 animate-pulse-glow"
          >
            Open Studio &nbsp; ➜
          </button>
          
          <button 
            onClick={onExploreFeatures}
            className={`w-full py-4 rounded-full font-bold text-sm tracking-wider border transition-all cursor-pointer flex items-center justify-center shadow-md ${
              theme === 'dark'
                ? 'bg-[#0a0d16]/75 hover:bg-[#111624]/80 text-white border-slate-800 hover:border-slate-700 shadow-black/20'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300 shadow-slate-100'
            }`}
          >
            Explore Features
          </button>

          {/* Indicators row */}
          <div className="flex items-center justify-center space-x-6 pt-4 text-xs select-none">
            <span className={`flex items-center font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              No sign up required
            </span>
            <span className={`flex items-center font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-[#f97316] mr-2" />
              100% Free forever
            </span>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="explore-features" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 flex flex-col space-y-12 pb-24 scroll-mt-24 md:scroll-mt-32">
        
        <div className="text-center space-y-3 mb-4">
          <h2 className={`font-serif text-3xl md:text-5xl tracking-normal font-bold transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Designed with Absolute Precision
          </h2>
          <p className={`text-sm md:text-base max-w-xl mx-auto opacity-75 transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Every interaction is custom-tuned to give you full aesthetic command of your academic outputs.
          </p>
        </div>

        {/* Responsive 3-column features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* Real-time preview card - BLUE highlight */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover="hover"
            className={`relative rounded-3xl p-8 border shadow-xl overflow-hidden group transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#0d1017]/90 border-slate-900/40 hover:border-blue-500/30'
                : 'bg-white border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Accent top gradient glow stroke */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-sky-400 to-transparent" />
            
            <div className="flex flex-col space-y-6">
              {/* Direct Animated Icon container */}
              <div className="w-14 h-14 flex items-center justify-center">
                <LottieFeaturePlayer type="preview" theme={theme} />
              </div>

              <div className="space-y-3">
                <AnimatedFeatureHeadline 
                  text="Live Preview" 
                  theme={theme} 
                  activeColorClass={theme === 'dark' ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'} 
                />
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Real-time A4 canvas updates instantly. What you see is exactly what gets exported.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Custom fonts card - PINK highlight */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover="hover"
            className={`relative rounded-3xl p-8 border shadow-xl overflow-hidden group transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#0d1017]/90 border-slate-900/40 hover:border-pink-500/30'
                : 'bg-white border-slate-200/90 hover:border-pink-400 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ec4899] via-[#f43f5e] to-transparent" />
            
            <div className="flex flex-col space-y-6">
              {/* Direct Animated Icon container */}
              <div className="w-14 h-14 flex items-center justify-center">
                <LottieFeaturePlayer type="fonts" theme={theme} />
              </div>

              <div className="space-y-3">
                <AnimatedFeatureHeadline 
                  text="Custom Fonts" 
                  theme={theme} 
                  activeColorClass={theme === 'dark' ? 'text-pink-400 group-hover:text-pink-300' : 'text-pink-600 group-hover:text-pink-700'} 
                />
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Granular typography controls with premium academic and modern serif/sans-serif fonts.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Watermarks card - PURPLE highlight */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover="hover"
            className={`relative rounded-3xl p-8 border shadow-xl overflow-hidden group transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#0d1017]/90 border-slate-900/40 hover:border-purple-500/30'
                : 'bg-white border-slate-200/90 hover:border-purple-400 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-transparent" />
            
            <div className="flex flex-col space-y-6">
              {/* Direct Animated Icon container */}
              <div className="w-14 h-14 flex items-center justify-center">
                <LottieFeaturePlayer type="watermark" theme={theme} />
              </div>

              <div className="space-y-3">
                <AnimatedFeatureHeadline 
                  text="Watermarks" 
                  theme={theme} 
                  activeColorClass={theme === 'dark' ? 'text-purple-400 group-hover:text-purple-300' : 'text-purple-600 group-hover:text-purple-700'} 
                />
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Advanced magic background eraser and precision positioning for flawless university logos.
                </p>
              </div>
            </div>
          </motion.div>

          {/* High-Quality Export card - GREEN highlight */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover="hover"
            className={`relative rounded-3xl p-8 border shadow-xl overflow-hidden group transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#0d1017]/90 border-slate-900/40 hover:border-emerald-500/30'
                : 'bg-white border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#10b981] via-[#34d399] to-transparent" />
            
            <div className="flex flex-col space-y-6">
              {/* Direct Animated Icon container */}
              <div className="w-14 h-14 flex items-center justify-center">
                <LottieFeaturePlayer type="export" theme={theme} />
              </div>

              <div className="space-y-3">
                <AnimatedFeatureHeadline 
                  text="High-Quality Export" 
                  theme={theme} 
                  activeColorClass={theme === 'dark' ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-700'} 
                />
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Download pixel-perfect, high-fidelity PDF, PNG, or JPG files format completely offline.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cover Page Background Color Selection card - AMBER highlight */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover="hover"
            className={`relative rounded-3xl p-8 border shadow-xl overflow-hidden group transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#0d1017]/90 border-slate-900/40 hover:border-amber-500/30'
                : 'bg-white border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-transparent" />
            
            <div className="flex flex-col space-y-6">
              {/* Custom Palette Feature Icon Player */}
              <div className="w-14 h-14 flex items-center justify-center">
                <LottieFeaturePlayer type="background" theme={theme} />
              </div>

              <div className="space-y-3">
                <AnimatedFeatureHeadline 
                  text="Background Color Selection" 
                  theme={theme} 
                  activeColorClass={theme === 'dark' ? 'text-amber-400 group-hover:text-amber-300' : 'text-amber-600 group-hover:text-amber-700'} 
                />
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Set beautiful tone palettes for your document backgrounds, from sterile white to classic vintage and modern slate textures.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Custom Template Builder card - CYAN highlight */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            whileHover="hover"
            className={`relative rounded-3xl p-8 border shadow-xl overflow-hidden group transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-[#0d1017]/90 border-slate-900/40 hover:border-cyan-500/30'
                : 'bg-white border-slate-200/90 hover:border-cyan-400 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-sky-400 to-transparent" />
            
            <div className="flex flex-col space-y-6">
              {/* Custom Layout Feature Icon Player */}
              <div className="w-14 h-14 flex items-center justify-center">
                <LottieFeaturePlayer type="layout" theme={theme} />
              </div>

              <div className="space-y-3">
                <AnimatedFeatureHeadline 
                  text="Custom Template Builder" 
                  theme={theme} 
                  activeColorClass={theme === 'dark' ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-600 group-hover:text-cyan-700'} 
                />
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Construct bespoke templates with drag-and-drop hierarchy. Toggle, arrange, and design elements to meet any dynamic cover design requirements.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className={`relative z-10 w-full max-w-7xl mx-auto px-6 py-10 text-center text-xs mt-auto transition-colors duration-300 ${
        theme === 'dark' ? 'border-t border-slate-900 text-slate-500' : 'border-t border-slate-100 text-slate-400'
      }`}>
        <p className="select-text">© 2026 CoverGen - Professional Assignment Cover Page Generator</p>
      </footer>

    </div>
  );
}
