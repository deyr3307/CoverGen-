import React from 'react';
import { Sparkles, Eye, Type, Image as ImageIcon, Download, GraduationCap, Sun, Moon } from 'lucide-react';
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
}

export function LandingPage({ onGetStarted, onExploreFeatures, theme, setTheme }: LandingPageProps) {

  return (
    <div id="landing-page-root" className={`relative min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-[#fafafc] text-slate-800'
    }`}>
      
      {/* Dynamic tech-grid backdrop overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-45 transition-all duration-300"
        style={{
          backgroundImage: theme === 'dark' 
            ? `
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
          backgroundSize: '40px 40px',
        }}
      />
      
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

        {/* Description paragraph matching the font-serif look */}
        <p className={`font-serif text-lg md:text-xl max-w-2xl mb-12 leading-relaxed opacity-90 select-text transition-colors duration-300 ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Stop fighting with formatting. CoverGen helps you create beautifully structured assignment cover pages instantly.
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

      {/* ==================== FEATURES SECTION (Bento list layout) ==================== */}
      <section id="explore-features" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 flex flex-col space-y-12 pb-24 scroll-mt-24 md:scroll-mt-32">
        
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
