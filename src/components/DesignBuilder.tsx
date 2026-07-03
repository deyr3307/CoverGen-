import React, { useState } from 'react';
import { CoverPageDesign, STANDARD_FONTS, FontConfig, CoverPageData, DEFAULT_DESIGN } from '../types';
import { LOGO_PRESETS, WATERMARK_PRESETS } from '../presets';
import { SingleFontEditor } from './SingleFontEditor';
import { CoverDocument } from './CoverDocument';
import { ensureSupportedFormat, preprocessImageForApi } from '../utils';
import { 
  AnimatedTemplatesIcon, 
  AnimatedFontsIcon, 
  AnimatedBordersIcon, 
  AnimatedBrandingIcon 
} from './AnimatedTabIcons';
import { 
  Type, 
  Shield, 
  Sliders, 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  QrCode, 
  LayoutGrid, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Eye,
  Settings,
  Trash2,
  Save,
  Plus,
  Bookmark,
  FileText,
  Tag,
  Hash,
  Cpu,
  BookOpen,
  Compass,
  UserCheck,
  Briefcase,
  Users,
  IdCard,
  CalendarDays,
  CalendarCheck,
  Award,
  GraduationCap,
  School,
  X,
  ZoomIn,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FontSelectorDropdownProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
  inputClass: string;
}

export function FontSelectorDropdown({ value, onChange, isDark, inputClass }: FontSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeFont = STANDARD_FONTS.find(f => f.value === value) || STANDARD_FONTS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-xs rounded-xl px-3.5 py-2.5 transition-all flex items-center justify-between border cursor-pointer text-left ${inputClass}`}
      >
        <span style={{ fontFamily: activeFont.value }} className="text-xs font-semibold truncate">
          {activeFont.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
          <div className={`absolute left-0 right-0 mt-1.5 z-50 rounded-xl p-1.5 shadow-2xl border max-h-56 overflow-y-auto space-y-0.5 font-sans ${
            isDark 
              ? 'bg-[#0a0d18] border-[#1f2947] text-slate-200 scrollbar-thin scrollbar-thumb-slate-800' 
              : 'bg-white border-slate-200 text-slate-800 shadow-xl scrollbar-thin scrollbar-thumb-slate-200'
          }`}>
            {STANDARD_FONTS.map(f => {
              const isSelected = f.value === value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    onChange(f.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-indigo-650/40 text-indigo-300 border border-indigo-500/40'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                      : isDark
                        ? 'hover:bg-slate-800/80 border border-transparent text-slate-300'
                        : 'hover:bg-slate-100/80 border border-transparent text-slate-700'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono text-slate-400/90 tracking-wider font-semibold uppercase leading-tight select-none">
                      {f.name}
                    </span>
                    <span 
                      style={{ fontFamily: f.value }} 
                      className={`text-[13px] mt-0.5 leading-normal ${
                        isSelected 
                          ? 'text-indigo-400 font-bold' 
                          : isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {f.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

interface TemplateThumbnailProps {
  id: 'ku' | 'du-classic' | 'du-minimal' | 'jnu' | 'ruet' | 'jnu-finance' | 'presidency' | 'jnu-traditional' | 'teal-bars' | 'ku-law-table' | 'cu-boxed-code' | 'top-header-asymmetric';
  isSelected: boolean;
  isDark: boolean;
  large?: boolean;
}

export function TemplateThumbnail({ id, isSelected, isDark, large = false }: TemplateThumbnailProps) {
  let borderClass = 'border-slate-350';
  let borderStyles: React.CSSProperties = {};
  let accentBarColor = '#1e3a8a';
  let logoColor = '#1e3a8a';
  let hasWatermark = false;
  let topBarColor = '';
  let bottomBarColor = '';

  if (id === 'du-classic') {
    borderClass = isSelected ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-blue-900/40 dark:border-blue-800/40';
    borderStyles = { borderStyle: 'solid', borderWidth: large ? '4px' : '2.5px' };
    accentBarColor = '#1e3a8a';
    logoColor = '#dc2626'; // red crest
  } else if (id === 'du-minimal') {
    borderClass = isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-400 dark:border-slate-705';
    borderStyles = { borderStyle: 'solid', borderWidth: '1px' };
    accentBarColor = '#1e293b';
    logoColor = '#1e3a8a';
  } else if (id === 'jnu') {
    borderClass = isSelected ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-[#be123c]/40 dark:border-[#be123c]/30';
    borderStyles = { borderStyle: 'double', borderWidth: large ? '5px' : '3.5px' };
    accentBarColor = '#be123c';
    logoColor = '#be123c';
  } else if (id === 'jnu-finance') {
    borderClass = isSelected ? 'border-sky-500 ring-1 ring-sky-500/20' : 'border-slate-300 dark:border-slate-800';
    borderStyles = { borderStyle: 'solid', borderWidth: '1px' };
    accentBarColor = '#1e3a8a';
    logoColor = '#15803d'; // green accents
  } else if (id === 'ruet') {
    borderClass = isSelected ? 'border-amber-500 ring-1 ring-amber-500/20' : 'border-orange-500/40 dark:border-orange-500/30';
    borderStyles = { borderStyle: 'solid', borderWidth: '1.5px' };
    accentBarColor = '#0284c7';
    logoColor = '#f97316';
    hasWatermark = true;
  } else if (id === 'ku') {
    borderClass = isSelected ? 'ring-2 ring-sky-500 ring-offset-1' : 'border border-slate-200/60 dark:border-slate-800/60';
    borderStyles = { borderStyle: 'none' };
    accentBarColor = '#0284c7';
    logoColor = '#0284c7';
  } else if (id === 'presidency') {
    borderClass = isSelected ? 'border-blue-600 ring-1 ring-blue-500/30' : 'border-blue-700/50 dark:border-blue-800/50';
    borderStyles = { borderStyle: 'double', borderWidth: large ? '5px' : '3px' };
    accentBarColor = '#2563eb';
    logoColor = '#b91c1c';
  } else if (id === 'jnu-traditional') {
    borderClass = isSelected ? 'border-slate-800 ring-1 ring-slate-800/25' : 'border-slate-300 dark:border-slate-800';
    borderStyles = { borderStyle: 'solid', borderWidth: '1px' };
    accentBarColor = '#000000';
    logoColor = '#be123c';
  } else if (id === 'teal-bars') {
    borderClass = isSelected ? 'border-cyan-500 ring-1 ring-cyan-550/20' : 'border-slate-300 dark:border-slate-800';
    borderStyles = { borderStyle: 'solid', borderWidth: '1px' };
    accentBarColor = '#0891b2';
    logoColor = '#0891b2';
    topBarColor = '#0891b2';
    bottomBarColor = '#0891b2';
  } else if (id === 'ku-law-table') {
    borderClass = isSelected ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-250 dark:border-slate-800';
    borderStyles = { borderStyle: 'solid', borderWidth: '1.5px' };
    accentBarColor = '#2563eb';
    logoColor = '#ea580c';
  } else if (id === 'cu-boxed-code') {
    borderClass = isSelected ? 'border-yellow-600 ring-1 ring-yellow-500/20' : 'border-slate-300 dark:border-slate-800';
    borderStyles = { borderStyle: 'solid', borderWidth: '1px' };
    accentBarColor = '#000000';
    logoColor = '#1e293b';
  } else if (id === 'top-header-asymmetric') {
    borderClass = isSelected ? 'border-red-600 ring-1 ring-red-500/20' : 'border-slate-250 dark:border-slate-800';
    borderStyles = { borderStyle: 'solid', borderWidth: '1px' };
    accentBarColor = '#1e3a8a';
    logoColor = '#8b0000';
  }

  const paperBg = isDark ? 'bg-[#0b0f19]' : 'bg-white';

  return (
    <div 
      className={`relative rounded-lg shadow-md shrink-0 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        large ? 'w-[140px] h-[192px] p-3 shadow-lg' : 'w-[60px] h-[82px] p-1.5'
      } ${paperBg} ${borderClass}`}
      style={borderStyles}
    >
      {/* Top and bottom accent bars for teal-bars like layouts */}
      {topBarColor && (
        <div className="absolute top-0 left-0 right-0 z-20 transition-all duration-300" style={{ backgroundColor: topBarColor, height: large ? '12px' : '6px' }} />
      )}
      {bottomBarColor && (
        <div className="absolute bottom-0 left-0 right-0 z-20 transition-all duration-300" style={{ backgroundColor: bottomBarColor, height: large ? '12px' : '6px' }} />
      )}

      {/* Background gear watermark for RUET */}
      {hasWatermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className={`rounded-full border border-dashed border-orange-500 ${large ? 'w-24 h-24' : 'w-10 h-10'}`}
          />
        </div>
      )}

      {/* Mini Header / Crest representation */}
      <div className={`flex flex-col items-center z-10 ${large ? 'space-y-1.5' : 'space-y-0.5'}`}>
        {/* Tiny logo */}
        <div 
          className={`rounded-full flex items-center justify-center animate-pulse ${large ? 'w-6 h-6' : 'w-2.5 h-2.5'}`}
          style={{ backgroundColor: logoColor }}
        >
          <div className={`bg-white rounded-full opacity-70 ${large ? 'w-2.5 h-2.5' : 'w-[3.5px] h-[3.5px]'}`} />
        </div>
        
        {/* Subtitle/document type line */}
        <div className={`bg-slate-300 dark:bg-slate-700 rounded-sm ${large ? 'w-16 h-[4px]' : 'w-8 h-[2px]'}`} />
      </div>

      {/* Main Topic / Title space */}
      <div className={`flex flex-col items-center z-10 w-full ${large ? 'space-y-2 px-3' : 'space-y-1 px-1'}`}>
        {/* Dual Accent Bars representing Title */}
        <div className="w-full rounded-sm" style={{ backgroundColor: accentBarColor, height: large ? '6px' : '3px' }} />
        <div className="w-4/5 rounded-sm opacity-80" style={{ backgroundColor: accentBarColor, height: large ? '4px' : '2px' }} />
        <div className={`w-3/5 bg-slate-200 dark:bg-slate-800 rounded opacity-60 ${large ? 'h-[3px]' : 'h-[2px]'}`} />
      </div>

      {/* Bottom details block (Traditional vs Dual Column vs Offset) */}
      <div className="w-full z-10">
        {id === 'du-minimal' ? (
          /* Dual columns side by side */
          <div className="flex justify-between px-0.5 w-full">
            <div className={`w-[45%] ${large ? 'space-y-[4px]' : 'space-y-[2px]'}`}>
              <div className={`w-full bg-slate-300 dark:bg-slate-700 rounded ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
              <div className={`w-4/5 bg-slate-200 dark:bg-slate-800 rounded ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
            </div>
            <div className={`whitespace-nowrap w-[45%] ${large ? 'space-y-[4px]' : 'space-y-[2px]'}`}>
              <div className={`w-full bg-slate-300 dark:bg-slate-700 rounded ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
              <div className={`w-4/5 bg-slate-200 dark:bg-slate-800 rounded ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
            </div>
          </div>
        ) : id === 'ruet' ? (
          /* Tech design with a dividing line down/bottom alignment */
          <div className={`w-full flex flex-col items-center ${large ? 'space-y-[6px]' : 'space-y-[3px]'}`}>
            <div className={`w-full bg-orange-500/20 ${large ? 'h-[1px]' : 'h-[0.5px]'}`} />
            <div className="w-full flex justify-between px-0.5">
              <div className={`w-[45%] bg-slate-300 dark:bg-slate-700 rounded ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
              <div className={`w-[45%] bg-slate-300 dark:bg-slate-700 rounded ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
            </div>
          </div>
        ) : id === 'ku-law-table' ? (
          /* Table miniature representation */
          <div className="border border-slate-300 dark:border-slate-700 rounded-[2px] overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
            <div className={`bg-slate-200 dark:bg-slate-850 flex border-b border-slate-350 dark:border-slate-700 ${large ? 'h-[6px]' : 'h-[3px]'}`}>
              <div className="w-1/2 border-r border-slate-300 dark:border-slate-700 h-full" />
              <div className="w-1/2 h-full" />
            </div>
            <div className={`flex ${large ? 'h-5' : 'h-2.5'}`}>
              <div className={`w-1/2 border-r border-slate-300 dark:border-slate-700 p-[1px] ${large ? 'space-y-[2px]' : 'space-y-[1px]'}`}>
                <div className={`w-full bg-slate-400 opacity-60 rounded ${large ? 'h-[2px]' : 'h-[0.8px]'}`} />
                <div className={`w-3/4 bg-slate-300 rounded ${large ? 'h-[2px]' : 'h-[0.8px]'}`} />
              </div>
              <div className={`w-1/2 p-[1px] ${large ? 'space-y-[2px]' : 'space-y-[1px]'}`}>
                <div className={`w-full bg-slate-400 opacity-60 rounded ${large ? 'h-[2px]' : 'h-[0.8px]'}`} />
                <div className={`w-3/4 bg-slate-300 rounded ${large ? 'h-[2px]' : 'h-[0.8px]'}`} />
              </div>
            </div>
          </div>
        ) : id === 'cu-boxed-code' ? (
          /* Chittagong double boxes courses and colons list list */
          <div className="space-y-0.5 flex flex-col items-center py-0.5">
            <div className={`border border-slate-300 dark:border-slate-700 flex items-center justify-center rounded-[1px] bg-slate-50 dark:bg-slate-900 ${large ? 'w-5/6 h-[8px]' : 'w-5/6 h-[4px]'}`}>
              <div className={`bg-slate-400 ${large ? 'w-[25px] h-[1px]' : 'w-[10px] h-[0.5px]'}`} />
            </div>
            <div className={`border border-slate-300 dark:border-slate-700 flex items-center justify-center rounded-[1px] bg-slate-50 dark:bg-slate-900 ${large ? 'w-5/6 h-[8px]' : 'w-5/6 h-[4px]'}`}>
              <div className={`bg-slate-400 ${large ? 'w-[30px] h-[1px]' : 'w-[12px] h-[0.5px]'}`} />
            </div>
          </div>
        ) : id === 'top-header-asymmetric' ? (
          /* Staggered asymmetric mini representation */
          <div className={`flex flex-col w-full px-0.5 relative ${large ? 'space-y-[6px]' : 'space-y-[3px]'}`}>
            {/* Left/teacher element */}
            <div className="w-[55%] flex flex-col space-y-[1px] self-start items-start">
              <div className={`bg-slate-455 dark:bg-slate-500 rounded ${large ? 'w-[25px] h-[3px]' : 'w-[12px] h-[1.2px]'}`} />
              <div className={`bg-slate-300 dark:bg-slate-750 rounded ${large ? 'w-[30px] h-[2px]' : 'w-[14px] h-[0.8px]'}`} />
            </div>
            {/* Right/student element staggered down */}
            <div className="w-[55%] flex flex-col space-y-[1px] self-end items-end pt-1">
              <div className={`bg-slate-455 dark:bg-slate-500 rounded ${large ? 'w-[25px] h-[3px]' : 'w-[12px] h-[1.2px]'}`} />
              <div className={`bg-slate-300 dark:bg-slate-750 rounded ${large ? 'w-[35px] h-[2px]' : 'w-[16px] h-[0.8px]'}`} />
            </div>
          </div>
        ) : (
          /* Classic centered stack or standard rows */
          <div className={`flex flex-col items-center w-full ${large ? 'space-y-[4px]' : 'space-y-[2px]'}`}>
            <div className={`w-11/12 bg-slate-300 dark:bg-slate-755 rounded-sm ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
            <div className={`w-3/4 bg-slate-250 dark:bg-slate-800 rounded-sm ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
            <div className={`w-1/2 bg-slate-200 dark:bg-slate-850 rounded-sm ${large ? 'h-[3px]' : 'h-[1.5px]'}`} />
          </div>
        )}
      </div>
    </div>
  );
}

interface AnimatedTopicIconProps {
  id: string;
  isDark: boolean;
}

export function AnimatedTopicIcon({ id, isDark }: AnimatedTopicIconProps) {
  switch (id) {
    case 'university': // 1. University / Institution Name
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-800 border border-green-100'
        }`}>
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <School className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-green-500/10 rounded-full blur-xs"
          />
        </div>
      );

    case 'discipline': // Discipline / Department
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-[#fa8072]/15 text-[#fa8072]' : 'bg-[#fff0eb] text-[#d95d39] border border-[#fbdcd0]'
        }`}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#fa8072]/20 rounded-full blur-sm"
          />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <GraduationCap className="w-4 h-4" />
          </motion.div>
        </div>
      );

    case 'assignmentTopic': // 1. Assignment Topic Header
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600 border border-blue-100'
        }`}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"
          />
          <motion.div
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <FileText className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ 
              x: [-1, 2, -1],
              y: [1, -2, 1],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full border flex items-center justify-center z-20 ${
              isDark ? 'bg-blue-400 border-blue-500' : 'bg-blue-600 border-blue-300'
            }`}
          />
        </div>
      );

    case 'topicTitle': // 2. Main Topic Title Banner
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          <motion.div
            animate={{ 
              scale: [0.95, 1.1, 0.95],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <Tag className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1 left-1.5 text-amber-300"
          >
            <Sparkles className="w-2.5 h-2.5" />
          </motion.div>
        </div>
      );

    case 'courseNoHeading': // 3. Course Number Label
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600 border border-rose-100'
        }`}>
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              x: [-0.5, 0.5, -0.5]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <Hash className="w-4 h-4" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0.5 flex justify-between px-1.5 opacity-25 text-[5px] font-mono select-none">
            <span className="self-start animate-pulse">0</span>
            <span className="self-end animate-pulse delay-100">1</span>
          </div>
        </div>
      );

    case 'courseNoContent': // 4. Course Code Value
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-[#556b2f]/10 text-[#a9b08f]' : 'bg-[#f4f5f0] text-[#556b2f] border border-[#e1e3da]'
        }`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="z-10"
          >
            <Cpu className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-1.5 border border-dashed border-[#556b2f]/30 rounded-lg"
          />
        </div>
      );

    case 'courseTitleHeading': // 5. Course Title Label
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
        }`}>
          <motion.div
            animate={{ 
              scaleX: [1, 0.85, 1],
              rotateY: [0, 15, 0]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ perspective: 100 }}
            className="z-10"
          >
            <BookOpen className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ y: [-2, 1, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0.5 right-1.5 text-indigo-400/60 dark:text-indigo-300"
          >
            <GraduationCap className="w-2.5 h-2.5" />
          </motion.div>
        </div>
      );

    case 'courseTitleContent': // 6. Course Title Text
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600 border border-cyan-100'
        }`}>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-cyan-500/5 rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: [0, 45, -45, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <Compass className="w-4 h-4" />
          </motion.div>
        </div>
      );

    case 'submittedToHeading': // 7. Submitted To Column Header
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-[#7fffd4]/10 text-[#40e0d0]' : 'bg-[#e6fbf7] text-[#008b8b] border border-[#bef5e9]'
        }`}>
          <motion.div
            animate={{ 
              x: [-1.5, 1.5, -1.5],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <UserCheck className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ scale: [0.5, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-6 h-6 rounded-full border border-[#40e0d0]/30"
          />
        </div>
      );

    case 'submittedToContent': // 8. Teacher Info Details
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600 border border-sky-100'
        }`}>
          <motion.div
            animate={{ 
              y: [-1.5, 1.5, -1.5],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <Briefcase className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: 45 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1 right-1 text-sky-450 dark:text-sky-300"
          >
            <Award className="w-2.5 h-2.5" />
          </motion.div>
        </div>
      );

    case 'submittedByHeading': // 9. Submitted By Column Header
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-650 border border-purple-100'
        }`}>
          <motion.div
            animate={{ 
              x: [-1, 1, -1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <Users className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ width: ['20%', '90%', '20%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[1px] bg-purple-500/30"
          />
        </div>
      );

    case 'submittedByContent': // 10. Student Info Details
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-pink-500/10 text-pink-400' : 'bg-pink-50 text-pink-650 border border-pink-100'
        }`}>
          <motion.div
            animate={{ 
              rotateY: [0, 15, -15, 0],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <IdCard className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ left: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-full w-[1.5px] bg-pink-500/30 top-0"
          />
        </div>
      );

    case 'submissionDateHeading': // 11. Submission Date Header
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-[#db7093]/10 text-[#db7093]' : 'bg-[#fff0f5] text-[#db7093] border border-[#ffdbe5]'
        }`}>
          <motion.div
            animate={{ 
              y: [-1, 1, -1]
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <CalendarDays className="w-4 h-4" />
          </motion.div>
          <div className="absolute top-1 left-2.5 w-1 h-1 rounded-full bg-[#db7093] animate-ping" />
        </div>
      );

    case 'submissionDateContent': // 12. Submission Date Text
      return (
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${
          isDark ? 'bg-[#b0c4de]/10 text-[#b0c4de]' : 'bg-[#f0f4f8] text-[#4682b4] border border-[#cbd5e1]'
        }`}>
          <motion.div
            animate={{ 
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="z-10"
          >
            <CalendarCheck className="w-4 h-4" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute top-1 right-1.5 text-[#4682b4] dark:text-[#b0c4de]"
          >
            <Sparkles className="w-2 h-2" />
          </motion.div>
        </div>
      );

    default:
      return null;
  }
}

