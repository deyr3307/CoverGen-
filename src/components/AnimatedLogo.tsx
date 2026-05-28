import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

interface AnimatedLogoProps {
  size?: 'large' | 'medium' | 'studio';
  interactive?: boolean;
  theme?: 'dark' | 'light';
}

export function AnimatedLogo({ size = 'large', interactive = true, theme = 'dark' }: AnimatedLogoProps) {
  // Compute container, icon, and text sizes based on prop
  // 'medium' is the header logo: configured .4x bigger than before per the user's request
  const sizeClasses = {
    large: {
      container: 'space-x-4 md:space-x-5',
      capBox: 'w-20 h-20 relative flex items-center justify-center',
      capIcon: 'w-12 h-12',
      text: 'text-4.5xl sm:text-5xl md:text-6xl tracking-wide',
      spacing: 'space-x-1.2',
      orbit1Size: 'w-24 h-24',
      orbit2Size: 'w-18 h-18',
      cx1: 48, cy1: 48, r1: 38,
      cx2: 36, cy2: 36, r2: 26,
    },
    medium: {
      container: 'space-x-4',
      // Adjusted exactly .4x bigger
      capBox: 'w-16 h-16 relative flex items-center justify-center',
      capIcon: 'w-10 h-10',
      text: 'text-3xl sm:text-4xl md:text-[2.75rem] tracking-tight font-black',
      spacing: 'space-x-[1.2px]',
      orbit1Size: 'w-20 h-20',
      orbit2Size: 'w-15 h-15',
      cx1: 40, cy1: 40, r1: 30,
      cx2: 30, cy2: 30, r2: 20,
    },
    studio: {
      container: 'space-x-2.5',
      capBox: 'w-10 h-10 relative flex items-center justify-center',
      capIcon: 'w-6 h-6',
      text: 'text-xl sm:text-2xl',
      spacing: 'space-x-[0.5px]',
      orbit1Size: 'w-12 h-12',
      orbit2Size: 'w-9 h-9',
      cx1: 24, cy1: 24, r1: 18,
      cx2: 18, cy2: 18, r2: 12,
    }
  }[size];

  // Letters of "CoverGen" split into Cover and Gen
  // We make Cover letters adaptive to light/dark themes
  const letters = [
    { char: 'C', color: theme === 'light' ? 'text-slate-900 font-extrabold' : 'text-white font-black' },
    { char: 'o', color: theme === 'light' ? 'text-slate-800 font-bold' : 'text-slate-100 font-bold' },
    { char: 'v', color: theme === 'light' ? 'text-slate-800 font-bold' : 'text-slate-100 font-bold' },
    { char: 'e', color: theme === 'light' ? 'text-slate-800 font-bold' : 'text-slate-105 text-slate-100 font-semibold' },
    { char: 'r', color: theme === 'light' ? 'text-slate-850 text-slate-800' : 'text-slate-200 font-semibold' },
    { char: 'G', color: 'bg-gradient-to-r from-[#fb923c] to-[#f97316] bg-clip-text text-transparent font-black shadow-sm' },
    { char: 'e', color: 'bg-gradient-to-r from-[#f97316] to-[#ea580c] bg-clip-text text-transparent font-black shadow-sm' },
    { char: 'n', color: 'bg-gradient-to-r from-[#ea580c] to-[#d97706] bg-clip-text text-transparent font-black shadow-sm' }
  ];

  // Infinite dynamic multi-phase sequence for graduation cap:
  const capAnimate = {
    y: [
      0, -7, 2, -5,         // Hover
      -9, -18, -9, 0,       // Circle path
      -3, 6, -3, 0,         // Sway
      -22, 6, -2, 0         // Jump
    ],
    x: [
      0, 3, -1, 0,          // Hover
      8, 0, -8, 0,          // Circle
      -5, 5, -5, 0,         // Sway
      0, 0, 0, 0            // Reset
    ],
    rotate: [
      0, 3, -3, 0,          // Hover
      90, 180, 270, 360,    // 360 Spin
      -18, 18, -18, 0,      // Sway
      8, -8, 3, 0           // Return
    ],
    scale: [
      1, 1.03, 0.97, 1,     // Hover
      1.08, 0.92, 1.08, 1,  // Circle
      1.05, 1.05, 0.95, 1,  // Sway
      0.78, 1.22, 0.94, 1   // Jump
    ]
  };

  return (
    <div className={`flex items-center ${sizeClasses.container} select-none`}>
      {/* ================= DYNAMIC GRADUATION CAP (HOLLOW OUTLINE SHAPE WITH 3D ORBIT SYSTEM) ================= */}
      <motion.div
        animate={capAnimate}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={interactive ? {
          scale: 1.25,
          rotate: [0, -20, 20, 0],
          transition: { duration: 0.8 }
        } : undefined}
        className={`${sizeClasses.capBox} cursor-pointer transform-gpu relative`}
      >
        {/* Soft, magical underlying backdrop glow that moves with the cap */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div 
            animate={{
              scale: [0.8, 1.2, 0.9, 1.3, 0.8],
              opacity: [0.15, 0.45, 0.25, 0.5, 0.15]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 blur-lg ${theme === 'light' ? 'opacity-10' : 'opacity-25'}`}
          />
        </div>

        {/* --- DYNAMIC ASTRO-COSMIC ORBITAL RINGS --- */}
        {/* Outer Orbit (Rotates Clockwise, Tilted at 65 degrees) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`${sizeClasses.orbit1Size} absolute text-[#f97316]/55 opacity-80`}
            style={{ transformStyle: 'preserve-3d', rotateX: '65deg', rotateY: '15deg' }}
            viewBox={`0 0 ${sizeClasses.cx1 * 2} ${sizeClasses.cy1 * 2}`}
          >
            <circle
              cx={sizeClasses.cx1}
              cy={sizeClasses.cy1}
              r={sizeClasses.r1}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeDasharray="6 5"
            />
          </motion.svg>
        </div>

        {/* Inner Counter Orbit (Rotates Counter-Clockwise, Tilted at -45 degrees) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.svg
            animate={{ rotate: -360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`${sizeClasses.orbit2Size} absolute text-[#f59e0b]/45 opacity-70`}
            style={{ transformStyle: 'preserve-3d', rotateX: '-45deg', rotateY: '-25deg' }}
            viewBox={`0 0 ${sizeClasses.cx2 * 2} ${sizeClasses.cy2 * 2}`}
          >
            <circle
              cx={sizeClasses.cx2}
              cy={sizeClasses.cy2}
              r={sizeClasses.r2}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
          </motion.svg>
        </div>

        {/* Floating Sparks/Stars around the cap */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div 
            animate={{ scale: [0.6, 1.2, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute -top-0.5 left-1/2 w-1.2 h-1.2 bg-yellow-400 rounded-full blur-[0.2px]"
          />
          <motion.div 
            animate={{ scale: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.4 }}
            className="absolute bottom-0 right-0.5 w-0.8 h-0.8 bg-orange-400 rounded-full blur-[0.1px]"
          />
          <motion.div 
            animate={{ scale: [0.5, 1.1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-amber-500 rounded-full blur-[0.1px]"
          />
        </motion.div>

        {/* The Cap Symbol - clean bold orange OUTLINE hollow shape matching the user's uploaded screenshot perfectly */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <GraduationCap 
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            className={`${sizeClasses.capIcon} text-[#f97316] filter drop-shadow-[0_2.5px_8px_rgba(249,115,22,0.8)] hover:text-[#fb923c] transition-colors`} 
          />
        </div>
      </motion.div>

      {/* ================= DYNAMIC SCRAMBLED & REASSEMBLED LITERARY TEXT ================= */}
      <div className={`flex items-center ${sizeClasses.spacing} font-image2 select-none`}>
        {letters.map((item, i) => {
          const spreadX = (i - 3.5) * (size === 'large' ? 12 : size === 'medium' ? 8 : 6); 
          const directionY = i % 2 === 0 ? -12 : 12;

          return (
            <motion.span
              key={i}
              className={`${item.color} ${sizeClasses.text} inline-block leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]`}
              animate={{
                x: [
                  0, 0,                         
                  spreadX * 1.2, spreadX * 0.7, 
                  spreadX * -0.3,               
                  0                             
                ],
                y: [
                  0, -2,                        
                  directionY * 1.1, directionY * -0.3, 
                  directionY * -0.8,            
                  directionY > 0 ? 20 : -20, 0  
                ],
                rotate: [
                  0, 2,                         
                  i % 2 === 0 ? 15 : -15,       
                  i % 2 === 0 ? -25 : 25,       
                  0                             
                ],
                scale: [
                  1, 1.02,                      
                  1.15, 0.85,                   
                  0.92,                         
                  1                             
                ],
                opacity: [
                  1, 1,                         
                  0.9, 0.95,                    
                  0.82, 0.96,                   
                  1                             
                ]
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05 
              }}
              whileHover={interactive ? {
                scale: 1.3,
                y: -6,
                rotate: i % 2 === 0 ? 10 : -10,
                transition: { type: 'spring', stiffness: 450, damping: 9 }
              } : undefined}
            >
              {item.char}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
