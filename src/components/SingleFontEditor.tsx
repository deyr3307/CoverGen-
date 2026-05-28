import React from 'react';
import { FontConfig, STANDARD_FONTS } from '../types';
import { FontSelectorDropdown } from './DesignBuilder';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Undo2 
} from 'lucide-react';

interface SingleFontEditorProps {
  id?: string;
  label: string;
  config: FontConfig;
  onChange: (key: keyof FontConfig, value: any) => void;
  isDark: boolean;
  inputClass: string;
  cardClass: string;
  labelClass: string;
  showAlignment?: boolean;
  minSize?: number;
  maxSize?: number;
  onReset?: () => void;
  colorPresetList?: string[];
  previewText?: string;
}

interface SubheadingStyle {
  text: string;
  bg: string;
  shadow: string;
  rawColor: string;
}

function getSubheadingColors(id: string | undefined, isDark: boolean): SubheadingStyle {
  const defaultColors: SubheadingStyle = {
    text: 'text-[#6366f1] dark:text-[#818cf8]',
    bg: 'bg-[#6366f1]',
    shadow: 'shadow-[0_0_8px_rgba(99,102,241,0.6)]',
    rawColor: '#6366f1'
  };
  
  if (!id) return defaultColors;
  
  switch (id) {
    case 'university':
      return {
        text: isDark ? 'text-green-400 font-extrabold' : 'text-green-600 font-extrabold',
        bg: isDark ? 'bg-green-400' : 'bg-green-500',
        shadow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
        rawColor: '#22c55e'
      };
    case 'discipline':
      return {
        text: isDark ? 'text-[#fa8072] font-extrabold' : 'text-[#d95d39] font-extrabold',
        bg: isDark ? 'bg-[#fa8072]' : 'bg-[#d95d39]',
        shadow: 'shadow-[0_0_8px_rgba(250,128,114,0.6)]',
        rawColor: '#d95d39'
      };
    case 'assignmentTopic':
      return {
        text: isDark ? 'text-blue-400 font-extrabold' : 'text-blue-600 font-extrabold',
        bg: isDark ? 'bg-blue-400' : 'bg-blue-500',
        shadow: 'shadow-[0_0_8px_rgba(59,130,246,0.6)]',
        rawColor: '#3b82f6'
      };
    case 'topicTitle':
      return {
        text: isDark ? 'text-amber-400 font-extrabold' : 'text-amber-600 font-extrabold',
        bg: isDark ? 'bg-amber-400' : 'bg-amber-500',
        shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        rawColor: '#f59e0b'
      };
    case 'courseNoHeading':
      return {
        text: isDark ? 'text-rose-400 font-extrabold' : 'text-rose-600 font-extrabold',
        bg: isDark ? 'bg-rose-400' : 'bg-rose-500',
        shadow: 'shadow-[0_0_8px_rgba(244,63,94,0.6)]',
        rawColor: '#f43f5e'
      };
    case 'courseNoContent':
      return {
        text: isDark ? 'text-teal-400 font-extrabold' : 'text-teal-600 font-extrabold',
        bg: isDark ? 'bg-teal-400' : 'bg-teal-500',
        shadow: 'shadow-[0_0_8px_rgba(20,184,166,0.6)]',
        rawColor: '#14b8a6'
      };
    case 'courseTitleHeading':
      return {
        text: isDark ? 'text-indigo-400 font-extrabold' : 'text-indigo-600 font-extrabold',
        bg: isDark ? 'bg-indigo-400' : 'bg-indigo-500',
        shadow: 'shadow-[0_0_8px_rgba(99,102,241,0.6)]',
        rawColor: '#6366f1'
      };
    case 'courseTitleContent':
      return {
        text: isDark ? 'text-cyan-400 font-extrabold' : 'text-cyan-600 font-extrabold',
        bg: isDark ? 'bg-cyan-400' : 'bg-cyan-500',
        shadow: 'shadow-[0_0_8px_rgba(6,182,212,0.6)]',
        rawColor: '#06b2d2'
      };
    case 'submittedToHeading':
      return {
        text: isDark ? 'text-emerald-400 font-extrabold' : 'text-emerald-600 font-extrabold',
        bg: isDark ? 'bg-emerald-400' : 'bg-emerald-500',
        shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]',
        rawColor: '#10b981'
      };
    case 'submittedToContent':
      return {
        text: isDark ? 'text-sky-400 font-extrabold' : 'text-sky-600 font-extrabold',
        bg: isDark ? 'bg-sky-400' : 'bg-sky-500',
        shadow: 'shadow-[0_0_8px_rgba(14,165,233,0.6)]',
        rawColor: '#0ea5e9'
      };
    case 'submittedByHeading':
      return {
        text: isDark ? 'text-purple-400 font-extrabold' : 'text-purple-600 font-extrabold',
        bg: isDark ? 'bg-purple-400' : 'bg-purple-500',
        shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.6)]',
        rawColor: '#a855f7'
      };
    case 'submittedByContent':
      return {
        text: isDark ? 'text-pink-400 font-extrabold' : 'text-pink-600 font-extrabold',
        bg: isDark ? 'bg-pink-400' : 'bg-pink-500',
        shadow: 'shadow-[0_0_8px_rgba(236,72,153,0.6)]',
        rawColor: '#ec4899'
      };
    case 'submissionDateHeading':
      return {
        text: isDark ? 'text-violet-400 font-extrabold' : 'text-violet-700 font-extrabold',
        bg: isDark ? 'bg-violet-400' : 'bg-violet-500',
        shadow: 'shadow-[0_0_8px_rgba(139,92,246,0.6)]',
        rawColor: '#8b5cf6'
      };
    case 'submissionDateContent':
      return {
        text: isDark ? 'text-fuchsia-400 font-extrabold' : 'text-fuchsia-600 font-extrabold',
        bg: isDark ? 'bg-fuchsia-400' : 'bg-fuchsia-500',
        shadow: 'shadow-[0_0_8px_rgba(217,70,239,0.6)]',
        rawColor: '#d946ef'
      };
    default:
      return defaultColors;
  }
}