export function getHeadlineColorClass(id: string, isDark: boolean): string {
  switch (id) {
    case 'university':
      return isDark ? 'text-green-400 font-bold' : 'text-green-800 font-bold';
    case 'discipline':
      return isDark ? 'text-[#fa8072] font-bold' : 'text-[#d95d39] font-bold';
    case 'assignmentTopic':
      return isDark ? 'text-blue-400' : 'text-blue-700 font-bold';
    case 'topicTitle':
      return isDark ? 'text-amber-400 font-bold' : 'text-amber-700 font-bold';
    case 'courseNoHeading':
      return isDark ? 'text-rose-400 font-bold' : 'text-rose-700 font-bold';
    case 'courseNoContent':
      return isDark ? 'text-[#a9b08f] font-bold' : 'text-[#556b2f] font-bold';
    case 'courseTitleHeading':
      return isDark ? 'text-indigo-400' : 'text-indigo-700 font-bold';
    case 'courseTitleContent':
      return isDark ? 'text-cyan-400 font-bold' : 'text-cyan-700 font-bold';
    case 'submittedToHeading':
      return isDark ? 'text-[#40e0d0] font-bold' : 'text-[#008b8b] font-bold';
    case 'submittedToContent':
      return isDark ? 'text-sky-400 font-bold' : 'text-sky-700 font-bold';
    case 'submittedByHeading':
      return isDark ? 'text-purple-400 font-bold' : 'text-purple-700 font-bold';
    case 'submittedByContent':
      return isDark ? 'text-pink-400 font-bold' : 'text-pink-700 font-bold';
    case 'submissionDateHeading':
      return isDark ? 'text-[#db7093] font-bold' : 'text-[#db7093] font-bold';
    case 'submissionDateContent':
      return isDark ? 'text-[#b0c4de] font-bold' : 'text-[#4682b4] font-bold';
    default:
      return isDark ? 'text-slate-200' : 'text-slate-800';
  }
}

interface DesignBuilderProps {
  coverDesign: CoverPageDesign;
  setCoverDesign: React.Dispatch<React.SetStateAction<CoverPageDesign>>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'watermark') => void;
  theme?: 'dark' | 'light';
  coverData?: CoverPageData;
  setCoverData?: React.Dispatch<React.SetStateAction<CoverPageData>>;
  pageBackgroundColor?: string;
  onChangePageBackgroundColor?: (color: string) => void;
}

export function DesignBuilder({ 
  coverDesign, 
  setCoverDesign, 
  handleFileUpload, 
  theme = 'dark', 
  coverData, 
  setCoverData,
  pageBackgroundColor = '#ffffff',
  onChangePageBackgroundColor
}: DesignBuilderProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'borders' | 'watermark' | 'background'>('templates');
  const [thumbnailZoom, setThumbnailZoom] = useState<number>(1.0);
  const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    assignmentTopic: true,
  });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingWatermark, setIsDraggingWatermark] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [keepOriginalBg, setKeepOriginalBg] = useState(false);
  const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const isUploadedWatermark = coverDesign.watermarkUrl && coverDesign.watermarkUrl !== 'wm-none' && !WATERMARK_PRESETS.some(p => p.id === coverDesign.watermarkUrl);

  const [customPresets, setCustomPresets] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('covergen_custom_designs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newPresetName, setNewPresetName] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleSavePreset = () => {
    const trimmed = newPresetName.trim();
    if (!trimmed) return;

    const newPreset = {
      id: 'preset_' + Date.now().toString(),
      name: trimmed,
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      design: JSON.parse(JSON.stringify(coverDesign))
    };

    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    try {
      localStorage.setItem('covergen_custom_designs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    
    setNewPresetName('');
    setSaveFeedback(`Saved "${trimmed}" to your templates!`);
    setTimeout(() => {
      setSaveFeedback(null);
    }, 4000);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    try {
      localStorage.setItem('covergen_custom_designs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyPreset = (presetDesign: CoverPageDesign) => {
    setCoverDesign(presetDesign);
    setSaveFeedback('Loaded custom design settings!');
    setTimeout(() => {
      setSaveFeedback(null);
    }, 3000);
  };

  const getPresetSpecs = (design: CoverPageDesign) => {
    const fontName = STANDARD_FONTS.find(f => f.value === design.fontTitle?.fontFamily)?.name || 'Times';
    const borderName = design.borderStyle === 'double' ? 'Double' : design.borderStyle === 'single' ? 'Single' : design.borderStyle === 'modern' ? 'Modern' : design.borderStyle === 'classic' ? 'Classic' : 'None';
    let logoName = 'Default';
    if (design.logoUrl?.includes('du')) logoName = 'DU';
    else if (design.logoUrl?.includes('khulna')) logoName = 'KU';
    else if (design.logoUrl?.includes('jnu')) logoName = 'JNU';
    else if (design.logoUrl?.includes('ruet')) logoName = 'RUET';
    else if (!design.logoUrl) logoName = 'None';
    else logoName = 'Custom';

    return { fontName, borderName, logoName, color: design.accentColor || '#0284c7' };
  };

  const getDesignForTemplate = (id: 'ku' | 'du-classic' | 'du-minimal' | 'jnu' | 'ruet'): CoverPageDesign => {
    const base = { ...coverDesign, templateId: id };
    switch (id) {
      case 'du-classic':
        return {
          ...base,
          logoUrl: 'preset-du',
          watermarkUrl: '',
          borderStyle: 'classic',
          borderColor: '#1e3a8a',
          accentColor: '#1e3a8a',
          fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
          fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          
          fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
          fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
          fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
          fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
          fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
          fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
          fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
        };
      case 'du-minimal':
        return {
          ...base,
          logoUrl: 'preset-du',
          watermarkUrl: '',
          borderStyle: 'single',
          borderColor: '#475569',
          accentColor: '#1e3a8a',
          fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
          fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

          fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
          fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
          fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
          fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
          fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
          fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
          fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
        };
      case 'jnu':
        return {
          ...base,
          logoUrl: 'preset-jnu',
          watermarkUrl: '',
          borderStyle: 'double',
          borderColor: '#be123c',
          accentColor: '#be123c',
          fontTitle: { fontFamily: 'Georgia, serif', color: '#be123c', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourse: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubSection: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
          fontDate: { fontFamily: 'Georgia, serif', color: '#ea580c', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

          fontAssignmentTopic: { fontFamily: 'Georgia, serif', color: '#be123c', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
          fontTopicTitle: { fontFamily: 'Georgia, serif', color: '#be123c', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoHeading: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontCourseTitleHeading: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseTitleContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubmittedToHeading: { fontFamily: 'Georgia, serif', color: '#be123c', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
          fontSubmittedToContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
          fontSubmittedByHeading: { fontFamily: 'Georgia, serif', color: '#be123c', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
          fontSubmittedByContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
          fontSubmissionDateHeading: { fontFamily: 'Georgia, serif', color: '#be123c', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
          fontSubmissionDateContent: { fontFamily: 'Georgia, serif', color: '#ea580c', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
        };
      case 'ruet':
        return {
          ...base,
          logoUrl: 'preset-ruet',
          watermarkUrl: '',
          borderStyle: 'modern',
          borderColor: '#ea580c',
          accentColor: '#0284c7',
          fontTitle: { fontFamily: '"Space Grotesk", sans-serif', color: '#1e293b', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourse: { fontFamily: '"JetBrains Mono", monospace', color: '#0f172a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubSection: { fontFamily: '"Inter", sans-serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
          fontDate: { fontFamily: '"JetBrains Mono", monospace', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

          fontAssignmentTopic: { fontFamily: '"Space Grotesk", sans-serif', color: '#0284c7', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
          fontTopicTitle: { fontFamily: '"Space Grotesk", sans-serif', color: '#1e293b', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoHeading: { fontFamily: '"JetBrains Mono", monospace', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoContent: { fontFamily: '"JetBrains Mono", monospace', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontCourseTitleHeading: { fontFamily: '"JetBrains Mono", monospace', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseTitleContent: { fontFamily: '"JetBrains Mono", monospace', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubmittedToHeading: { fontFamily: '"Space Grotesk", sans-serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
          fontSubmittedToContent: { fontFamily: '"Inter", sans-serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
          fontSubmittedByHeading: { fontFamily: '"Space Grotesk", sans-serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
          fontSubmittedByContent: { fontFamily: '"Inter", sans-serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
          fontSubmissionDateHeading: { fontFamily: '"Space Grotesk", sans-serif', color: '#ea580c', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
          fontSubmissionDateContent: { fontFamily: '"JetBrains Mono", monospace', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
        };
      case 'ku':
      default:
        return {
          ...base,
          logoUrl: 'preset-khulna',
          watermarkUrl: '',
          borderStyle: 'none',
          borderColor: '#0284c7',
          accentColor: '#0284c7',
          fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
          fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

          fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
          fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
          fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
          fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
          fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
          fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
          fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
          fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
          fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
        };
    }
  };

  // 13 Granular Fields with complete metadata
  const granularFields = [
    { id: 'university', name: 'University / Institution Name', emoji: '🏛️', parentKey: 'fontUniversity', min: 2, max: 50, align: true },
    { id: 'discipline', name: 'Discipline / Department Name', emoji: '🏢', parentKey: 'fontDiscipline', min: 2, max: 50, align: true },
    { id: 'assignmentTopic', name: 'Assignment Topic Header', emoji: '📝', parentKey: 'fontTitle', min: 2, max: 50, align: true },
    { id: 'topicTitle', name: 'Main Topic Title Banner', emoji: '🏷️', parentKey: 'fontTitle', min: 2, max: 50, align: true },
    { id: 'courseNoHeading', name: 'Course Number Label', emoji: '🔢', parentKey: 'fontCourse', min: 2, max: 50, align: true },
    { id: 'courseNoContent', name: 'Course Code Value', emoji: '⚙️', parentKey: 'fontCourse', min: 2, max: 50, align: true },
    { id: 'courseTitleHeading', name: 'Course Title Label', emoji: '📘', parentKey: 'fontCourse', min: 2, max: 50, align: true },
    { id: 'courseTitleContent', name: 'Course Title Text', emoji: '🎯', parentKey: 'fontCourse', min: 2, max: 50, align: true },
    { id: 'submittedToHeading', name: 'Submitted To Column Header', emoji: '🎓', parentKey: 'fontSubSection', min: 2, max: 50, align: true },
    { id: 'submittedToContent', name: 'Teacher Info Details', emoji: '🏫', parentKey: 'fontSubSection', min: 2, max: 50, align: true },
    { id: 'submittedByHeading', name: 'Submitted By Column Header', emoji: '👥', parentKey: 'fontSubSection', min: 2, max: 50, align: true },
    { id: 'submittedByContent', name: 'Student Info Details', emoji: '👤', parentKey: 'fontSubSection', min: 2, max: 50, align: true },
    { id: 'submissionDateHeading', name: 'Submission Date Header', emoji: '📅', parentKey: 'fontDate', min: 2, max: 50, align: false },
    { id: 'submissionDateContent', name: 'Submission Date Text', emoji: '📆', parentKey: 'fontDate', min: 2, max: 50, align: false },
  ];

  const getPreviewText = (id: string, data?: CoverPageData) => {
    switch (id) {
      case 'university':
        return data?.universityName || data?.teacherUniversity || 'Khulna University';
      case 'discipline':
        return data?.teacherDiscipline || data?.studentDiscipline || 'Environmental Science Discipline';
      case 'assignmentTopic':
        return data?.documentType || 'AN ASSIGNMENT ON';
      case 'topicTitle':
        return data?.topicTitle || 'ANALYSIS OF HEAVY METAL CONCENTRATION';
      case 'courseNoHeading':
        return data?.courseNoHeading || 'COURSE NO:';
      case 'courseNoContent':
        return data?.courseNo || 'ES-1205';
      case 'courseTitleHeading':
        return data?.courseNameHeading || 'COURSE TITLE:';
      case 'courseTitleContent':
        return data?.courseName || 'Environmental Chemistry & Pollution Lab';
      case 'submittedToHeading':
        return data?.teacherHeading || 'SUBMITTED TO,';
      case 'submittedToContent':
        return data?.teacherDetails || 'Dr. S. M. Tariqul Islam\nProfessor';
      case 'submittedByHeading':
        return data?.submittedByLabel || 'SUBMITTED BY,';
      case 'submittedByContent':
        return data?.studentDetails || 'Anirudha Dey\nSTUDENT ID: 251009';
      case 'submissionDateHeading':
        return data?.submissionDateHeading || 'DATE OF SUBMISSION:';
      case 'submissionDateContent':
        return data?.submissionDate || '2026-05-26';
      default:
        return 'SAMPLE TEXT';
    }
  };

  // Theme adapter classes
  const containerStyle = isDark
    ? 'bg-[#060813] bg-[linear-gradient(to_right,#111625_1px,transparent_1px),linear-gradient(to_bottom,#111625_1px,transparent_1px)] bg-[size:3rem_3rem]'
    : 'bg-[#fafafc] bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]';

  const headingTextClass = isDark ? 'text-white' : 'text-slate-800';
  const headingTextAltClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderBottomClass = isDark ? 'border-[#161e33] bg-[#0a0d1a]/80' : 'border-slate-200 bg-white/80';
  const tabRowBgClass = isDark ? 'bg-[#090b11] border-[#161e33]' : 'bg-slate-100 border-slate-200';

  const cardClass = isDark 
    ? 'bg-[#0b0f19]/90 border border-[#161e33] text-slate-100 shadow-xl' 
    : 'bg-white border border-slate-200 text-slate-800 shadow-sm';
  const labelClass = isDark ? 'text-slate-400' : 'text-slate-600 font-bold';
  const inputClass = isDark
    ? 'bg-[#070b13] border border-[#1a233d] focus:border-indigo-500/60 text-slate-200'
    : 'bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-805';

  const processWatermarkFile = async (rawFile: File) => {
    if (!rawFile) return;
    setBgRemovalError(null);
    setIsRemovingBg(true);

    let processedData: { blob: Blob; base64: string; name: string } | null = null;
    try {
      console.log("Pre-processing input watermark image...");
      processedData = await preprocessImageForApi(rawFile);
      console.log(`Pre-processing completed successfully. Standardized output dimensions: ${(processedData.blob.size / 1024).toFixed(1)}KB`);
    } catch (preprocessErr: any) {
      console.error("Client-side pre-processing failed, fallback to original raw file:", preprocessErr);
    }

    const fileToUpload = processedData ? processedData.blob : rawFile;
    const fileName = processedData ? processedData.name : (rawFile.name || 'watermark.png');
    const fileBase64 = processedData ? processedData.base64 : null;

    // Handlers for keeping original bg or complete failure fallback
    const useOriginalBackgroundFallback = (applyMultiplyBlend = false) => {
      if (fileBase64) {
        setCoverDesign(prev => ({ 
          ...prev, 
          watermarkUrl: fileBase64,
          watermarkBlendMultiply: applyMultiplyBlend
        }));
        setIsRemovingBg(false);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setCoverDesign(prev => ({ 
            ...prev, 
            watermarkUrl: result,
            watermarkBlendMultiply: applyMultiplyBlend
          }));
          setIsRemovingBg(false);
        };
        reader.readAsDataURL(rawFile);
      }
    };

    if (keepOriginalBg) {
      useOriginalBackgroundFallback(false);
      return;
    }

    // Helper to fetch with custom timeout
    const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { ...options, signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }
    };

    let removeBgSucceeded = false;
    let removeBgError: any = null;

    // --- 1. PRIMARY API Attempt: Remove.bg ---
    const removeBgApiKey = (import.meta as any).env?.VITE_REMOVE_BG_API_KEY;
    if (removeBgApiKey) {
      try {
        console.log("Attempting background removal via primary Remove.bg API...");
        const removeBgFormData = new FormData();
        removeBgFormData.append('image_file', fileToUpload, fileName);
        removeBgFormData.append('size', 'auto');

        const removeBgResponse = await fetchWithTimeout('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': removeBgApiKey,
          },
          body: removeBgFormData,
        }, 20000); // 20-second timeout

        if (removeBgResponse.ok) {
          console.log("Remove.bg background removal succeeded!");
          const blob = await removeBgResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setCoverDesign(prev => ({ 
            ...prev, 
            watermarkUrl: objectUrl,
            watermarkBlendMultiply: false
          }));
          setIsRemovingBg(false);
          removeBgSucceeded = true;
          return;
        } else {
          let errorMsg = `HTTP ${removeBgResponse.status}`;
          try {
            const errJson = await removeBgResponse.json();
            if (errJson?.errors?.[0]?.title) {
              errorMsg = errJson.errors[0].title;
            }
          } catch {
            // ignore
          }
          throw new Error(`Remove.bg failed: ${errorMsg}`);
        }
      } catch (err: any) {
        removeBgError = err;
        console.warn("Remove.bg API failed. Dropping to Hugging Face fallback...", err.message || err);
      }
    } else {
      console.log("VITE_REMOVE_BG_API_KEY is not configured. Moving directly to Hugging Face Backup API...");
    }

    // --- 2. BACKUP API Attempt: Hugging Face space API ---
    if (!removeBgSucceeded) {
      try {
        console.log("Attempting background removal via Hugging Face Space API fallback...");
        let hfResponse: Response | null = null;
        let lastHfError: any = null;
        const hfMaxAttempts = 2;

        for (let attempt = 1; attempt <= hfMaxAttempts; attempt++) {
          try {
            console.log(`Hugging Face API Attempt ${attempt}/${hfMaxAttempts} (Extended timeout 45s)...`);
            const hfFormData = new FormData();
            hfFormData.append('image_file', fileToUpload, fileName);

            // Extended timeout to handle possible cold-start issues on HF space
            hfResponse = await fetchWithTimeout('https://rahul2408-covergen-api.hf.space/', {
              method: 'POST',
              body: hfFormData,
            }, 45000);

            if (hfResponse.ok) {
              console.log(`Hugging Face background removal succeeded on attempt ${attempt}`);
              break;
            } else {
              throw new Error(`HF Space API returned status ${hfResponse.status}`);
            }
          } catch (attemptErr: any) {
            lastHfError = attemptErr;
            if (attemptErr.name === 'AbortError') {
              console.warn(`Hugging Face Attempt ${attempt} timed out. Possible cold-start.`);
            } else {
              console.warn(`Hugging Face Attempt ${attempt} failed: ${attemptErr.message || attemptErr}`);
            }
            if (attempt < hfMaxAttempts) {
              const delay = 3500; // wait 3.5 seconds
              console.log(`Waiting ${delay}ms before next HF attempt...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }

        if (hfResponse && hfResponse.ok) {
          const blob = await hfResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setCoverDesign(prev => ({ 
            ...prev, 
            watermarkUrl: objectUrl,
            watermarkBlendMultiply: false
          }));
          setIsRemovingBg(false);
          return;
        } else {
          throw lastHfError || new Error("Hugging Face API fallback failed after all retries.");
        }
      } catch (hfErr: any) {
        console.error("Both background removal APIs failed:", {
          removeBgError: removeBgError?.message || removeBgError || "Key not configured",
          hfError: hfErr?.message || hfErr
        });

        // Set the error description so UI displays a professional toast/note
        const errDesc = `API Limit / Model cold-start. Applied smart CSS-based transparent (Multiply) blending to original watermark.`;
        setBgRemovalError(errDesc);

        // --- 3. CSS FALLBACK (Last Resort) ---
        useOriginalBackgroundFallback(true);
      }
    }
  };

  const handleLocalWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processWatermarkFile(file);
  };

  const handleDragOver = (e: React.DragEvent, target: 'logo' | 'watermark') => {
    e.preventDefault();
    if (target === 'logo') {
      setIsDraggingLogo(true);
    } else {
      setIsDraggingWatermark(true);
    }
  };

  const handleDragLeave = (target: 'logo' | 'watermark') => {
    if (target === 'logo') {
      setIsDraggingLogo(false);
    } else {
      setIsDraggingWatermark(false);
    }
  };

  const handleDrop = (e: React.DragEvent, target: 'logo' | 'watermark') => {
    e.preventDefault();
    if (target === 'logo') {
      setIsDraggingLogo(false);
    } else {
      setIsDraggingWatermark(false);
    }

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    if (target === 'logo') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCoverDesign(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    } else {
      processWatermarkFile(file);
    }
  };

  // Preset university styles binder
  const applyTemplatePresetId = (id: 'ku' | 'du-classic' | 'du-minimal' | 'jnu' | 'ruet' | 'jnu-finance' | 'presidency' | 'jnu-traditional' | 'teal-bars' | 'ku-law-table' | 'cu-boxed-code' | 'top-header-asymmetric') => {
    setCoverDesign(prev => {
      const getPreset = (): CoverPageDesign => {
        const base = { ...prev, templateId: id };
        const currentLogo = prev.logoUrl || ''; // Preserve custom uploaded logo
        
        // Choose appropriate default logo based on template selection if not a custom file
        let defaultLogo = '';
        if (!currentLogo.startsWith('data:')) {
          if (id === 'ku') defaultLogo = 'preset-science';
          else if (id === 'du-classic' || id === 'du-minimal') defaultLogo = 'preset-du';
          else if (id === 'jnu' || id === 'jnu-finance' || id === 'jnu-traditional' || id === 'teal-bars' || id === 'top-header-asymmetric') defaultLogo = 'preset-jnu';
          else if (id === 'ruet') defaultLogo = 'preset-ruet';
          else if (id === 'presidency') defaultLogo = 'preset-presidency';
          else if (id === 'ku-law-table') defaultLogo = 'preset-khulna';
          else if (id === 'cu-boxed-code') defaultLogo = 'preset-academic';
        } else {
          defaultLogo = currentLogo;
        }

        switch (id) {
        case 'presidency':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'double',
            borderColor: '#2563eb',
            accentColor: '#2563eb',
            fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#2563eb', fontSize: 20, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'left' },
            fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'left' },

            fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#104f9e', fontSize: 28, bold: true, uppercase: false, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: true, align: 'left' },
            fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'left' },
            fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'left' },
            fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'left' },
            fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 11.5, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 11.5, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'jnu-traditional':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#1e293b',
            accentColor: '#1e293b',
            fontTitle: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 26, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourse: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: false, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontDate: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 19, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: false, uppercase: false, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: false, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: false, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: false, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'right' },
            fontSubmittedByContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'right' },
            fontSubmissionDateHeading: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'teal-bars':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'single',
            borderColor: '#0891b2',
            accentColor: '#0891b2',
            fontTitle: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 24, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 19, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToContent: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 11, bold: false, uppercase: false, italic: false, align: 'center' },
            fontSubmittedByHeading: { fontFamily: '"Inter", sans-serif', color: '#0891b2', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedByContent: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 11, bold: false, uppercase: false, italic: false, align: 'center' },
            fontSubmissionDateHeading: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Inter", sans-serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'du-classic':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'classic',
            borderColor: '#1e3a8a',
            accentColor: '#1e3a8a',
            fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            
            fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
            fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
            fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'du-minimal':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#475569',
            accentColor: '#1e3a8a',
            fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'jnu':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#b45309',
            accentColor: '#b45309',
            fontTitle: { fontFamily: 'Georgia, serif', color: '#b45309', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: 'Georgia, serif', color: '#b45309', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: 'Georgia, serif', color: '#1e293b', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: 'Georgia, serif', color: '#b45309', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: 'Georgia, serif', color: '#b45309', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
            fontSubmittedByContent: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
            fontSubmissionDateHeading: { fontFamily: 'Georgia, serif', color: '#b45309', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: 'Georgia, serif', color: '#0f172a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'jnu-finance':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#1e3a8a',
            accentColor: '#1e3a8a',
            fontTitle: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: 'Georgia, serif', color: '#15803d', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: 'Georgia, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 11, bold: true, uppercase: true, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: 'Georgia, serif', color: '#15803d', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: 'Georgia, serif', color: '#15803d', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: 'Georgia, serif', color: '#15803d', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: 'Georgia, serif', color: '#15803d', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: 'Georgia, serif', color: '#ef4444', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: 'Georgia, serif', color: '#ef4444', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
            fontSubmittedByContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
            fontSubmissionDateHeading: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: 'Georgia, serif', color: '#000000', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'ruet':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'modern',
            borderColor: '#ea580c',
            accentColor: '#0284c7',
            fontTitle: { fontFamily: '"Space Grotesk", sans-serif', color: '#1e293b', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"JetBrains Mono", monospace', color: '#0f172a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Inter", sans-serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"JetBrains Mono", monospace', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: '"Space Grotesk", sans-serif', color: '#0284c7', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Space Grotesk", sans-serif', color: '#1e293b', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"JetBrains Mono", monospace', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"JetBrains Mono", monospace', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"JetBrains Mono", monospace', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"JetBrains Mono", monospace', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Space Grotesk", sans-serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Inter", sans-serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Space Grotesk", sans-serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
            fontSubmittedByContent: { fontFamily: '"Inter", sans-serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
            fontSubmissionDateHeading: { fontFamily: '"Space Grotesk", sans-serif', color: '#ea580c', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"JetBrains Mono", monospace', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'ku-law-table':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#1e3a8a',
            accentColor: '#1e3a8a',
            fontTitle: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 26, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 15, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: 'Georgia, serif', color: '#ffffff', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' }, // header bar fill is colored accentColor
            fontDate: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: 'Georgia, serif', color: '#2563eb', fontSize: 13, bold: false, uppercase: false, italic: true, align: 'center' },
            fontTopicTitle: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 20, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: 'Georgia, serif', color: '#ffffff', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: 'Georgia, serif', color: '#ffffff', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedByContent: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmissionDateHeading: { fontFamily: 'Georgia, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: 'Georgia, serif', color: '#111827', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'cu-boxed-code':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'single',
            borderColor: '#0f172a',
            accentColor: '#1e3a8a',
            fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 26, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 13, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#1e3a8a', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'top-header-asymmetric':
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#ffa07a',
            accentColor: '#d95d39',
            paperColor: '#fff0eb',
            fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#d95d39', fontSize: 16, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 13, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#d95d39', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontUniversity: { fontFamily: '"Times New Roman", Times, serif', color: '#c2410c', fontSize: 19, bold: true, uppercase: false, italic: false, align: 'center' },
            fontDiscipline: { fontFamily: '"Times New Roman", Times, serif', color: '#ff7f50', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#d95d39', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 18, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#c2410c', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#c2410c', fontSize: 12.5, bold: true, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 11.5, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#2a0c02', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
        case 'ku':
        default:
          return {
            ...base,
            logoUrl: defaultLogo,
            watermarkUrl: '',
            borderStyle: 'none',
            borderColor: '#0284c7',
            accentColor: '#0284c7',
            fontTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 24, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourse: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 16, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubSection: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'center' },
            fontDate: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },

            fontAssignmentTopic: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 10, bold: true, uppercase: true, italic: false, align: 'center' },
            fontTopicTitle: { fontFamily: '"Times New Roman", Times, serif', color: '#1e293b', fontSize: 22, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseNoContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontCourseTitleHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 14, bold: true, uppercase: true, italic: false, align: 'center' },
            fontCourseTitleContent: { fontFamily: '"Times New Roman", Times, serif', color: '#0f172a', fontSize: 14, bold: true, uppercase: false, italic: false, align: 'center' },
            fontSubmittedToHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'left' },
            fontSubmittedToContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'left' },
            fontSubmittedByHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 12.5, bold: true, uppercase: true, italic: false, align: 'right' },
            fontSubmittedByContent: { fontFamily: '"Times New Roman", Times, serif', color: '#334155', fontSize: 12, bold: false, uppercase: false, italic: false, align: 'right' },
            fontSubmissionDateHeading: { fontFamily: '"Times New Roman", Times, serif', color: '#0284c7', fontSize: 12, bold: true, uppercase: true, italic: false, align: 'center' },
            fontSubmissionDateContent: { fontFamily: '"Times New Roman", Times, serif', color: '#475569', fontSize: 12, bold: true, uppercase: false, italic: false, align: 'center' },
          };
      }
    };

    const presetDesign = getPreset();
    const mergedDesign = { ...presetDesign };
    const allFontKeys = [
      'fontTitle', 'fontCourse', 'fontSubSection', 'fontDate',
      'fontAssignmentTopic', 'fontTopicTitle', 'fontCourseNoHeading', 'fontCourseNoContent',
      'fontCourseTitleHeading', 'fontCourseTitleContent', 'fontSubmittedToHeading', 'fontSubmittedToContent',
      'fontSubmittedByHeading', 'fontSubmittedByContent', 'fontSubmissionDateHeading', 'fontSubmissionDateContent',
      'fontUniversity', 'fontDiscipline'
    ];
    
    allFontKeys.forEach((fontKey) => {
      const presetFont = presetDesign[fontKey as keyof CoverPageDesign] as FontConfig | undefined;
      if (presetFont) {
        const userManualKeys = prev.customizedProperties?.[fontKey] || [];
        const userFont = prev[fontKey as keyof CoverPageDesign] as FontConfig | undefined;
        
        if (userFont) {
          const merged = { ...presetFont };
          userManualKeys.forEach((k) => {
            if (userFont[k as keyof FontConfig] !== undefined) {
              (merged as any)[k] = userFont[k as keyof FontConfig];
            }
          });
          (mergedDesign as any)[fontKey] = merged;
        }
      }
    });
    
    return mergedDesign;
  });
};

  // Helper to adjust individual font settings safely
  const updateFontConfig = (section: string, key: string, value: any) => {
    setCoverDesign(prev => {
      const map: Record<string, keyof CoverPageDesign> = {
        title: 'fontTitle',
        course: 'fontCourse',
        sub: 'fontSubSection',
        date: 'fontDate',
        
        // Granular controls
        university: 'fontUniversity',
        discipline: 'fontDiscipline',
        assignmentTopic: 'fontAssignmentTopic',
        topicTitle: 'fontTopicTitle',
        courseNoHeading: 'fontCourseNoHeading',
        courseNoContent: 'fontCourseNoContent',
        courseTitleHeading: 'fontCourseTitleHeading',
        courseTitleContent: 'fontCourseTitleContent',
        submittedToHeading: 'fontSubmittedToHeading',
        submittedToContent: 'fontSubmittedToContent',
        submittedByHeading: 'fontSubmittedByHeading',
        submittedByContent: 'fontSubmittedByContent',
        submissionDateHeading: 'fontSubmissionDateHeading',
        submissionDateContent: 'fontSubmissionDateContent'
      };
      const field = (map[section] || section) as keyof CoverPageDesign;
      
      // Lazily back up from existing defaults if the specific dynamic sub-config is not yet set
      const defaultMap: Record<string, keyof CoverPageDesign> = {
        fontUniversity: 'fontTitle',
        fontDiscipline: 'fontSubSection',
        fontAssignmentTopic: 'fontTitle',
        fontTopicTitle: 'fontTitle',
        fontCourseNoHeading: 'fontCourse',
        fontCourseNoContent: 'fontCourse',
        fontCourseTitleHeading: 'fontCourse',
        fontCourseTitleContent: 'fontCourse',
        fontSubmittedToHeading: 'fontSubSection',
        fontSubmittedToContent: 'fontSubSection',
        fontSubmittedByHeading: 'fontSubSection',
        fontSubmittedByContent: 'fontSubSection',
        fontSubmissionDateHeading: 'fontDate',
        fontSubmissionDateContent: 'fontDate'
      };
      
      let baseConfig = prev[field] as any;
      if (!baseConfig) {
        const fallBackField = defaultMap[field];
        if (fallBackField && prev[fallBackField]) {
          baseConfig = { ...(prev[fallBackField] as any) };
        } else {
          baseConfig = { ...((DEFAULT_DESIGN[field] || DEFAULT_DESIGN.fontTitle) as any) };
        }
      }
      
      const updatedCustomProps = { ...(prev.customizedProperties || {}) };
      const fieldStr = String(field);
      if (!updatedCustomProps[fieldStr]) {
        updatedCustomProps[fieldStr] = [];
      }
      if (!updatedCustomProps[fieldStr].includes(key)) {
        updatedCustomProps[fieldStr] = [...updatedCustomProps[fieldStr], key];
      }
      
      return {
        ...prev,
        customizedProperties: updatedCustomProps,
        [field]: {
          ...baseConfig,
          [key]: value
        }
      };
    });
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden relative transition-colors duration-300 ${containerStyle}`}>
      
      {/* Background Glow ornaments */}
      <div className={`absolute top-10 left-4 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-300/[0.04]'}`} />
      <div className={`absolute bottom-10 right-4 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all ${isDark ? 'bg-purple-500/5' : 'bg-purple-300/[0.02]'}`} />

      {/* Title Header */}
      <div className={`shrink-0 p-5 border-b backdrop-blur-md relative z-10 transition-colors duration-300 ${borderBottomClass}`}>
        <h2 className={`text-sm font-bold tracking-widest uppercase flex items-center gap-1.5 ${headingTextClass}`}>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          2. Cover Style Designer
        </h2>
        <p className={`text-[10px] mt-1 font-medium ${headingTextAltClass}`}>Fine-tune professional fonts, borders, scales, and backgrounds.</p>
      </div>

      {/* Styled tabs bar */}
      <div className="shrink-0 p-4 relative z-10">
        <div className={`grid grid-cols-5 gap-1 p-1 rounded-xl border transition-all duration-305 ${tabRowBgClass}`}>
          <button 
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`relative py-3 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 focus:outline-none select-none z-10 duration-200 ${
              activeTab === 'templates' 
                ? isDark ? 'text-blue-400 font-extrabold font-sans' : 'text-blue-600 font-extrabold font-sans'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-550 hover:text-slate-800'
            }`}
          >
            {activeTab === 'templates' && (
              <motion.div
                layoutId="designerStyleTabIndicator"
                className={`absolute inset-0 rounded-lg -z-10 border ${
                  isDark 
                    ? 'bg-[#0f172a]/95 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.18)]' 
                    : 'bg-white border-blue-200 shadow-[0_2px_8px_rgba(37,99,235,0.08)]'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <AnimatedTemplatesIcon isActive={activeTab === 'templates'} isDark={isDark} />
            <span className="tracking-wide">Templates</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('text')}
            className={`relative py-3 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 focus:outline-none select-none z-10 duration-200 ${
              activeTab === 'text' 
                ? isDark ? 'text-fuchsia-450 font-extrabold font-sans' : 'text-fuchsia-600 font-extrabold font-sans'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-550 hover:text-slate-800'
            }`}
          >
            {activeTab === 'text' && (
              <motion.div
                layoutId="designerStyleTabIndicator"
                className={`absolute inset-0 rounded-lg -z-10 border ${
                  isDark 
                    ? 'bg-[#1a0c2e]/95 border-fuchsia-500/40 shadow-[0_0_15px_rgba(168,85,247,0.18)]' 
                    : 'bg-white border-fuchsia-200 shadow-[0_2px_8px_rgba(168,85,247,0.08)]'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <AnimatedFontsIcon isActive={activeTab === 'text'} isDark={isDark} />
            <span className="tracking-wide">Fonts</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('borders')}
            className={`relative py-3 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 focus:outline-none select-none z-10 duration-200 ${
              activeTab === 'borders' 
                ? isDark ? 'text-amber-400 font-extrabold font-sans' : 'text-amber-600 font-extrabold font-sans'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-505 hover:text-slate-800'
            }`}
          >
            {activeTab === 'borders' && (
              <motion.div
                layoutId="designerStyleTabIndicator"
                className={`absolute inset-0 rounded-lg -z-10 border ${
                  isDark 
                    ? 'bg-[#1c1103]/95 border-amber-600/40 shadow-[0_0_15px_rgba(245,158,11,0.18)]' 
                    : 'bg-white border-amber-200 shadow-[0_2px_8px_rgba(245,158,11,0.08)]'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <AnimatedBordersIcon isActive={activeTab === 'borders'} isDark={isDark} />
            <span className="tracking-wide">Borders</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('watermark')}
            className={`relative py-3 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 focus:outline-none select-none z-10 duration-200 ${
              activeTab === 'watermark' 
                ? isDark ? 'text-emerald-400 font-extrabold font-sans' : 'text-emerald-600 font-extrabold font-sans'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-505 hover:text-slate-800'
            }`}
          >
            {activeTab === 'watermark' && (
              <motion.div
                layoutId="designerStyleTabIndicator"
                className={`absolute inset-0 rounded-lg -z-10 border ${
                  isDark 
                    ? 'bg-[#042115]/95 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.18)]' 
                    : 'bg-white border-emerald-200 shadow-[0_2px_8px_rgba(16,185,129,0.08)]'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <AnimatedBrandingIcon isActive={activeTab === 'watermark'} isDark={isDark} />
            <span className="tracking-wide">Branding</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('background')}
            className={`relative py-3 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-center gap-1.5 focus:outline-none select-none z-10 duration-200 ${
              activeTab === 'background' 
                ? isDark ? 'text-indigo-400 font-extrabold font-sans' : 'text-indigo-600 font-extrabold font-sans'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-505 hover:text-slate-800'
            }`}
          >
            {activeTab === 'background' && (
              <motion.div
                layoutId="designerStyleTabIndicator"
                className={`absolute inset-0 rounded-lg -z-10 border ${
                  isDark 
                    ? 'bg-[#0f111a]/95 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.18)]' 
                    : 'bg-white border-indigo-200 shadow-[0_2px_8px_rgba(99,102,241,0.08)]'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <Palette className={`w-3.5 h-3.5 ${activeTab === 'background' ? 'text-indigo-500 scale-110 animate-pulse' : 'text-slate-400'} transition-all`} />
            <span className="tracking-wide">Background</span>
          </button>
        </div>
      </div>

      {/* Sub-panels container */}
      <div className="flex-1 overflow-y-auto p-5 pt-1 space-y-4 relative z-10">
        <AnimatePresence mode="wait">
          {/* TAB 0: TEMPLATES SELECTION */}
          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="space-y-4 font-sans text-left"
            >
            {/* Header description */}
            <div className="flex flex-col space-y-1.5 px-0.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-1.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-mono font-extrabold uppercase tracking-wide">
                  12 Pro Styles
                </span>
                <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Academic Template Architect
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Choose a base template to instantly match the formal guidelines of your university. You can still customize colors, fonts, and borders!
              </p>
            </div>

            {/* Interactive Thumbnail Zoom Control Panel */}
            <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? 'bg-[#0a0f1d] border-[#1c2847]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2 shrink-0">
                <ZoomIn className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Thumb Inspect: <span className="text-amber-500">{(thumbnailZoom * 100).toFixed(0)}%</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3 flex-1 justify-end">
                <span className="text-[9px] font-mono font-bold text-slate-550 select-none">0.8x</span>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={thumbnailZoom}
                  onChange={(e) => setThumbnailZoom(parseFloat(e.target.value))}
                  className="w-full max-w-[120px] accent-amber-500 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  title="Use slider or hover & scroll mouse wheel over thumbnails to zoom in/out!"
                />
                <span className="text-[9px] font-mono font-bold text-slate-550 select-none">2.5x</span>
                <button
                  type="button"
                  onClick={() => setThumbnailZoom(1.0)}
                  className={`px-2 py-0.5 text-[9px] font-mono font-extrabold uppercase rounded border transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300' 
                      : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Reset inspection zoom"
                >
                  Reset
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-505 italic text-center -mt-1 font-mono">
              💡 Pro-Tip: Hover and scroll mouse wheel 🖱️ over any template to zoom!
            </p>

            {/* Template presets GRID */}
            <div className="grid grid-cols-1 gap-3.5">
              {[
                { id: 'ku', name: 'Template No 1', desc: 'Symmetric shield style with borderless canvas and clean serif layout.', badge: 'Royal Blue Accent' },
                { id: 'ku-law-table', name: 'Template No 2', desc: 'Academic layout structured with dual submitted tables and bold Georgia law serif headings under the royal shield.', badge: 'Premium KU Law' },
                { id: 'du-classic', name: 'Template No 3', desc: 'Formal Gothic-style headings, Classic inner lining border and centered details.', badge: 'Blue Gothic' },
                { id: 'du-minimal', name: 'Template No 4', desc: 'A borderless clean design with left/right column structure for student and teacher details.', badge: 'Simple Times' },
                { id: 'jnu', name: 'Template No 5', desc: 'No-border elegant layout with decorative banner styling and gorgeous Amber details.', badge: 'Amber Highlight' },
                { id: 'ruet', name: 'Template No 6', desc: 'Orange-themed high-tech engineering cover with elegant modern side column lines and custom watermark.', badge: 'Modern Accent' },
                { id: 'jnu-finance', name: 'Template No 7', desc: 'Beautiful dual-column layout mimicking standard JNU Department of Finance covers with crimson and green details.', badge: 'Academic Finance' },
                { id: 'presidency', name: 'Template No 8', desc: 'Elegant double border frame, signature multi-colored assignment bullet lists, and beautiful bottom card enclosures.', badge: 'Presidency Blue' },
                { id: 'jnu-traditional', name: 'Template No 9', desc: 'Academic layout following traditional department research cover standard with clean serif typography.', badge: 'Classic JNU' },
                { id: 'teal-bars', name: 'Template No 10', desc: 'Striking modern layout with full-width top and bottom bar fills and clean high-contrast presentation for internship reviews.', badge: 'Teal Business' },
                { id: 'cu-boxed-code', name: 'Template No 11', desc: 'Elegant rectangular nested code frames enclosing course codes/titles, combined with clean classic times colons alignment.', badge: 'Chittagong Double-Frame' },
                { id: 'top-header-asymmetric', name: 'Template No 12', desc: 'Prestige layout featuring absolute top header text blocks, centered logo, centered topics, and an asymmetrical, staggered submissions grid.', badge: 'Asymmetric Header' }
              ].map((tmpl) => {
                const isSelected = coverDesign.templateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplatePresetId(tmpl.id as any)}
                    onMouseEnter={() => setHoveredTemplateId(tmpl.id as any)}
                    onMouseLeave={() => setHoveredTemplateId(null)}
                    className={`w-full text-left p-3.5 rounded-2xl flex items-center space-x-4 border transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20'
                          : 'bg-indigo-50/40 border-indigo-200 shadow-sm ring-1 ring-indigo-500/10'
                        : isDark
                          ? 'bg-[#0a0f1d] hover:bg-[#121932]/60 border-[#1c2847] hover:border-[#2b3d6c]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Visual miniature representation with Interactive Wheel Zoom support */}
                    <div 
                      className="shrink-0 -mx-1 transition-transform duration-150 z-10 hover:z-30 relative origin-center select-none cursor-zoom-in"
                      style={{ transform: `scale(${0.9 * thumbnailZoom})` }}
                      onWheel={(e) => {
                        e.stopPropagation();
                        // Standardize wheel scroll steps
                        const step = e.shiftKey ? 0.05 : 0.15;
                        const direction = e.deltaY < 0 ? 1 : -1;
                        setThumbnailZoom((prev) => Math.max(0.8, Math.min(2.5, parseFloat((prev + direction * step).toFixed(2)))));
                      }}
                    >
                      <TemplateThumbnail
                        id={tmpl.id as any}
                        isSelected={isSelected}
                        isDark={isDark}
                      />
                    </div>

                    {/* Meta info column */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold leading-none truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {tmpl.name}
                        </span>
                        <span className="text-[8px] font-mono shrink-0 select-none px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className={`text-[10px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tmpl.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* TAB 1: FONTS (UNIFIED PAGE COHESIVE SYSTEM) */}
        {activeTab === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="space-y-4 font-sans text-left"
          >
            {/* Header description */}
            <div className="flex flex-col space-y-1.5 px-0.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-1.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-mono font-extrabold uppercase tracking-wide">
                  {granularFields.length} Active Topics
                </span>
                <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Typography Designer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Choose custom fonts, colors, and sizes for every line of your cover. Each topic features its own live preview!
              </p>
            </div>

            {/* Expand / Collapse Control Toolbar */}
            <div className={`flex items-center justify-between p-2 rounded-xl border ${
              isDark ? 'bg-[#090e1a]/80 border-[#1c2847]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-1.5 pl-1">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Quick Controls
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const expanded: Record<string, boolean> = {};
                    granularFields.forEach(f => { expanded[f.id] = true; });
                    setExpandedTopics(expanded);
                  }}
                  className={`px-2 py-1 select-none text-[9px] font-mono font-extrabold uppercase tracking-wider rounded-md border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    isDark 
                      ? 'bg-[#121c33] hover:bg-[#1a2847] border-[#22335c] text-indigo-300' 
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-indigo-650 shadow-sm'
                  }`}
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedTopics({})}
                  className={`px-2 py-1 select-none text-[9px] font-mono font-extrabold uppercase tracking-wider rounded-md border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    isDark 
                      ? 'bg-[#121c33] hover:bg-[#1a2847] border-[#22335c] text-indigo-300' 
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-indigo-650 shadow-sm'
                  }`}
                >
                  Collapse All
                </button>
              </div>
            </div>
            {/* The Accordion List of 12 Topics */}
            <div className="space-y-2.5">
              {granularFields.map((match, idx) => {
                const isExpanded = !!expandedTopics[match.id];
                const designKey = ('font' + match.id.charAt(0).toUpperCase() + match.id.slice(1)) as keyof CoverPageDesign;
                const parentKey = match.parentKey as keyof CoverPageDesign;
                
                // Get active config, defaulting gracefully to parent if not explicitly configured yet
                const activeConfig = (coverDesign[designKey] || coverDesign[parentKey] || DEFAULT_DESIGN[parentKey] || DEFAULT_DESIGN.fontTitle) as FontConfig;
                const isOverriddenDirectly = coverDesign[designKey] !== undefined;
                const previewString = getPreviewText(match.id, coverData);

                return (
                  <div 
                    key={match.id} 
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded 
                        ? isDark 
                          ? 'border-indigo-500/50 bg-[#0c1224] ring-1 ring-indigo-500/20 shadow-indigo-950/20' 
                          : 'border-indigo-300 bg-indigo-50/20 shadow-sm shadow-indigo-100'
                        : isDark
                          ? 'border-[#18233f] bg-[#0a0d18] hover:border-[#202f54]'
                          : 'border-slate-200 bg-white hover:border-slate-350 shadow-sm'
                    }`}
                  >
                    {/* Collapsible Accordion Header */}
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedTopics(prev => ({
                          ...prev,
                          [match.id]: !prev[match.id]
                        }));
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-all hover:bg-slate-500/[0.02]"
                    >
                      <div className="flex flex-col space-y-1.5 min-w-0 flex-1 pr-3">
                        <div className="flex items-center space-x-2.5">
                          <AnimatedTopicIcon id={match.id} isDark={isDark} />
                          <span className={`text-[11px] font-sans font-extrabold tracking-wide uppercase truncate ${getHeadlineColorClass(match.id, isDark)}`}>
                            {idx + 1}. {match.name}
                          </span>
                          {isOverriddenDirectly && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 shrink-0">
                              Custom
                            </span>
                          )}
                        </div>

                        {/* Miniature realtime styled preview line inside the header when collapsed */}
                        {!isExpanded && (
                          <div 
                            className={`text-[10.5px] pl-10.5 font-medium break-words leading-tight opacity-85 hover:opacity-100 ${getHeadlineColorClass(match.id, isDark)}`}
                            style={{
                              fontFamily: activeConfig.fontFamily,
                              fontWeight: activeConfig.bold ? 'bold' : 'normal',
                              fontStyle: activeConfig.italic ? 'italic' : 'normal',
                              textTransform: activeConfig.uppercase ? 'uppercase' : 'none',
                            }}
                          >
                            {(previewString || '').replace(/\n/g, ' • ').substring(0, 80)}
                            {(previewString || '').length > 80 ? '...' : ''}
                          </div>
                        )}
                      </div>

                      {/* Expand Arrow Indicator */}
                      <div className={`p-1 rounded-lg transition-transform ${
                        isExpanded 
                          ? 'bg-indigo-500/10 text-indigo-500' 
                          : 'bg-slate-300/10 text-slate-400'
                      }`}>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Single Font Editor Control Panel Body (rendered when expanded) */}
                    {isExpanded && (
                      <div className={`p-1 border-t ${isDark ? 'border-[#1b2645]/40 bg-[#070b13]/40' : 'border-indigo-100 bg-white'}`}>
                        {match.id === 'university' && setCoverData && coverData && (
                          <div className={`p-4 border-b border-dashed mb-2 space-y-3 rounded-xl ${
                            isDark ? 'border-[#1a284c]/50 bg-[#0e1628]/30' : 'border-slate-200 bg-slate-50/50'
                          }`}>
                            <div className="flex items-center space-x-1.5 pl-0.5">
                              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-green-600 dark:text-green-400">
                                Select or Customize Varsity Name
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2.5">
                              <div>
                                <select
                                  id="select-university-preset"
                                  value={coverData.universityName || coverData.teacherUniversity || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                      setCoverData(prev => ({
                                        ...prev,
                                        universityName: val,
                                        teacherUniversity: val,
                                        studentUniversity: val,
                                      }));
                                    }
                                  }}
                                  className={`w-full text-xs p-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                                    isDark 
                                      ? 'bg-[#121c33] border-[#22335c] text-white' 
                                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                                  }`}
                                >
                                  <option value="">-- Choose Preset or Write Below --</option>
                                  <option value="Khulna University">Khulna University</option>
                                  <option value="University of Dhaka">University of Dhaka</option>
                                  <option value="Jagannath University">Jagannath University</option>
                                  <option value="University of Chittagong">University of Chittagong</option>
                                  <option value="Rajshahi University">Rajshahi University</option>
                                  <option value="Presidency University">Presidency University</option>
                                  <option value="Jahangirnagar University">Jahangirnagar University</option>
                                  <option value="Bangladesh University of Engineering and Technology">BUET</option>
                                  <option value="Rajshahi University of Engineering & Technology">RUET</option>
                                  <option value="Shahjalal University of Science and Technology">SUST</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block pl-0.5">
                                  Or custom edit name
                                </span>
                                <input
                                  id="input-university-custom"
                                  type="text"
                                  value={coverData.universityName || coverData.teacherUniversity || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCoverData(prev => ({
                                      ...prev,
                                      universityName: val,
                                      teacherUniversity: val,
                                      studentUniversity: val,
                                    }));
                                  }}
                                  placeholder="Type custom varsity title..."
                                  className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium ${
                                    isDark 
                                      ? 'bg-[#121c33] border-[#22335c] text-white placeholder-slate-500' 
                                      : 'bg-white border-slate-200 text-slate-700 shadow-sm placeholder-slate-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {match.id === 'discipline' && (
                          <div className={`p-4 border-b border-dashed mb-2 space-y-3 rounded-xl ${
                            isDark ? 'border-[#1a284c]/50 bg-[#0e1628]/30' : 'border-slate-200 bg-slate-50/50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#d95d39] dark:text-[#fa8072]">
                                Label Terminology
                              </span>
                              <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-0.5 border dark:border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => setCoverDesign(prev => ({ ...prev, disciplineLabel: 'Discipline' }))}
                                  className={`px-3 py-1 select-none text-[10px] font-sans font-bold uppercase rounded-md transition-all cursor-pointer ${
                                    (coverDesign.disciplineLabel || 'Discipline') === 'Discipline'
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                  }`}
                                >
                                  Discipline
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCoverDesign(prev => ({ ...prev, disciplineLabel: 'Department' }))}
                                  className={`px-3 py-1 select-none text-[10px] font-sans font-bold uppercase rounded-md transition-all cursor-pointer ${
                                    (coverDesign.disciplineLabel || 'Discipline') === 'Department'
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                  }`}
                                >
                                  Department
                                </button>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal pl-0.5">
                              This toggle updates dynamic label fallbacks and defaults on the rendered cover page to match your school structure.
                            </p>
                          </div>
                        )}
                        <SingleFontEditor
                          key={match.id}
                          id={match.id}
                          label={match.name}
                          config={activeConfig}
                          onChange={(key, val) => updateFontConfig(match.id, key, val)}
                          isDark={isDark}
                          inputClass={inputClass}
                          cardClass="bg-transparent border-none shadow-none"
                          labelClass={labelClass}
                          minSize={match.min}
                          maxSize={match.max}
                          showAlignment={match.align}
                          previewText={previewString}
                          onReset={isOverriddenDirectly ? () => {
                            setCoverDesign(prev => {
                              const updated = { ...prev };
                              delete (updated as any)[designKey];
                              return updated;
                            });
                          } : undefined}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 2: BORDERS & COLORS */}
        {activeTab === 'borders' && (
          <motion.div
            key="borders"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="space-y-4 font-sans"
          >
            {/* Color controls */}
            <div className={`${cardClass} p-4 rounded-2xl space-y-4`}>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                <span className="text-[10px] font-mono font-extrabold text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                  Border Design Framework
                </span>
              </div>
              
              <div>
                <label className="block text-[10px] font-mono font-extrabold text-slate-400 mb-2 uppercase">Accent Color (Headlines)</label>
                <div className={`flex items-center space-x-3 border rounded-xl px-2.5 py-2 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                  <input 
                    type="color" 
                    value={coverDesign.accentColor}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={coverDesign.accentColor}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, accentColor: e.target.value }))}
                    className={`bg-transparent border-none text-xs focus:outline-none w-full font-mono scale-95 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                  />
                </div>
                {/* Visual Accent Presets */}
                <div className="flex items-center space-x-2 mt-2 flex-wrap gap-y-1">
                  <span className="text-[9px] font-mono text-slate-400">Presets:</span>
                  {[
                    { name: 'Royal Blue', value: '#1e3a8a', labelBg: 'bg-[#1e3a8a]' },
                    { name: 'Classic Crimson', value: '#8b0000', labelBg: 'bg-[#8b0000]' },
                    { name: 'Teal Business', value: '#0d9488', labelBg: 'bg-[#0d9488]' },
                    { name: 'Light Salmon Accent', value: '#ffa07a', labelBg: 'bg-[#ffa07a]' },
                    { name: 'Salmon Coral', value: '#fa8072', labelBg: 'bg-[#fa8072]' },
                    { name: 'Deep Terracotta', value: '#c2410c', labelBg: 'bg-[#c2410c]' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setCoverDesign(prev => ({ ...prev, accentColor: preset.value }))}
                      className={`w-4 h-4 rounded-full border border-slate-200/50 cursor-pointer hover:scale-110 transition-transform ${preset.labelBg} ${
                        coverDesign.accentColor === preset.value ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold text-slate-400 mb-2 uppercase">Page Background Color (Paper)</label>
                <div className={`flex items-center space-x-3 border rounded-xl px-2.5 py-2 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                  <input 
                    type="color" 
                    value={coverDesign.paperColor || '#ffffff'}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, paperColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={coverDesign.paperColor || '#ffffff'}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, paperColor: e.target.value }))}
                    className={`bg-transparent border-none text-xs focus:outline-none w-full font-mono scale-95 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                  />
                </div>
                {/* Visual Paper Presets */}
                <div className="flex items-center space-x-2 mt-2 flex-wrap gap-y-1">
                  <span className="text-[9px] font-mono text-slate-400">Presets:</span>
                  {[
                    { name: 'White', value: '#ffffff', labelBg: 'bg-white border-slate-300' },
                    { name: 'Warm Cream', value: '#fdfbf7', labelBg: 'bg-[#fdfbf7] border-[#ecdac2]' },
                    { name: 'Soft Sand', value: '#f6f3eb', labelBg: 'bg-[#f6f3eb] border-[#ded9c9]' },
                    { name: 'Light Salmon background', value: '#ffe4d6', labelBg: 'bg-[#ffe4d6] border-[#f2c7b1]' },
                    { name: 'Salmon Tint background', value: '#fff0eb', labelBg: 'bg-[#fff0eb] border-[#fbdcd0]' },
                    { name: 'Academic Ivory', value: '#faf8f5', labelBg: 'bg-[#faf8f5] border-[#eae5dc]' },
                    { name: 'Linen Parchment', value: '#faf0e6', labelBg: 'bg-[#faf0e6] border-[#eaddcf]' },
                    { name: 'Mint Whisper', value: '#f4f8f6', labelBg: 'bg-[#f4f8f6] border-[#e2ece7]' },
                    { name: 'Glacier Blue', value: '#f1f5f9', labelBg: 'bg-[#f1f5f9] border-[#e2e8f0]' },
                    { name: 'Editorial Rose', value: '#fdf5f5', labelBg: 'bg-[#fdf5f5] border-[#f8e4e4]' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setCoverDesign(prev => ({ ...prev, paperColor: preset.value }))}
                      className={`w-4 h-4 rounded-full border cursor-pointer hover:scale-110 transition-transform ${preset.labelBg} ${
                        coverDesign.paperColor === preset.value ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold text-slate-400 mb-2 uppercase">Border Color Override</label>
                <div className={`flex items-center space-x-3 border rounded-xl px-2.5 py-2 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                  <input 
                    type="color" 
                    value={coverDesign.borderColor}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, borderColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={coverDesign.borderColor}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, borderColor: e.target.value }))}
                    className={`bg-transparent border-none text-xs focus:outline-none w-full font-mono scale-95 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                  />
                </div>
                {/* Visual Border Presets */}
                <div className="flex items-center space-x-2 mt-2 flex-wrap gap-y-1">
                  <span className="text-[9px] font-mono text-slate-400">Presets:</span>
                  {[
                    { name: 'Royal Blue', value: '#1e3a8a', labelBg: 'bg-[#1e3a8a]' },
                    { name: 'Classic Crimson', value: '#8b0000', labelBg: 'bg-[#8b0000]' },
                    { name: 'Gold/Akar', value: '#d97706', labelBg: 'bg-[#d97706]' },
                    { name: 'Salmon Border', value: '#ffa07a', labelBg: 'bg-[#ffa07a]' },
                    { name: 'Deep Terracotta', value: '#c2410c', labelBg: 'bg-[#c2410c]' },
                    { name: 'Dark Slate', value: '#0f172a', labelBg: 'bg-[#0f172a]' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setCoverDesign(prev => ({ ...prev, borderColor: preset.value }))}
                      className={`w-4 h-4 rounded-full border border-slate-200/50 cursor-pointer hover:scale-110 transition-transform ${preset.labelBg} ${
                        coverDesign.borderColor === preset.value ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold text-slate-400 mb-2 uppercase">Academic Border Style</label>
                <select 
                  value={coverDesign.borderStyle}
                  onChange={(e) => setCoverDesign(prev => ({ ...prev, borderStyle: e.target.value as any }))}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all border ${inputClass}`}
                >
                  <option value="none">No Academic Borders</option>
                  <option value="single">Single Classic Solid Line</option>
                  <option value="double">Double Standard Academic Line</option>
                  <option value="classic">Classical Geometric Corner Trim</option>
                  <option value="modern">Modern Border Bands (Header/Footer)</option>
                </select>
              </div>

              {coverDesign.borderStyle !== 'none' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">Border Width</label>
                    <div className={`flex items-center space-x-1.5 border rounded-lg px-2 py-0.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                      <button
                        type="button"
                        onClick={() => setCoverDesign(prev => ({ ...prev, borderWidth: Math.max(1, (prev.borderWidth || 6) - 1) }))}
                        className={`w-5 h-5 flex items-center justify-center rounded border text-xs font-bold cursor-pointer transition-colors ${
                          isDark ? 'bg-[#111728] text-slate-300 border-[#1f2a4a] hover:bg-slate-808' : 'bg-white text-slate-600 border-slate-202 hover:bg-slate-100'
                        }`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        step={1}
                        value={coverDesign.borderWidth || 6}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setCoverDesign(prev => ({ ...prev, borderWidth: Math.max(1, Math.min(20, val)) }));
                          }
                        }}
                        className={`w-10 bg-transparent text-center text-xs py-0.5 outline-none focus:outline-none font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                      />
                      <span className="text-[10px] text-slate-500 font-mono">px</span>
                      <button
                        type="button"
                        onClick={() => setCoverDesign(prev => ({ ...prev, borderWidth: Math.min(20, (prev.borderWidth || 6) + 1) }))}
                        className={`w-5 h-5 flex items-center justify-center rounded border text-xs font-bold cursor-pointer transition-colors ${
                          isDark ? 'bg-[#111728] text-slate-300 border-[#1f2a4a] hover:bg-slate-808' : 'bg-white text-slate-600 border-slate-202 hover:bg-slate-100'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-3 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-[10px] font-mono text-slate-500 min-w-[24px]">1px</span>
                    <input 
                      type="range" 
                      min={1} 
                      max={20} 
                      step={1}
                      value={coverDesign.borderWidth || 6}
                      onChange={(e) => setCoverDesign(prev => ({ ...prev, borderWidth: parseInt(e.target.value) }))}
                      className="flex-1 h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[10px] font-mono text-slate-500 min-w-[24px] text-right font-bold">20px</span>
                  </div>
                </div>
              )}
            </div>

            {/* Extra rules */}
            <div className={`${cardClass} p-4 rounded-2xl space-y-3.5`}>
              <div className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[10px] font-mono font-extrabold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
                  Page Margin Lines
                </span>
              </div>
              
              <label className="flex items-center space-x-3 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  checked={coverDesign.hasHeaderLine}
                  onChange={(e) => setCoverDesign(prev => ({ ...prev, hasHeaderLine: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#1a233d] bg-[#070b13] text-indigo-500 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Top Academic Header Line</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  checked={coverDesign.hasFooterLine}
                  onChange={(e) => setCoverDesign(prev => ({ ...prev, hasFooterLine: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#1a233d] bg-[#070b13] text-indigo-500 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Bottom Academic Footer Line</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* TAB 3: BRANDING & QR */}
        {activeTab === 'watermark' && (
          <motion.div
            key="watermark"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="space-y-4 font-sans"
          >
            
            {/* LOGO */}
            <div className={`${cardClass} p-4 rounded-2xl space-y-4`}>
              <h3 className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest flex items-center">
                <span className="inline-block w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2 animate-pulse" />
                Primary University crest
              </h3>

              {/* Upload field */}
              <div 
                onDragOver={(e) => handleDragOver(e, 'logo')}
                onDragLeave={() => handleDragLeave('logo')}
                onDrop={(e) => handleDrop(e, 'logo')}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  isDraggingLogo 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : isDark 
                      ? 'border-[#1a233d] bg-[#070b13]/50 hover:bg-[#070b13]/80' 
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <input 
                  type="file" 
                  id="designer-logo-upload" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  className="hidden"
                />
                <label htmlFor="designer-logo-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-6 h-6 text-indigo-400 mb-2 animate-bounce" />
                  <span className={`text-xs font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Drag & drop or <span className="text-indigo-500">browse</span> custom crest
                  </span>
                  <span className="text-[9px] text-slate-500 block mt-1">Supports PNG, JPG, or SVG</span>
                </label>
              </div>

              {/* Custom Logo Live Preview */}
              <div className="space-y-2">
                <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-wide mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Crest Logo Preview
                </label>
                <div 
                  className={`border rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] relative transition-all ${
                    isDark ? 'border-[#1a233d] bg-[#070b13]/30' : 'border-slate-205 bg-slate-50/30'
                  }`}
                >
                  {coverDesign.logoUrl ? (() => {
                    const preset = LOGO_PRESETS.find(p => p.id === coverDesign.logoUrl);
                    return (
                      <div className="flex flex-col items-center justify-center space-y-3 w-full animate-fadeIn">
                        <div className="p-3 bg-white/95 rounded-xl shadow-inner border border-slate-200/50 flex items-center justify-center transition-all duration-205" style={{ height: '90px', width: '90px' }}>
                          {preset ? (
                            <svg className="w-full h-full text-indigo-905" viewBox={preset.viewBox} dangerouslySetInnerHTML={{ __html: preset.svgPath }} />
                          ) : (
                            <img src={coverDesign.logoUrl} className="max-h-full max-w-full object-contain" alt="Uploaded Crest" referrerPolicy="no-referrer" />
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-center text-slate-400">
                          {preset ? preset.name : "Custom Uploaded Crest"}
                        </span>
                      </div>
                    );
                  })() : (
                    <div className="text-center py-4 flex flex-col items-center justify-center space-y-1 select-none">
                      <span className="text-2xl opacity-60">🛡️</span>
                      <p className="text-[10px] font-medium text-slate-400 max-w-[200px] leading-relaxed">
                        No logo uploaded yet. Drag or browse an image above from your gallery.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Size Adjuster Option */}
              {coverDesign.logoUrl && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>
                        Crest Logo Size
                      </label>
                      <div className={`flex items-center space-x-1.5 border rounded-lg px-2 py-0.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                        <button
                          type="button"
                          onClick={() => setCoverDesign(prev => ({ ...prev, logoHeight: Math.max(30, (prev.logoHeight || 110) - 5) }))}
                          className={`w-5 h-5 flex items-center justify-center rounded border text-xs font-bold cursor-pointer transition-colors ${
                            isDark ? 'bg-[#111728] text-slate-305 border-[#1f2a4a] hover:bg-slate-800' : 'bg-white text-slate-605 border-slate-200 hover:bg-slate-101'
                          }`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={30}
                          max={240}
                          value={coverDesign.logoHeight || 110}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              setCoverDesign(prev => ({ ...prev, logoHeight: Math.max(30, Math.min(240, val)) }));
                            }
                          }}
                          className={`w-8 bg-transparent text-center text-xs py-0.5 outline-none focus:outline-none font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">px</span>
                        <button
                          type="button"
                          onClick={() => setCoverDesign(prev => ({ ...prev, logoHeight: Math.min(240, (prev.logoHeight || 110) + 5) }))}
                          className={`w-5 h-5 flex items-center justify-center rounded border text-xs font-bold cursor-pointer transition-colors ${
                            isDark ? 'bg-[#111728] text-slate-305 border-[#1f2a4a] hover:bg-slate-800' : 'bg-white text-slate-605 border-slate-200 hover:bg-slate-101'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-3 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] font-mono text-slate-450 min-w-[24px]">30px</span>
                      <input 
                        type="range" 
                        min={30} 
                        max={240} 
                        step={5}
                        value={coverDesign.logoHeight || 110}
                        onChange={(e) => setCoverDesign(prev => ({ ...prev, logoHeight: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-500"
                      />
                      <span className="text-[10px] font-mono text-slate-450 min-w-[24px] text-right font-bold">{coverDesign.logoHeight || 110}px</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Clear Logo button */}
              {coverDesign.logoUrl && (
                <button
                  type="button"
                  onClick={() => setCoverDesign(prev => ({ ...prev, logoUrl: '' }))}
                  className="w-full text-center text-[10px] font-bold text-red-400 py-2 border border-dashed border-red-500/20 rounded-xl hover:bg-red-500/10 cursor-pointer transition-colors"
                >
                  Unset / Clear Shield
                </button>
              )}
            </div>

            {/* WATERMARK */}
            <div className={`${cardClass} p-4 rounded-2xl space-y-4`}>
              <h3 className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-widest flex items-center">
                <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full mr-2 animate-pulse" />
                Background Watermark
              </h3>

              {/* Upload watermark */}
              <div 
                onDragOver={(e) => handleDragOver(e, 'watermark')}
                onDragLeave={() => handleDragLeave('watermark')}
                onDrop={(e) => handleDrop(e, 'watermark')}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  isDraggingWatermark 
                    ? 'border-amber-500 bg-amber-500/10' 
                    : isDark 
                      ? 'border-[#1a233d] bg-[#070b13]/50 hover:bg-[#070b13]/80' 
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <input 
                  type="file" 
                  id="designer-watermark-upload" 
                  accept="image/*"
                  onChange={handleLocalWatermarkUpload}
                  className="hidden"
                  disabled={isRemovingBg}
                />
                {isRemovingBg ? (
                  <div className="flex flex-col items-center justify-center space-y-3 py-3">
                    <div className="w-8 h-8 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                    <div>
                      <span className="text-xs font-bold block text-amber-500 animate-pulse">Processing transparent watermark...</span>
                      <span className="text-[10px] text-slate-500 block mt-1">Cloud API processing</span>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="designer-watermark-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-6 h-6 text-amber-405 mb-2 animate-bounce" />
                    <span className={`text-xs font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Drag & drop or <span className="text-amber-500">browse</span> watermark
                    </span>
                    <span className="text-[9px] text-slate-500 block mt-1">Supports PNG, JPG, or SVG</span>
                  </label>
                )}
              </div>

              {/* Bypassing Toggle Option */}
              <div className="flex items-center justify-between px-1 py-0.5">
                <label className="flex items-center space-x-2 cursor-pointer group text-[11px] font-semibold text-slate-400">
                  <input 
                    type="checkbox" 
                    id="keep-original-bg-toggle"
                    checked={keepOriginalBg} 
                    onChange={(e) => setKeepOriginalBg(e.target.checked)}
                    className="rounded border-slate-300 dark:border-[#1a233d] text-amber-505 focus:ring-amber-500 w-4 h-4 cursor-pointer accent-amber-500"
                  />
                  <span className={`${isDark ? 'text-slate-450 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'} select-none transition-colors`}>
                    Keep Original Background
                  </span>
                </label>
                {bgRemovalError && (
                  <span className="text-[9px] text-red-400 font-mono" title={bgRemovalError}>AI Fail (Used Original)</span>
                )}
              </div>

              {/* Watermark presets */}
              <div>
                <label className={`block text-[9px] font-mono font-extrabold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-455' : 'text-slate-500'}`}>Built-in presets</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {WATERMARK_PRESETS.map((preset) => {
                    const isSelected = coverDesign.watermarkUrl === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setCoverDesign(prev => ({ ...prev, watermarkUrl: preset.id }))}
                        className={`p-2 rounded-xl text-[10px] font-semibold border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500' 
                            : isDark ? 'bg-[#070b13] border-slate-900 hover:border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="w-5 h-5 bg-white p-0.5 rounded flex items-center justify-center text-slate-800 shrink-0 select-none">
                          <svg viewBox={preset.viewBox || "0 0 100 100"} className="w-full h-full" dangerouslySetInnerHTML={{ __html: preset.svgPath }} />
                        </div>
                        <span className="truncate">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Watermark settings */}
              {coverDesign.watermarkUrl && coverDesign.watermarkUrl !== 'wm-none' && (
                <div className="space-y-4 pt-1 animate-fadeIn">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>
                        {isUploadedWatermark ? 'Watermark Image Opacity' : 'Transparency Opacity'} ({Math.round((coverDesign.watermarkOpacity !== undefined ? coverDesign.watermarkOpacity : 0.08) * 100)}%)
                      </label>
                      {isUploadedWatermark && (
                        <button
                          type="button"
                          onClick={() => setCoverDesign(prev => ({ ...prev, watermarkUrl: 'wm-none' }))}
                          className="text-[9px] font-mono font-extrabold uppercase text-rose-500 hover:text-rose-400 cursor-pointer transition-colors"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-2.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                      <input 
                        type="range" 
                        min={0.01} 
                        max={isUploadedWatermark ? 1.0 : 0.40} 
                        step={0.01}
                        value={coverDesign.watermarkOpacity !== undefined ? coverDesign.watermarkOpacity : 0.08}
                        onChange={(e) => setCoverDesign(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-500"
                      />
                    </div>
                    {isUploadedWatermark && (
                      <span className="block text-[9px] mt-1 text-slate-550 font-mono">
                        Slide to adjust transparency visibility of your uploaded custom watermark image from 1% to 100% in real-time.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2 ${labelClass}`}>Watermark Scale ({coverDesign.watermarkScale}%)</label>
                    <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-2.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                      <input 
                        type="range" 
                        min={60} 
                        max={180} 
                        value={coverDesign.watermarkScale || 110}
                        onChange={(e) => setCoverDesign(prev => ({ ...prev, watermarkScale: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Animate Watermark (Smooth Pan) Toggle */}
                  <div className="flex items-center justify-between border-t border-dashed border-slate-200 dark:border-[#1a233d]/60 pt-3 mt-1">
                    <label htmlFor="keep-watermark-animate" className={`text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass} cursor-pointer select-none`}>
                      Animate Watermark (Smooth Pan)
                    </label>
                    <input 
                      type="checkbox"
                      id="keep-watermark-animate"
                      checked={coverDesign.watermarkAnimate || false}
                      onChange={(e) => setCoverDesign(prev => ({ ...prev, watermarkAnimate: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-350 bg-slate-50 dark:border-[#1a233d] dark:bg-[#070b13] text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Manual position offset adjustments */}
                  <div className="border-t border-dashed border-slate-200 dark:border-[#1a233d]/60 pt-3 mt-1 space-y-4">
                    <span className={`block text-[10px] font-mono font-bold uppercase tracking-wider ${labelClass}`}>
                      Alignment & Position Shift
                    </span>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>
                          Horizontal Shift ({coverDesign.watermarkXOffset || 0}px)
                        </label>
                        <button 
                          onClick={() => setCoverDesign(prev => ({ ...prev, watermarkXOffset: 0 }))}
                          className="text-[9px] font-mono font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer select-none"
                        >
                          Center X
                        </button>
                      </div>
                      <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-2.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                        <input 
                          type="range" 
                          min={-350} 
                          max={350} 
                          step={5}
                          value={coverDesign.watermarkXOffset !== undefined ? coverDesign.watermarkXOffset : 0}
                          onChange={(e) => setCoverDesign(prev => ({ ...prev, watermarkXOffset: parseInt(e.target.value) }))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>
                          Vertical Shift ({coverDesign.watermarkYOffset || 0}px)
                        </label>
                        <button 
                          onClick={() => setCoverDesign(prev => ({ ...prev, watermarkYOffset: 0 }))}
                          className="text-[9px] font-mono font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer select-none"
                        >
                          Center Y
                        </button>
                      </div>
                      <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-2.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                        <input 
                          type="range" 
                          min={-500} 
                          max={500} 
                          step={5}
                          value={coverDesign.watermarkYOffset !== undefined ? coverDesign.watermarkYOffset : 0}
                          onChange={(e) => setCoverDesign(prev => ({ ...prev, watermarkYOffset: parseInt(e.target.value) }))}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* QR CODE STAMP */}
            <div className={`${cardClass} p-4 rounded-2xl space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono font-extrabold text-teal-500 dark:text-teal-400 uppercase tracking-widest flex items-center animate-pulse">
                  <span className="inline-block w-2.5 h-2.5 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.6)] mr-2" />
                  Dynamic QR Code Link
                </h3>
                <input 
                  type="checkbox"
                  id="designer-qrcode-checkbox"
                  checked={coverDesign.showQrCode || false}
                  onChange={(e) => setCoverDesign(prev => ({ ...prev, showQrCode: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#1a233d] bg-[#070b13] text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </div>

              {coverDesign.showQrCode && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2 ${labelClass}`}>QR Target URL / Text</label>
                    <input 
                      type="text"
                      value={coverDesign.qrCodeUrl || ''}
                      onChange={(e) => setCoverDesign(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                      placeholder="e.g., github or academic submission link"
                      className={`w-full text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all font-sans border ${inputClass}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2 ${labelClass}`}>Stamp Position</label>
                    <select 
                      value={coverDesign.qrCodePosition || 'bottom-right'}
                      onChange={(e) => setCoverDesign(prev => ({ ...prev, qrCodePosition: e.target.value as any }))}
                      className={`w-full text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all border ${inputClass}`}
                    >
                      <option value="bottom-right">Bottom Right Corner</option>
                      <option value="bottom-left">Bottom Left Corner</option>
                      <option value="top-right">Top Right Corner</option>
                      <option value="top-left">Top Left Corner</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${labelClass}`}>QR Code Stamp Size</label>
                      <div className={`flex items-center space-x-1.5 border rounded-lg px-2 py-0.5 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                        <button
                          type="button"
                          onClick={() => setCoverDesign(prev => ({ ...prev, qrCodeSize: Math.max(40, (prev.qrCodeSize || 60) - 5) }))}
                          className={`w-5 h-5 flex items-center justify-center rounded border text-xs font-bold cursor-pointer transition-colors ${
                            isDark ? 'bg-[#111728] text-slate-300 border-[#1f2a4a] hover:bg-slate-800' : 'bg-white text-slate-605 border-slate-200 hover:bg-slate-101'
                          }`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={40}
                          max={120}
                          step={5}
                          value={coverDesign.qrCodeSize || 60}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              setCoverDesign(prev => ({ ...prev, qrCodeSize: Math.max(40, Math.min(120, val)) }));
                            }
                          }}
                          className={`w-8 bg-transparent text-center text-xs py-0.5 outline-none focus:outline-none font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">px</span>
                        <button
                          type="button"
                          onClick={() => setCoverDesign(prev => ({ ...prev, qrCodeSize: Math.min(120, (prev.qrCodeSize || 60) + 5) }))}
                          className={`w-5 h-5 flex items-center justify-center rounded border text-xs font-bold cursor-pointer transition-colors ${
                            isDark ? 'bg-[#111728] text-slate-300 border-[#1f2a4a] hover:bg-slate-800' : 'bg-white text-slate-605 border-slate-200 hover:bg-slate-101'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-3 ${isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] font-mono text-slate-505 min-w-[24px]">40px</span>
                      <input 
                        type="range" 
                        min={40} 
                        max={120} 
                        step={5}
                        value={coverDesign.qrCodeSize || 60}
                        onChange={(e) => setCoverDesign(prev => ({ ...prev, qrCodeSize: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-slate-200 dark:bg-slate-950 rounded-lg cursor-pointer accent-indigo-500"
                      />
                      <span className="text-[10px] font-mono text-slate-500 min-w-[24px] text-right font-bold">120px</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {activeTab === 'background' && (
          <motion.div
            key="background"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="space-y-4 font-sans text-left"
          >
            
            {/* Header description */}
            <div className="flex flex-col space-y-1.5 px-0.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-1.5 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-[10px] font-mono font-extrabold uppercase tracking-wide">
                  Canvas Background Style
                </span>
                <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Document Palette
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Customize the paper color of your academic cover sheet. Choose from traditional university pastel standards or set a bespoke background tone.
              </p>
            </div>

            {/* Main Background Panel card */}
            <div className={`${isDark ? 'bg-[#0b0f19] border-[#1f2942]/60' : 'bg-white border-slate-200/80'} p-5 border rounded-2xl shadow-sm space-y-5`}>
              
              {/* Color Picker Control */}
              <div className="space-y-2">
                <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Bespoke Interactive Color Picker
                </label>
                <div className="flex items-center space-x-3.5">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 shrink-0 cursor-pointer hover:scale-105 transition-all">
                    <input 
                      type="color"
                      value={pageBackgroundColor}
                      onChange={(e) => onChangePageBackgroundColor?.(e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer transform scale-150"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="text"
                      value={pageBackgroundColor.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
                          onChangePageBackgroundColor?.(val);
                        }
                      }}
                      className={`w-full max-w-[120px] font-mono font-bold text-xs uppercase text-center px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500/40 ${
                        isDark ? 'bg-[#060810] border-[#1e2a47] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-850'
                      }`}
                      placeholder="#FFFFFF"
                    />
                    <p className="text-[9px] text-slate-500 font-mono">Hexadecimal web signature format</p>
                  </div>
                </div>
              </div>

              {/* Grid of Preset Swatches (pastel blue, soft gray, pale yellow, mint green, light salmon, and white) */}
              <div className="space-y-2">
                <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Academic Design Preset Swatches
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: 'Pure Cotton White', hex: '#ffffff' },
                    { name: 'Warm Light Salmon', hex: '#fff0eb' },
                    { name: 'Classic Crepe Blue', hex: '#f0f9ff' },
                    { name: 'Slate Soft Gray', hex: '#f8fafc' },
                    { name: 'Pale Corn Yellow', hex: '#fefcf0' },
                    { name: 'Mint Eucalyptus Green', hex: '#f0fdf4' },
                    { name: 'Academic Ivory', hex: '#faf8f5' },
                    { name: 'Linen Parchment', hex: '#faf0e6' },
                    { name: 'Mint Whisper', hex: '#f4f8f6' },
                    { name: 'Glacier Blue', hex: '#f1f5f9' },
                    { name: 'Editorial Rose', hex: '#fdf5f5' },
                    { name: 'Cambridge Celadon', hex: '#eff5f1' },
                    { name: 'Oxford Imperial', hex: '#eff3f8' },
                    { name: 'Harvard Pearl Crimson', hex: '#fff3f3' },
                    { name: 'Vintage Sandstone', hex: '#faf5ef' },
                    { name: 'Antique Parchment', hex: '#f4ece1' },
                    { name: 'Royal Ivory Glow', hex: '#fffdf6' },
                    { name: 'Rose Quartz Tint', hex: '#fff0f2' },
                    { name: 'Lilac Mist Satin', hex: '#faf5ff' },
                    { name: 'Sage Leaf Whisper', hex: '#f5f7f2' },
                    { name: 'Sand Castle Silk', hex: '#fffbf7' },
                    { name: 'Peach Breeze Cream', hex: '#fff4ee' },
                    { name: 'Seafoam Glow Wave', hex: '#f0fdf9' },
                    { name: 'Cool Nordic Chalk', hex: '#f9f9fb' }
                  ].map((preset) => {
                    const isSelected = pageBackgroundColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => onChangePageBackgroundColor?.(preset.hex)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-start gap-1 relative ${
                          isSelected 
                            ? isDark 
                              ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_2px_8px_rgba(99,102,241,0.25)] font-semibold' 
                              : 'bg-indigo-50/70 border-indigo-500 shadow-[0_2px_6px_rgba(99,102,241,0.12)] font-semibold' 
                            : isDark
                              ? 'bg-[#121828]/50 border-slate-800 hover:bg-[#121828] hover:border-slate-700'
                              : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <span 
                            style={{ backgroundColor: preset.hex }} 
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 shadow-sm"
                          />
                          <span className={`text-[10px] truncate leading-none capitalize ${
                            isSelected 
                              ? isDark ? 'text-indigo-300 font-bold' : 'text-indigo-700 font-bold' 
                              : isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            {preset.name}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono opacity-80 pl-5 text-slate-500 leading-none">
                          {preset.hex.toUpperCase()}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Synergy Note */}
              <div className={`p-3 rounded-xl border flex items-center space-x-2.5 text-[10px] leading-relaxed ${
                isDark ? 'bg-indigo-950/15 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50/40 border-indigo-200/50 text-indigo-700'
              }`}>
                <span>💡</span>
                <p>Selected background renders directly into the downloading high-fidelity PDF document sheets flawlessly.</p>
              </div>

            </div>

            {/* Back Cover / Last Page Settings Section */}
            <div className={`${isDark ? 'bg-[#0b0f19] border-[#1f2942]/60' : 'bg-white border-slate-200/80'} p-5 border rounded-2xl shadow-sm space-y-4`}>
              <h3 className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest flex items-center">
                <span className="inline-block w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2" />
                Back Cover / Last Page
              </h3>
              
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Enable a clean second page that syncs with your front cover design. Perfect for end-of-document presentation.
              </p>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={coverDesign.backPageEnabled || false}
                  onChange={(e) => setCoverDesign(prev => ({ ...prev, backPageEnabled: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#1a233d] bg-[#070b13] text-indigo-500 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Enable Back Cover Page</span>
              </label>

              {coverDesign.backPageEnabled && (
                <div className="space-y-2 animate-fadeIn pt-1">
                  <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Optional Custom Text (Vertically & Horizontally Centered)
                  </label>
                  <textarea
                    rows={4}
                    value={coverDesign.backPageText || ''}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, backPageText: e.target.value }))}
                    placeholder="e.g. THANK YOU&#10;Presented by Group B&#10;Department of Environmental Science"
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500/40 ${
                      isDark ? 'bg-[#060810] border-[#1e2a47] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-850'
                    }`}
                  />
                  <p className="text-[9px] text-slate-500 font-mono">Use line breaks to format lines. Text will match cover's default font family & typography colors.</p>
                </div>
              )}
            </div>

            {/* Submission Details Styling Section */}
            <div className={`${isDark ? 'bg-[#0b0f19] border-[#1f2942]/60' : 'bg-white border-slate-200/80'} p-5 border rounded-2xl shadow-sm space-y-4`}>
              <h3 className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest flex items-center">
                <span className="inline-block w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2" />
                Submission Details Styling
              </h3>
              
              <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                Control the typography emphasis and layout structure uniformly across all templates.
              </p>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={coverDesign.boldSubmissionDetails || false}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, boldSubmissionDetails: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#1a233d] bg-[#070b13] text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Bold Submission Details</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={coverDesign.showTopHeader !== false}
                    onChange={(e) => setCoverDesign(prev => ({ ...prev, showTopHeader: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#1a233d] bg-[#070b13] text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Show Top Header</span>
                </label>
              </div>
            </div>

          </motion.div>
        )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {hoveredTemplateId && activeTab === 'templates' && (() => {
          const matchedTmpl = [
            { id: 'ku', name: 'Template No 1', desc: 'Symmetric shield style with borderless canvas and clean serif layout.', badge: 'Royal Blue Accent' },
            { id: 'ku-law-table', name: 'Template No 2', desc: 'Academic layout structured with dual submitted tables.', badge: 'Premium KU Law' },
            { id: 'du-classic', name: 'Template No 3', desc: 'Formal Gothic-style headings, Classic inner lining border.', badge: 'Blue Gothic' },
            { id: 'du-minimal', name: 'Template No 4', desc: 'Borderless clean design and dual details column layout.', badge: 'Simple Times' },
            { id: 'jnu', name: 'Template No 5', desc: 'No-border elegant layout with decorative banner styling.', badge: 'Amber Highlight' },
            { id: 'ruet', name: 'Template No 6', desc: 'Orange-themed cover with side lines and custom watermark.', badge: 'Modern Accent' },
            { id: 'jnu-finance', name: 'Template No 7', desc: 'Dual-column layout with crimson and green details.', badge: 'Academic Finance' },
            { id: 'presidency', name: 'Template No 8', desc: 'Double border frame and bottom card closures.', badge: 'Presidency Blue' },
            { id: 'jnu-traditional', name: 'Template No 9', desc: 'Crest-aligned research cover layout with clean serif.', badge: 'Classic JNU' },
            { id: 'teal-bars', name: 'Template No 10', desc: 'Striking design with full-width teal color block fills.', badge: 'Teal Business' },
            { id: 'cu-boxed-code', name: 'Template No 11', desc: 'Elegant rectangular nested code frame enclosing.', badge: 'Chittagong Double-Frame' },
            { id: 'top-header-asymmetric', name: 'Template No 12', desc: 'Prestige layout featuring top header blocks.', badge: 'Asymmetric Header' }
          ].find(t => t.id === hoveredTemplateId);

          if (!matchedTmpl) return null;

          return (
            <motion.div
              initial={{ opacity: 0, x: -14, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -14, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`absolute left-[102%] top-6 md:top-12 z-50 w-[184px] p-4 rounded-3xl shadow-2xl border backdrop-blur-md pointer-events-none flex flex-col items-center gap-3.5 transition-colors duration-300 ${
                isDark 
                  ? 'bg-[#090d18]/95 border-indigo-500/40 shadow-indigo-950/70' 
                  : 'bg-white/95 border-indigo-200/85 shadow-slate-350'
              }`}
            >
              <div className="w-full flex items-center justify-between border-b pb-2 border-indigo-500/10">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#fa3f5e] animate-pulse">
                  Quick Preview
                </span>
                <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  {matchedTmpl.badge}
                </span>
              </div>
              
              <div className="p-1.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 shadow-inner">
                <TemplateThumbnail
                  id={hoveredTemplateId as any}
                  isSelected={coverDesign.templateId === hoveredTemplateId}
                  isDark={isDark}
                  large={true}
                />
              </div>

              <div className="text-center space-y-1">
                <h4 className={`text-xs font-bold leading-snug tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {matchedTmpl.name}
                </h4>
                <p className={`text-[9px] leading-normal font-sans opacity-85 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {matchedTmpl.desc}
                </p>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