const COLOR_GROUPS = [
  {
    name: 'Red',
    colors: [
      { name: 'IndianRed', hex: '#CD5C5C' },
      { name: 'LightCoral', hex: '#F08080' },
      { name: 'Salmon', hex: '#FA8072' },
      { name: 'DarkSalmon', hex: '#E9967A' },
      { name: 'LightSalmon', hex: '#FFA07A' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Crimson', hex: '#DC143C' },
      { name: 'FireBrick', hex: '#B22222' },
      { name: 'DarkRed', hex: '#8B0000' }
    ]
  },
  {
    name: 'Pink',
    colors: [
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'LightPink', hex: '#FFB6C1' },
      { name: 'HotPink', hex: '#FF69B4' },
      { name: 'DeepPink', hex: '#FF1493' },
      { name: 'MediumVioletRed', hex: '#C71585' },
      { name: 'PaleVioletRed', hex: '#DB7093' }
    ]
  },
  {
    name: 'Orange',
    colors: [
      { name: 'LightSalmon', hex: '#FFA07A' },
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Tomato', hex: '#FF6347' },
      { name: 'OrangeRed', hex: '#FF4500' },
      { name: 'DarkOrange', hex: '#FF8C00' },
      { name: 'Orange', hex: '#FFA500' }
    ]
  },
  {
    name: 'Green',
    colors: [
      { name: 'GreenYellow', hex: '#ADFF2F' },
      { name: 'Chartreuse', hex: '#7FFF00' },
      { name: 'LawnGreen', hex: '#7CFC00' },
      { name: 'Lime', hex: '#00FF00' },
      { name: 'LimeGreen', hex: '#32CD32' },
      { name: 'PaleGreen', hex: '#98FB98' },
      { name: 'LightGreen', hex: '#90EE90' },
      { name: 'MediumSpringGreen', hex: '#00FA9A' },
      { name: 'SpringGreen', hex: '#00FF7F' },
      { name: 'MediumSeaGreen', hex: '#3CB371' },
      { name: 'SeaGreen', hex: '#2E8B57' },
      { name: 'ForestGreen', hex: '#228B22' },
      { name: 'Green', hex: '#008000' },
      { name: 'DarkGreen', hex: '#006400' },
      { name: 'YellowGreen', hex: '#9ACD32' },
      { name: 'OliveDrab', hex: '#6B8E23' },
      { name: 'Olive', hex: '#808000' },
      { name: 'DarkOliveGreen', hex: '#556B2F' },
      { name: 'MediumAquamarine', hex: '#66CDAA' },
      { name: 'DarkSeaGreen', hex: '#8FBC8F' },
      { name: 'LightSeaGreen', hex: '#20B2AA' },
      { name: 'DarkCyan', hex: '#008B8B' },
      { name: 'Teal', hex: '#008080' }
    ]
  },
  {
    name: 'Blue/Cyan',
    colors: [
      { name: 'Aqua', hex: '#00FFFF' },
      { name: 'Cyan', hex: '#00E5FF' },
      { name: 'LightCyan', hex: '#E0FFFF' },
      { name: 'PaleTurquoise', hex: '#AFEEEE' },
      { name: 'Aquamarine', hex: '#7FFFD4' },
      { name: 'Turquoise', hex: '#40E0D0' },
      { name: 'MediumTurquoise', hex: '#48D1CC' },
      { name: 'DarkTurquoise', hex: '#00CED1' },
      { name: 'CadetBlue', hex: '#5F9EA0' },
      { name: 'SteelBlue', hex: '#4682B4' },
      { name: 'LightSteelBlue', hex: '#B0C4DE' },
      { name: 'PowderBlue', hex: '#B0E0E6' },
      { name: 'LightBlue', hex: '#ADD8E6' },
      { name: 'SkyBlue', hex: '#87CEEB' },
      { name: 'LightSkyBlue', hex: '#87CEFA' },
      { name: 'DeepSkyBlue', hex: '#00BFFF' },
      { name: 'DodgerBlue', hex: '#1E90FF' },
      { name: 'CornflowerBlue', hex: '#6495ED' },
      { name: 'RoyalBlue', hex: '#4169E1' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'MediumBlue', hex: '#0000CD' },
      { name: 'DarkBlue', hex: '#00008B' },
      { name: 'Navy', hex: '#000080' }
    ]
  },
  {
    name: 'Yellow',
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Yellow', hex: '#FFFF00' },
      { name: 'LightYellow', hex: '#FFFFE0' },
      { name: 'LemonChiffon', hex: '#FFFACD' },
      { name: 'LightGoldenrodYellow', hex: '#FAFAD2' },
      { name: 'PapayaWhip', hex: '#FFEFD5' },
      { name: 'Moccasin', hex: '#FFE4B5' },
      { name: 'PeachPuff', hex: '#FFDAB9' },
      { name: 'PaleGoldenrod', hex: '#EEE8AA' },
      { name: 'Khaki', hex: '#F0E68C' },
      { name: 'DarkKhaki', hex: '#BDB76B' }
    ]
  },
  {
    name: 'Purple',
    colors: [
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Thistle', hex: '#D8BFD8' },
      { name: 'Plum', hex: '#DDA0DD' },
      { name: 'Violet', hex: '#EE82EE' },
      { name: 'Orchid', hex: '#DA70D6' },
      { name: 'Fuchsia', hex: '#FF00FF' },
      { name: 'Magenta', hex: '#FF00FE' },
      { name: 'MediumOrchid', hex: '#BA55D3' },
      { name: 'MediumPurple', hex: '#9370DB' },
      { name: 'BlueViolet', hex: '#8A2BE2' },
      { name: 'DarkViolet', hex: '#9400D3' }
    ]
  },
  {
    name: 'Gray/Black/White',
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'GhostWhite', hex: '#F8F8FF' },
      { name: 'WhiteSmoke', hex: '#F5F5F5' },
      { name: 'Gainsboro', hex: '#DCDCDC' },
      { name: 'LightGray', hex: '#D3D3D3' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'DarkGray', hex: '#A9A9A9' },
      { name: 'Gray', hex: '#808080' },
      { name: 'DimGray', hex: '#696969' },
      { name: 'SlateGray', hex: '#708090' },
      { name: 'DarkSlateGray', hex: '#2F4F4F' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'JetBlack', hex: '#1E293B' },
      { name: 'RichBlack', hex: '#0F172A' },
      { name: 'Black', hex: '#000000' }
    ]
  }
];

export const SingleFontEditor: React.FC<SingleFontEditorProps> = ({
  id,
  label,
  config,
  onChange,
  isDark,
  inputClass,
  cardClass,
  labelClass,
  showAlignment = true,
  minSize = 2,
  maxSize = 50,
  onReset,
  colorPresetList = ['#1e293b', '#0f172a', '#1e3a8a', '#2563eb', '#3b82f6', '#0284c7', '#0ea5e9', '#0891b2', '#0d9488', '#0f766e', '#16a34a', '#15803d', '#b45309', '#d97706', '#f97316', '#dc2626', '#be123c', '#9f1239', '#7c3aed', '#6d28d9', '#86198f', '#db2777', '#475569', '#64748b'],
  previewText
}) => {
  const subheadingColor = getSubheadingColors(id, isDark);
  const [activeGroup, setActiveGroup] = React.useState<string>('Red');

  // Fallback clamping logic inside state callbacks to prevent any out-of-bounds font sizes
  const handleSizeChange = (val: number) => {
    const clamped = Math.min(maxSize, Math.max(minSize, val));
    onChange('fontSize', clamped);
  };

  return (
    <div className={`${cardClass} p-4 rounded-2xl space-y-3.5 transition-all text-left`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-[10px] font-mono font-extrabold uppercase tracking-widest flex items-center ${subheadingColor.text}`}>
          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${subheadingColor.bg} ${subheadingColor.shadow}`} />
          {label}
        </h3>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            title="Reset to Theme Default"
            className={`p-1 rounded-lg transition-all cursor-pointer border hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
              isDark 
                ? 'bg-[#111728] border-[#1f2a4a] text-slate-400 hover:text-white hover:bg-[#1a243d]' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Undo2 className="w-3 h-3" style={{ color: subheadingColor.rawColor }} />
            Reset
          </button>
        )}
      </div>

      {/* Real-time Inline Topic Preview with accurate real-time rendering */}
      {previewText && (
        <div className="space-y-1 bg-slate-500/[0.02] dark:bg-slate-500/[0.01] p-1.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center px-1 pb-1">
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center gap-1">
              <span>✨ Live Preview</span>
            </span>
            <span className="text-[8px] font-mono text-slate-400">
              {(config?.fontFamily || '').replace(/"/g, '')} • {config?.fontSize || 12}pt
            </span>
          </div>
          <div className="p-4 rounded-lg border flex flex-col justify-center min-h-[85px] max-h-[175px] overflow-y-auto select-none bg-white border-slate-200/80 shadow-inner relative">
            {/* Soft grid background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
            
            <div
              className="w-full break-words select-text z-10"
              style={{
                fontFamily: config.fontFamily,
                color: config.color,
                fontSize: `${config.fontSize * 0.8}pt`, // Proportional live preview font size scaling
                fontWeight: config.bold ? 'bold' : 'normal',
                fontStyle: config.italic ? 'italic' : 'normal',
                textTransform: config.uppercase ? 'uppercase' : 'none',
                textAlign: config.align || 'center',
                lineHeight: '1.35',
                whiteSpace: 'pre-line'
              }}
            >
              {previewText}
            </div>
          </div>
        </div>
      )}

      {/* 1. Font Family Section */}
      <div>
        <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1.5 ${subheadingColor.text}`}>
          Font Family
        </label>
        <FontSelectorDropdown
          value={config.fontFamily}
          onChange={(val) => onChange('fontFamily', val)}
          isDark={isDark}
          inputClass={inputClass}
        />
      </div>

      {/* 2. Font Size Slider & Precision Custom Controls */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider ${subheadingColor.text}`}>
            Font Size
          </label>
          <div className={`flex items-center space-x-1.5 border rounded-xl p-1 ${
            isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => handleSizeChange(Math.round((Number(config.fontSize || minSize) - 0.5) * 10) / 10)}
              title="Decrease Size"
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-extrabold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                isDark 
                  ? 'bg-[#111728] text-slate-300 hover:bg-[#1a243d] hover:text-white border-[#1f2a4a]' 
                  : 'bg-white text-slate-600 hover:bg-slate-200 border-slate-300'
              }`}
            >
              -
            </button>
            <input
              type="number"
              min={minSize}
              max={maxSize}
              step={0.5}
              value={config.fontSize || minSize}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  handleSizeChange(val);
                }
              }}
              className={`w-14 h-9 bg-transparent text-center text-sm outline-none focus:outline-none font-mono ${
                isDark ? 'text-slate-200' : 'text-slate-800 font-bold'
              }`}
            />
            <span className="text-[10px] text-slate-400 font-mono pr-1 select-none">pt</span>
            <button
              type="button"
              onClick={() => handleSizeChange(Math.round((Number(config.fontSize || minSize) + 0.5) * 10) / 10)}
              title="Increase Size"
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-extrabold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                isDark 
                  ? 'bg-[#111728] text-slate-300 hover:bg-[#1a243d] hover:text-white border-[#1f2a4a]' 
                  : 'bg-white text-slate-600 hover:bg-slate-200 border-slate-300'
              }`}
            >
              +
            </button>
          </div>
        </div>
        <div className={`flex items-center space-x-3 border rounded-xl px-3.5 py-2.5 ${
          isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-mono text-slate-400 min-w-[24px] select-none">{minSize}pt</span>
          <input 
            type="range" 
            min={minSize} 
            max={maxSize} 
            step={0.5}
            value={Number(config.fontSize || minSize)}
            onChange={(e) => handleSizeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer transition-all"
            style={{ accentColor: subheadingColor.rawColor }}
          />
          <span className="text-[10px] font-mono text-slate-400 min-w-[24px] text-right font-bold select-none">{maxSize}pt</span>
        </div>
      </div>

      {/* 3. Font Color Customization Section */}
      <div>
        <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-2 ${subheadingColor.text}`}>
          Font Color
        </label>
        <div className={`flex items-center space-x-3 border rounded-xl px-2.5 py-1.5 mb-2.5 ${
          isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-slate-50 border-slate-200'
        }`}>
          <input 
            type="color" 
            value={config.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-7 h-7 rounded-lg bg-transparent border-none cursor-pointer"
          />
          <input 
            type="text" 
            value={config.color}
            onChange={(e) => onChange('color', e.target.value)}
            placeholder="#000000"
            className={`bg-transparent border-none text-xs focus:outline-none w-full font-mono scale-95 uppercase ${
              isDark ? 'text-slate-200' : 'text-slate-800 font-bold'
            }`}
          />
        </div>

        {/* Categories selector tabs */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {COLOR_GROUPS.map((group) => {
            const isActive = activeGroup === group.name;
            const groupColorsMap: Record<string, string> = {
              'Red': 'border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 active:bg-red-500/15',
              'Pink': 'border-pink-500/20 text-pink-500 bg-pink-500/5 hover:bg-pink-500/10 active:bg-pink-500/15',
              'Orange': 'border-orange-500/20 text-orange-500 bg-orange-500/5 hover:bg-orange-500/10 active:bg-orange-500/15',
              'Green': 'border-green-500/20 text-green-500 bg-green-500/5 hover:bg-green-500/10 active:bg-green-500/15',
              'Blue/Cyan': 'border-cyan-500/20 text-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 active:bg-cyan-500/15',
              'Yellow': 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10 active:bg-yellow-500/15',
              'Purple': 'border-purple-500/20 text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 active:bg-purple-500/15',
              'Gray/Black/White': 'border-slate-500/20 text-slate-500 bg-slate-500/5 hover:bg-slate-500/10 active:bg-slate-500/15 dark:text-slate-400',
            };
            
            const groupActiveMap: Record<string, string> = {
              'Red': 'bg-red-500 text-white border-red-500 shadow-[0_2px_6px_rgba(239,68,68,0.4)]',
              'Pink': 'bg-pink-500 text-white border-pink-500 shadow-[0_2px_6px_rgba(236,72,153,0.4)]',
              'Orange': 'bg-orange-500 text-white border-orange-500 shadow-[0_2px_6px_rgba(249,115,22,0.4)]',
              'Green': 'bg-green-600 text-white border-green-600 shadow-[0_2px_6px_rgba(22,163,74,0.4)]',
              'Blue/Cyan': 'bg-cyan-500 text-white border-cyan-500 shadow-[0_2px_6px_rgba(6,182,212,0.4)]',
              'Yellow': 'bg-amber-400 text-slate-900 border-amber-400 shadow-[0_2px_6px_rgba(245,158,11,0.4)]',
              'Purple': 'bg-purple-500 text-white border-purple-500 shadow-[0_2px_6px_rgba(168,85,247,0.4)]',
              'Gray/Black/White': 'bg-slate-700 text-white border-slate-700 shadow-[0_2px_6px_rgba(100,116,139,0.4)]',
            };

            return (
              <button
                key={group.name}
                type="button"
                onClick={() => setActiveGroup(group.name)}
                className={`px-2 py-1 text-[9px] font-mono font-extrabold uppercase tracking-wide rounded-lg border transition-all cursor-pointer scale-95 hover:scale-100 ${
                  isActive 
                    ? groupActiveMap[group.name]
                    : groupColorsMap[group.name]
                }`}
              >
                {group.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic color presets palette grid */}
        <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-[140px] overflow-y-auto p-1.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-500/[0.01]">
          {COLOR_GROUPS.find(g => g.name === activeGroup)?.colors.map((colorObj) => {
            const isSelected = config.color.toLowerCase() === colorObj.hex.toLowerCase();
            return (
              <button
                key={`${activeGroup}-${colorObj.name}`}
                type="button"
                onClick={() => onChange('color', colorObj.hex)}
                className={`w-6 h-6 rounded-lg border cursor-pointer hover:scale-115 active:scale-95 transition-all flex items-center justify-center relative group`}
                style={{ 
                  backgroundColor: colorObj.hex,
                  borderColor: isSelected ? subheadingColor.rawColor : 'rgba(0,0,0,0.15)',
                  boxShadow: isSelected ? `0 0 8px ${subheadingColor.rawColor}` : undefined
                }}
                title={`${colorObj.name} (${colorObj.hex})`}
              >
                {isSelected && (
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-sm ring-1 ring-black/20" />
                )}
                
                {/* Tooltip on hover */}
                <span className="absolute bottom-full mb-1.5 hidden group-hover:block z-50 bg-slate-900 border border-slate-800 text-white font-mono text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap opacity-95 pointer-events-none scale-90">
                  {colorObj.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Font Style & Alignment Customization Sections */}
      <div className={`flex flex-col sm:flex-row gap-3 pt-2.5 border-t ${
        isDark ? 'border-[#161e33]/50' : 'border-slate-100'
      }`}>
        {showAlignment && (
          <div className="flex-1 flex flex-col justify-start">
            <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 px-1 ${subheadingColor.text}`}>
              Alignment
            </span>
            <div className={`flex rounded-xl p-1 gap-1 border w-fit ${
              isDark ? 'bg-[#070b13] border-[#1a233d]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {(['left', 'center', 'right'] as const).map((align) => {
                const isActive = (config.align || 'center') === align;
                const IconMap = {
                  left: AlignLeft,
                  center: AlignCenter,
                  right: AlignRight
                };
                const Icon = IconMap[align];
                return (
                  <button
                    key={align}
                    type="button"
                    title={`Align ${align}`}
                    onClick={() => onChange('align', align)}
                    style={isActive ? { backgroundColor: subheadingColor.rawColor, color: '#ffffff' } : {}}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                      isActive 
                        ? 'text-white' 
                        : isDark ? 'text-slate-500 hover:text-slate-350' : 'text-slate-450 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-start">
          <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 px-1 ${subheadingColor.text}`}>
            Font Style
          </span>
          <div className="flex items-center justify-start flex-wrap gap-1">
            <button 
              type="button"
              onClick={() => onChange('bold', !config.bold)}
              style={config.bold ? { backgroundColor: subheadingColor.rawColor, color: '#ffffff', boxShadow: `0 2px 6px ${subheadingColor.rawColor}60` } : {}}
              className={`px-3 py-2 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 border ${
                config.bold 
                  ? 'border-transparent font-extrabold text-white text-shadow-sm' 
                  : isDark ? 'bg-[#070b13] border-[#1a233d] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bold
            </button>
            <button 
              type="button"
              onClick={() => onChange('italic', !config.italic)}
              style={config.italic ? { backgroundColor: subheadingColor.rawColor, color: '#ffffff', boxShadow: `0 2px 6px ${subheadingColor.rawColor}60` } : {}}
              className={`px-3 py-2 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 border ${
                config.italic 
                  ? 'border-transparent font-extrabold text-white text-shadow-sm' 
                  : isDark ? 'bg-[#070b13] border-[#1a233d] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Italic
            </button>
            <button 
              type="button"
              onClick={() => onChange('uppercase', !config.uppercase)}
              style={config.uppercase ? { backgroundColor: subheadingColor.rawColor, color: '#ffffff', boxShadow: `0 2px 6px ${subheadingColor.rawColor}60` } : {}}
              className={`px-2.5 py-2 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer hover:scale-105 active:scale-95 border ${
                config.uppercase 
                  ? 'border-transparent font-extrabold text-white text-shadow-sm' 
                  : isDark ? 'bg-[#070b13] border-[#1a233d] text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Caps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
