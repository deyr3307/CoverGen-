import React, { useState, useRef, useEffect } from 'react';
import { 
  CoverPageData, 
  CoverPageDesign, 
  DEFAULT_COVER_DATA, 
  DEFAULT_DESIGN 
} from './types';
import { LandingPage } from './components/LandingPage';
import { AnimatedLogo } from './components/AnimatedLogo';
import { InformationForm } from './components/InformationForm';
import { DesignBuilder } from './components/DesignBuilder';
import { CoverDocument } from './components/CoverDocument';
import { DataInputPage } from './components/DataInputPage';
import { SplashScreen } from './components/SplashScreen';
import { 
  GraduationCap, 
  RotateCcw, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  ChevronRight, 
  Activity, 
  Undo2,
  Sliders,
  Sparkles,
  Info,
  Sun,
  Moon,
  FileText,
  Image,
  FileImage,
  X,
  Printer,
  Check,
  Settings2,
  Share2,
  Copy
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import { ensureSupportedFormat, encodeSharedState, decodeSharedState } from './utils';

const pageVariants = {
  initial: {
    opacity: 0,
    x: 18,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1] // Native snappy mobile feels
    }
  },
  exit: {
    opacity: 0,
    x: -18,
    transition: {
      duration: 0.16,
      ease: [0.7, 0, 0.84, 0]
    }
  }
};

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User responded to installation choice: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Wizard view toggle: 'landing' | 'inputs' | 'builder'
  const [currentStep, setCurrentStep] = useState<'landing' | 'inputs' | 'builder'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('share')) return 'builder';
    }
    return 'landing';
  });
  
  // Custom builder tabs: 'inputs' | 'designer' | 'preview'
  const [builderTab, setBuilderTab] = useState<'inputs' | 'designer' | 'preview'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('share')) return 'preview';
    }
    return 'inputs';
  });

  const [isSharedView, setIsSharedView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('share');
    }
    return false;
  });

  // Keep backups of local storage on mount (before overriding with shared state) to allow easy restore!
  const [backedUpData] = useState<string | null>(() => {
    return localStorage.getItem('cover_page_data');
  });
  const [backedUpDesign] = useState<string | null>(() => {
    return localStorage.getItem('cover_page_design');
  });

  // Helper to retrieve shared state from query parameter
  const getSharedState = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const shareData = params.get('share');
      if (shareData) {
        return decodeSharedState(shareData);
      }
    }
    return null;
  };

  const sharedState = getSharedState();

  // Shared persistent state (cached in localStorage or loaded from share URL)
  const [coverData, setCoverData] = useState<CoverPageData>(() => {
    if (sharedState?.coverData) {
      return sharedState.coverData;
    }
    const saved = localStorage.getItem('cover_page_data');
    return saved ? JSON.parse(saved) : { ...DEFAULT_COVER_DATA };
  });

  const [coverDesign, setCoverDesign] = useState<CoverPageDesign>(() => {
    if (sharedState?.coverDesign) {
      return sharedState.coverDesign;
    }
    const saved = localStorage.getItem('cover_page_design');
    return saved ? JSON.parse(saved) : { ...DEFAULT_DESIGN };
  });

  // State Management for background color
  const [pageBackgroundColor, setPageBackgroundColor] = useState<string>(() => {
    if (sharedState?.pageBackgroundColor) {
      return sharedState.pageBackgroundColor;
    }
    return coverDesign.paperColor || '#ffffff';
  });

  const handleRestoreMyDesign = () => {
    setIsSharedView(false);
    // Remove query parameter from browser bar without reload
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.pathname + url.search);

    if (backedUpData) {
      setCoverData(JSON.parse(backedUpData));
    } else {
      setCoverData({ ...DEFAULT_COVER_DATA });
    }

    if (backedUpDesign) {
      const designObj = JSON.parse(backedUpDesign);
      setCoverDesign(designObj);
      setPageBackgroundColor(designObj.paperColor || '#ffffff');
    } else {
      setCoverDesign({ ...DEFAULT_DESIGN });
      setPageBackgroundColor(DEFAULT_DESIGN.paperColor || '#ffffff');
    }
  };

  // Keep pageBackgroundColor in sync with coverDesign
  useEffect(() => {
    if (coverDesign.paperColor && coverDesign.paperColor !== pageBackgroundColor) {
      setPageBackgroundColor(coverDesign.paperColor);
    }
  }, [coverDesign.paperColor]);

  const updatePageBackgroundColor = (color: string) => {
    setPageBackgroundColor(color);
    setCoverDesign(prev => ({
      ...prev,
      paperColor: color
    }));
  };

  // Presentation State
  const [zoomLevel, setZoomLevel] = useState<number>(60); // standard nice scale on typical desktop screens
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isBackDownloadOpen, setIsBackDownloadOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);

  // Advanced PDF Export Option States
  const [showAdvancedPdfDialog, setShowAdvancedPdfDialog] = useState<boolean>(false);
  const [pdfIncludePageNumbers, setPdfIncludePageNumbers] = useState<boolean>(false);
  const [pdfPrintBackground, setPdfPrintBackground] = useState<boolean>(true);
  const [pdfPaperSize, setPdfPaperSize] = useState<'a4' | 'letter'>('a4');
  const [pdfQuality, setPdfQuality] = useState<'low' | 'medium' | 'high'>('high');

  // Master unified client-side navigation with Browser History Synchronization
  const navigateTo = (step: 'landing' | 'inputs' | 'builder', tab: 'inputs' | 'designer' | 'preview' = 'inputs') => {
    // Avoid redundant history entry pushes
    const activeState = window.history.state;
    if (!activeState || activeState.currentStep !== step || activeState.builderTab !== tab) {
      window.history.pushState({ currentStep: step, builderTab: tab }, '');
    }
    setCurrentStep(step);
    setBuilderTab(tab);
  };

  const navigateStep = (step: 'landing' | 'inputs' | 'builder') => {
    const tab = step === 'builder' ? builderTab : 'inputs';
    navigateTo(step, tab);
  };

  const navigateTab = (tab: 'inputs' | 'designer' | 'preview') => {
    navigateTo('builder', tab);
  };

  // Sync PWA / browser physical back button popstate hooks
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state === 'object' && 'currentStep' in event.state) {
        setCurrentStep(event.state.currentStep);
        setBuilderTab(event.state.builderTab || 'inputs');
      } else {
        // Fallback reference for initial history state
        setCurrentStep('landing');
        setBuilderTab('inputs');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize initial state in history replacement so clicking back from first slide takes them home safely
    if (!window.history.state || typeof window.history.state !== 'object' || !('currentStep' in window.history.state)) {
      window.history.replaceState({ currentStep, builderTab }, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep, builderTab]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cover_page_data', JSON.stringify(coverData));
  }, [coverData]);

  useEffect(() => {
    localStorage.setItem('cover_page_design', JSON.stringify(coverDesign));
  }, [coverDesign]);

  // Automatic Migration: Apply stunning light salmon theme if not yet set
  useEffect(() => {
    const key = 'cover_page_salmon_theme_applied_v3';
    const applied = localStorage.getItem(key);
    if (!applied) {
      setCoverDesign(prev => {
        const updated = {
          ...prev,
          paperColor: '#fff0eb',      // Warm Light Salmon paper bg
          accentColor: '#d95d39',     // Salmon/Cinnabar primary accent
          borderColor: '#ffa07a',     // Light Salmon border limit
          borderStyle: prev.borderStyle === 'none' ? 'double' : prev.borderStyle,
          // Colorize text nodes to harmoniously match the new Light Salmon theme
          fontTitle: { ...prev.fontTitle, color: '#d95d39' },
          fontCourse: { ...prev.fontCourse, color: '#2a0c02' },
          fontSubSection: { ...prev.fontSubSection, color: '#d95d39' },
          fontUniversity: { ...prev.fontUniversity, color: '#c2410c' },
          fontDiscipline: { ...prev.fontDiscipline, color: '#ff7f50' }, // Coral color
          fontAssignmentTopic: { ...prev.fontAssignmentTopic, color: '#d95d39' },
          fontTopicTitle: { ...prev.fontTopicTitle, color: '#2a0c02' },
          fontCourseNoHeading: { ...prev.fontCourseNoHeading, color: '#2a0c02' },
          fontCourseNoContent: { ...prev.fontCourseNoContent, color: '#2a0c02' },
          fontCourseTitleHeading: { ...prev.fontCourseTitleHeading, color: '#2a0c02' },
          fontCourseTitleContent: { ...prev.fontCourseTitleContent, color: '#2a0c02' },
          fontSubmittedToHeading: { ...prev.fontSubmittedToHeading, color: '#c2410c' },
          fontSubmittedToContent: { ...prev.fontSubmittedToContent, color: '#2a0c02' },
          fontSubmittedByHeading: { ...prev.fontSubmittedByHeading, color: '#c2410c' },
          fontSubmittedByContent: { ...prev.fontSubmittedByContent, color: '#2a0c02' },
          fontSubmissionDateHeading: { ...prev.fontSubmissionDateHeading, color: '#2a0c02' },
          fontSubmissionDateContent: { ...prev.fontSubmissionDateContent, color: '#2a0c02' },
        };
        localStorage.setItem('cover_page_design', JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem(key, 'true');
    }
  }, []);

  // Handle resets
  const handleReset = () => {
    if (confirm('Are you sure you want to restore academic default text values and styles?')) {
      setCoverData({ ...DEFAULT_COVER_DATA });
      setCoverDesign({ ...DEFAULT_DESIGN });
      localStorage.removeItem('cover_page_data');
      localStorage.removeItem('cover_page_design');
    }
  };

  // Preset quick appliers
  const applyPresetDataset = (type: 'physics' | 'env' | 'cse') => {
    switch (type) {
      case 'physics':
        setCoverData({
          documentType: 'LAB REPORT ON',
          topicTitle: 'DETERMINATION OF REFRACTIVE INDEX OF LIQUID USING SPECTROMETER',
          courseNo: 'ES-1271',
          courseName: 'Physics in Environmental Science',
          teacherName: 'Dr. Md. Abdullah Yusuf Al Harun',
          teacherDesignation: 'Professor',
          teacherDiscipline: 'Environmental Science Discipline',
          teacherUniversity: 'Khulna University',
          teacherLocation: 'Khulna, Bangladesh',
          teacher2Name: 'Sadia Islam Mou',
          teacher2Designation: 'Assistant Professor',
          teacher2Discipline: 'Environmental Science Discipline',
          teacher2University: 'Khulna University',
          teacher2Location: 'Khulna',
          submittedByLabel: 'Submitted By',
          studentName: 'Anirudha Dey',
          studentId: '251009',
          studentYearTerm: '1st Year, 2nd Term',
          studentDiscipline: 'Environmental Science Discipline',
          studentUniversity: 'Khulna University',
          studentLocation: 'Khulna',
          submissionDate: '2026-05-10',
          universityName: 'Khulna University',
          departmentName: 'Environmental Science Discipline',
        });
        setCoverDesign(prev => ({
          ...prev,
          logoUrl: prev.logoUrl || '',
          borderStyle: 'double',
          accentColor: '#0284c7',
          borderColor: '#0284c7',
        }));
        break;
      case 'env':
        setCoverData({
          documentType: 'AN ASSIGNMENT ON',
          topicTitle: 'IMPACT OF CLIMATE CHANGE ON SALINITY INTRUSION IN SUNDARBANS MANGROVE FOREST',
          courseNo: 'ES-3204',
          courseName: 'Biodiversity Policy and Conservation Science',
          teacherName: 'Dr. S. M. Tariqul Islam',
          teacherDesignation: 'Professor',
          teacherDiscipline: 'Environmental Science Discipline',
          teacherUniversity: 'Khulna University',
          teacherLocation: 'Khulna-9208',
          submittedByLabel: 'Submitted By',
          studentName: 'Anirudha Dey',
          studentId: '251009',
          studentYearTerm: '1st Year, 2nd Term',
          studentDiscipline: 'Environmental Science Discipline',
          studentUniversity: 'Khulna University',
          studentLocation: 'Khulna',
          submissionDate: '2026-05-25',
          universityName: 'Khulna University',
          departmentName: 'Environmental Science Discipline',
        });
        setCoverDesign(prev => ({
          ...prev,
          logoUrl: prev.logoUrl || '',
          borderStyle: 'double',
          accentColor: '#0284c7',
          borderColor: '#0284c7',
        }));
        break;
      case 'cse':
        setCoverData({
          documentType: 'TERM PAPER ON',
          topicTitle: 'AUTOMATED SOIL MOISTURE PREDICTION USING SUPERVISED NEURAL NETWORKS',
          courseNo: 'CSE-4209',
          courseName: 'Artificial Intelligence and Pattern Recognition',
          teacherName: 'Dr. Shamima Akhter',
          teacherDesignation: 'Senior Lecturer',
          teacherDiscipline: 'Computer Science and Engineering',
          teacherUniversity: 'Khulna Science University',
          teacherLocation: 'Khulna',
          submittedByLabel: 'Submitted By',
          studentName: 'Anirudha Dey',
          studentId: '251009',
          studentYearTerm: '2nd Year, 1st Term',
          studentDiscipline: 'Environmental Science Discipline',
          studentUniversity: 'Khulna University',
          studentLocation: 'Khulna',
          submissionDate: '2026-06-15',
          universityName: 'Khulna Science University',
          departmentName: 'Computer Science and Engineering',
        });
        setCoverDesign(prev => ({
          ...prev,
          logoUrl: prev.logoUrl || '',
          borderStyle: 'classic',
          accentColor: '#b45309',
          borderColor: '#475569',
        }));
        break;
    }
  };

  // Upload handles
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'watermark') => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    try {
      const file = await ensureSupportedFormat(rawFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'logo') {
          setCoverDesign(prev => ({ ...prev, logoUrl: result }));
        } else {
          setCoverDesign(prev => ({ ...prev, watermarkUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to process uploaded file with format validation:", err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'logo') {
          setCoverDesign(prev => ({ ...prev, logoUrl: result }));
        } else {
          setCoverDesign(prev => ({ ...prev, watermarkUrl: result }));
        }
      };
      reader.readAsDataURL(rawFile);
    }
  };

  // High Fidelity rendering formats routine (PDF, PNG, JPG) with Quality Levels
  const oklchToRgb = (l: number, c: number, h: number): string => {
    const lRadian = (h * Math.PI) / 180;
    const a = c * Math.cos(lRadian);
    const b = c * Math.sin(lRadian);
    
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
    
    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;
    
    const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
    
    const f = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    const clamp = (x: number) => Math.max(0, Math.min(255, Math.round(x * 255)));
    
    return `rgb(${clamp(f(r))}, ${clamp(f(g))}, ${clamp(f(b_))})`;
  };

  const oklabToRgb = (l: number, a: number, b: number): string => {
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
    
    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;
    
    const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
    
    const f = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    const clamp = (x: number) => Math.max(0, Math.min(255, Math.round(x * 255)));
    
    return `rgb(${clamp(f(r))}, ${clamp(f(g))}, ${clamp(f(b_))})`;
  };

  const convertColorString = (val: any): any => {
    if (typeof val !== 'string') return val;
    if (!val.includes('oklch') && !val.includes('oklab')) return val;

    return val.replace(/(oklch|oklab)\(([^)]+)\)/gi, (match, type, content) => {
      const parts = content.trim().split(/[\s,]+/);
      const nums = parts.filter((p: string) => p && p !== '/').map((p: string) => parseFloat(p));
      
      if (nums.length >= 3 && nums.every((n: number) => !isNaN(n))) {
        let rgbStr = '';
        if (type.toLowerCase() === 'oklch') {
          rgbStr = oklchToRgb(nums[0], nums[1], nums[2]);
        } else {
          rgbStr = oklabToRgb(nums[0], nums[1], nums[2]);
        }
        
        const hasAlpha = content.includes('/') || nums.length >= 4;
        const alphaVal = nums[3] !== undefined ? nums[3] : 1;
        if (hasAlpha) {
          return rgbStr.replace('rgb', 'rgba').replace(')', `, ${alphaVal})`);
        }
        return rgbStr;
      }
      return 'rgb(120, 120, 120)';
    });
  };

  const executeExport = async (
    format: 'pdf' | 'png' | 'jpg', 
    quality: 'low' | 'medium' | 'high' = 'high',
    options?: {
      includePageNumbers?: boolean;
      printBackgroundGraphics?: boolean;
      paperSize?: 'a4' | 'letter';
      onlyBackPage?: boolean;
    }
  ) => {
    const element = document.getElementById('academic-cover-page');
    const backElement = document.getElementById('academic-back-page');
    if (!element) {
      alert("Error: Canvas structure is missing.");
      return;
    }
    if (options?.onlyBackPage && !backElement) {
      alert("Error: Back Page is not enabled or missing.");
      return;
    }

    const includePageNumbers = options?.includePageNumbers ?? false;
    const printBackgroundGraphics = options?.printBackgroundGraphics ?? true;
    const paperSize = options?.paperSize ?? 'a4';

    let targetWidth = 794;
    let targetHeight = 1123;
    if (paperSize === 'letter') {
      targetWidth = 794;
      targetHeight = 1027; // Letter size aspect ratio is 8.5 x 11 (approx 1:1.29)
    }

    setIsExporting(`Generating ${quality.toUpperCase()} Quality ${format.toUpperCase()}...`);
    
    // Ensure all web fonts are fully loaded before rendering the canvas to achieve 100% visual fidelity
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (fontErr) {
        console.warn("Error waiting for document fonts to load:", fontErr);
      }
    }

    // Smooth timing delay for clean renders
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const targetElement = options?.onlyBackPage ? backElement : element;
    if (!targetElement) {
      alert("Error: Target element is missing.");
      setIsExporting(null);
      return;
    }

    // Stabilize DOM transforms on parent to prevent html2canvas clipping/misalignment
    const parent = targetElement.parentElement;
    const grandParent = parent ? parent.parentElement : null;
    
    const originalTransform = parent ? parent.style.transform : '';
    const originalPosition = parent ? parent.style.position : '';
    const originalTop = parent ? parent.style.top : '';
    const originalLeft = parent ? parent.style.left : '';
    
    const originalGPWidth = grandParent ? grandParent.style.width : '';
    const originalGPHeight = grandParent ? grandParent.style.height : '';

    if (parent) {
      parent.style.transform = 'none';
      parent.style.position = 'relative';
      parent.style.top = '0';
      parent.style.left = '0';
    }
    if (grandParent) {
      grandParent.style.width = `${targetWidth}px`;
      grandParent.style.height = `${targetHeight}px`;
    }

    // Modern Tailwind v4 oklch & oklab parser bug hotpatch with robust parenthesis matching
    const stripUnsupportedColors = (cssText: string): string => {
      if (!cssText) return '';
      return convertColorString(cssText);
    };

    const patchStylesheets = async () => {
      const detachedElements: { element: HTMLElement; parent: Node; nextSibling: Node | null }[] = [];
      const allStyles = Array.from(document.querySelectorAll('style'));
      const allLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
      
      let unifiedCssText = '';

      const detach = (el: HTMLElement) => {
        const parent = el.parentNode;
        if (parent) {
          detachedElements.push({
            element: el,
            parent: parent,
            nextSibling: el.nextSibling
          });
          parent.removeChild(el);
        }
      };

      // Process style elements
      for (const style of allStyles) {
        if (style.hasAttribute('data-temp-patched')) continue;
        let rawCss = style.innerHTML || '';
        if (!rawCss) {
          try {
            rawCss = Array.from(style.sheet?.cssRules || [])
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            console.warn("Could not read stylesheet rules:", e);
          }
        }
        unifiedCssText += '\n' + rawCss;
        detach(style);
      }

      // Process link elements
      for (const link of allLinks) {
        try {
          if (!link.href) continue;
          if (link.href.includes('fonts.googleapis.com') || link.href.includes('font-awesome')) {
            continue;
          }
          // Verify if it is a potentially blockable cross-origin stylesheet
          let isCrossOrigin = false;
          if (link.href.startsWith('http://') || link.href.startsWith('https://') || link.href.startsWith('//')) {
            try {
              const url = new URL(link.href, window.location.origin);
              if (url.origin !== window.location.origin) {
                isCrossOrigin = true;
              }
            } catch (e) {
              isCrossOrigin = true;
            }
          }
          if (isCrossOrigin) {
            console.warn("Skipping cross-origin stylesheet unified patching to avoid CORS block:", link.href);
            detach(link);
            continue;
          }

          const res = await fetch(link.href);
          if (res.ok) {
            const cssText = await res.text();
            unifiedCssText += '\n' + cssText;
            detach(link);
          } else {
            detach(link);
          }
        } catch (e) {
          console.warn("Failed to fetch link stylesheet for unified patch:", link.href, e);
          detach(link);
        }
      }

      // Any remaining active styles or links, detach them to be completely safe during html2canvas
      const remainingStyles = Array.from(document.querySelectorAll('style'));
      for (const style of remainingStyles) {
        if (!style.hasAttribute('data-temp-patched')) {
          detach(style);
        }
      }

      const remainingLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
      for (const link of remainingLinks) {
        if (!link.href.includes('fonts.googleapis.com')) {
          detach(link);
        }
      }

      // Create single unified patched style tag
      const patchedStyle = document.createElement('style');
      patchedStyle.setAttribute('data-temp-patched', 'true');
      patchedStyle.innerHTML = stripUnsupportedColors(unifiedCssText);
      document.head.appendChild(patchedStyle);

      return {
        restore: () => {
          // Remove temporary style
          patchedStyle.remove();
          
          // Restore original elements in reverse order to ensure correct sibling positioning
          for (let i = detachedElements.length - 1; i >= 0; i--) {
            const { element, parent, nextSibling } = detachedElements[i];
            parent.insertBefore(element, nextSibling);
          }
        }
      };
    };

    let stylePatcher: { restore: () => void } | null = null;
    let noBgStyle: HTMLStyleElement | null = null;
    let originalPageBg = '';
    const elementsWithStyle = Array.from(document.querySelectorAll('[style]'));
    if (document.documentElement.getAttribute('style')) elementsWithStyle.push(document.documentElement);
    if (document.body.getAttribute('style')) elementsWithStyle.push(document.body);
    const originalInlineStyles = new Map<HTMLElement, string>();

    // Patch global getComputedStyle during html2canvas execution to parse oklch and oklab colors natively
    const originalGetComputedStyle = window.getComputedStyle;
    try {
      window.getComputedStyle = function (el: Element, pseudoElt?: string) {
        const style = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(style, {
          get(target, prop) {
            if (prop === 'getPropertyValue') {
              return function (propertyName: string) {
                const raw = target.getPropertyValue(propertyName);
                return convertColorString(raw);
              };
            }
            const val = target[prop as any];
            if (typeof val === 'function') {
              return (val as any).bind(target);
            }
            return convertColorString(val);
          }
        }) as any;
      };
    } catch (e) {
      try {
        Object.defineProperty(window, 'getComputedStyle', {
          value: function (el: Element, pseudoElt?: string) {
            const style = originalGetComputedStyle(el, pseudoElt);
            return new Proxy(style, {
              get(target, prop) {
                if (prop === 'getPropertyValue') {
                  return function (propertyName: string) {
                    const raw = target.getPropertyValue(propertyName);
                    return convertColorString(raw);
                  };
                }
                const val = target[prop as any];
                if (typeof val === 'function') {
                  return (val as any).bind(target);
                }
                return convertColorString(val);
              }
            }) as any;
          },
          configurable: true,
          writable: true
        });
      } catch (errDeep) {
        console.warn("Could not patch window.getComputedStyle via property define:", errDeep);
      }
    }

    try {
      // Patch inline style attributes
      elementsWithStyle.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const inlineStyle = htmlEl.getAttribute('style');
        if (inlineStyle && (
          inlineStyle.toLowerCase().includes('oklch') || 
          inlineStyle.toLowerCase().includes('oklab')
        )) {
          originalInlineStyles.set(htmlEl, inlineStyle);
          htmlEl.setAttribute('style', stripUnsupportedColors(inlineStyle));
        }
      });

      // Insert Style Override for suppressing Background Graphics
      if (!printBackgroundGraphics) {
        noBgStyle = document.createElement('style');
        noBgStyle.innerHTML = `
          /* Suppress watermarks */
          [class*="watermark"], .watermark-animate, [alt="Watermark"], .watermark-container, svg[class*="w-[450px]"] {
            opacity: 0 !important;
            visibility: hidden !important;
            display: none !important;
          }
          /* Remove background patterns, grids, lines or frame gradients */
          #academic-cover-page, #academic-back-page {
            background-image: none !important;
            background-color: #ffffff !important;
            background: #ffffff !important;
          }
        `;
        document.head.appendChild(noBgStyle);
        if (options?.onlyBackPage) {
          if (backElement) {
            originalPageBg = backElement.style.background;
            backElement.style.background = '#ffffff';
            backElement.style.backgroundColor = '#ffffff';
            backElement.style.backgroundImage = 'none';
          }
        } else {
          if (element) {
            originalPageBg = element.style.background;
            element.style.background = '#ffffff';
            element.style.backgroundColor = '#ffffff';
            element.style.backgroundImage = 'none';
          }
        }
      }

      // Apply stylesheet patch to bypass oklch/oklab parsing failure
      stylePatcher = await patchStylesheets();

      // Configure scale according to quality tier (Low: 1.2x, Med: 2.2x, High: 3.5x)
      let scaleValue = 3.5;
      if (quality === 'low') {
        scaleValue = 1.2;
      } else if (quality === 'medium') {
        scaleValue = 2.2;
      }

      let canvas = null;
      if (!options?.onlyBackPage) {
        canvas = await html2canvas(element, {
          scale: scaleValue,
          width: targetWidth,
          height: targetHeight,
          useCORS: true,
          allowTaint: true,
          logging: true,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: printBackgroundGraphics ? (pageBackgroundColor || coverDesign.paperColor || '#ffffff') : '#ffffff',
          onclone: (clonedDoc) => {
            const clonedEl = clonedDoc.getElementById('academic-cover-page');
            if (clonedEl) {
              clonedEl.style.width = `${targetWidth}px`;
              clonedEl.style.height = `${targetHeight}px`;
              clonedEl.style.transform = 'none';
              clonedEl.style.scale = '1';
              
              const p = clonedEl.parentElement;
              if (p) {
                p.style.width = `${targetWidth}px`;
                p.style.height = `${targetHeight}px`;
                p.style.transform = 'none';
                p.style.scale = '1';
                p.style.transformOrigin = 'top left';
                p.style.position = 'absolute';
                p.style.top = '0';
                p.style.left = '0';
                p.style.zoom = '1';
                
                const gp = p.parentElement;
                if (gp) {
                  gp.style.width = `${targetWidth}px`;
                  gp.style.height = `${targetHeight}px`;
                  gp.style.transform = 'none';
                  gp.style.scale = '1';
                }
              }
            }
          }
        });
      }

      let backCanvas = null;
      if (options?.onlyBackPage) {
        if (backElement) {
          try {
            backCanvas = await html2canvas(backElement, {
              scale: scaleValue,
              width: targetWidth,
              height: targetHeight,
              useCORS: true,
              allowTaint: true,
              logging: true,
              scrollX: 0,
              scrollY: 0,
              backgroundColor: printBackgroundGraphics ? (pageBackgroundColor || coverDesign.paperColor || '#ffffff') : '#ffffff',
              onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById('academic-back-page');
                if (clonedEl) {
                  clonedEl.style.width = `${targetWidth}px`;
                  clonedEl.style.height = `${targetHeight}px`;
                  clonedEl.style.transform = 'none';
                  clonedEl.style.scale = '1';
                  
                  const p = clonedEl.parentElement;
                  if (p) {
                    p.style.width = `${targetWidth}px`;
                    p.style.height = `${targetHeight}px`;
                    p.style.transform = 'none';
                    p.style.scale = '1';
                    p.style.transformOrigin = 'top left';
                    p.style.position = 'absolute';
                    p.style.top = '0';
                    p.style.left = '0';
                    p.style.zoom = '1';
                    
                    const gp = p.parentElement;
                    if (gp) {
                      gp.style.width = `${targetWidth}px`;
                      gp.style.height = `${targetHeight}px`;
                      gp.style.transform = 'none';
                      gp.style.scale = '1';
                    }
                  }
                }
              }
            });
          } catch (backErr) {
            console.warn("Back cover canvas failed with CORS. Retrying with safe fallback...", backErr);
            backCanvas = await html2canvas(backElement, {
              scale: scaleValue,
              width: targetWidth,
              height: targetHeight,
              useCORS: false,
              allowTaint: false,
              logging: false,
              scrollX: 0,
              scrollY: 0,
              backgroundColor: printBackgroundGraphics ? (pageBackgroundColor || coverDesign.paperColor || '#ffffff') : '#ffffff',
              onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById('academic-back-page');
                if (clonedEl) {
                  clonedEl.style.width = `${targetWidth}px`;
                  clonedEl.style.height = `${targetHeight}px`;
                  clonedEl.style.transform = 'none';
                  clonedEl.style.scale = '1';
                  
                  const p = clonedEl.parentElement;
                  if (p) {
                    p.style.width = `${targetWidth}px`;
                    p.style.height = `${targetHeight}px`;
                    p.style.transform = 'none';
                    p.style.scale = '1';
                    p.style.transformOrigin = 'top left';
                    p.style.position = 'absolute';
                    p.style.top = '0';
                    p.style.left = '0';
                    p.style.zoom = '1';
                    
                    const gp = p.parentElement;
                    if (gp) {
                      gp.style.width = `${targetWidth}px`;
                      gp.style.height = `${targetHeight}px`;
                      gp.style.transform = 'none';
                      gp.style.scale = '1';
                    }
                  }
                }
              }
            });
          }
        }
      }

      const cleanFileName = `${coverData?.courseNo || 'cover'}_${(coverData?.documentType || '').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
        .substring(0, 45);

      let imgData;
      let backImgData;
      const jpegQual = quality === 'low' ? 0.6 : quality === 'medium' ? 0.85 : 0.98;

      try {
        if (format === 'pdf') {
          if (canvas) imgData = canvas.toDataURL('image/jpeg', jpegQual);
          if (backCanvas) {
            backImgData = backCanvas.toDataURL('image/jpeg', jpegQual);
          }
        } else if (format === 'png') {
          if (canvas) imgData = canvas.toDataURL('image/png');
          if (backCanvas) {
            backImgData = backCanvas.toDataURL('image/png');
          }
        } else {
          if (canvas) imgData = canvas.toDataURL('image/jpeg', jpegQual);
          if (backCanvas) {
            backImgData = backCanvas.toDataURL('image/jpeg', jpegQual);
          }
        }
      } catch (taintErr) {
        console.warn("Canvas may be tainted by cross-origin images. Re-rendering html2canvas safely...", taintErr);
        // Fallback: Re-render without CORS
        let fallbackCanvas = null;
        if (!options?.onlyBackPage) {
          fallbackCanvas = await html2canvas(element, {
            scale: scaleValue,
            width: targetWidth,
            height: targetHeight,
            useCORS: false,
            allowTaint: false,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            backgroundColor: printBackgroundGraphics ? (pageBackgroundColor || coverDesign.paperColor || '#ffffff') : '#ffffff',
            onclone: (clonedDoc) => {
              const clonedEl = clonedDoc.getElementById('academic-cover-page');
              if (clonedEl) {
                clonedEl.style.width = `${targetWidth}px`;
                clonedEl.style.height = `${targetHeight}px`;
                clonedEl.style.transform = 'none';
                clonedEl.style.scale = '1';
                
                const p = clonedEl.parentElement;
                if (p) {
                  p.style.width = `${targetWidth}px`;
                  p.style.height = `${targetHeight}px`;
                  p.style.transform = 'none';
                  p.style.scale = '1';
                  p.style.transformOrigin = 'top left';
                  p.style.position = 'absolute';
                  p.style.top = '0';
                  p.style.left = '0';
                  p.style.zoom = '1';
                  
                  const gp = p.parentElement;
                  if (gp) {
                    gp.style.width = `${targetWidth}px`;
                    gp.style.height = `${targetHeight}px`;
                    gp.style.transform = 'none';
                    gp.style.scale = '1';
                  }
                }
              }
            }
          });
        }
        
        let fallbackBackCanvas = null;
        if (options?.onlyBackPage) {
          if (backElement) {
            fallbackBackCanvas = await html2canvas(backElement, {
              scale: scaleValue,
              width: targetWidth,
              height: targetHeight,
              useCORS: false,
              allowTaint: false,
              logging: false,
              scrollX: 0,
              scrollY: 0,
              backgroundColor: printBackgroundGraphics ? (pageBackgroundColor || coverDesign.paperColor || '#ffffff') : '#ffffff',
              onclone: (clonedDoc) => {
                const clonedEl = clonedDoc.getElementById('academic-back-page');
                if (clonedEl) {
                  clonedEl.style.width = `${targetWidth}px`;
                  clonedEl.style.height = `${targetHeight}px`;
                  clonedEl.style.transform = 'none';
                  clonedEl.style.scale = '1';
                  
                  const p = clonedEl.parentElement;
                  if (p) {
                    p.style.width = `${targetWidth}px`;
                    p.style.height = `${targetHeight}px`;
                    p.style.transform = 'none';
                    p.style.scale = '1';
                    p.style.transformOrigin = 'top left';
                    p.style.position = 'absolute';
                    p.style.top = '0';
                    p.style.left = '0';
                    p.style.zoom = '1';
                    
                    const gp = p.parentElement;
                    if (gp) {
                      gp.style.width = `${targetWidth}px`;
                      gp.style.height = `${targetHeight}px`;
                      gp.style.transform = 'none';
                      gp.style.scale = '1';
                    }
                  }
                }
              }
            });
          }
        }

        if (format === 'pdf') {
          if (fallbackCanvas) imgData = fallbackCanvas.toDataURL('image/jpeg', 0.82);
          if (fallbackBackCanvas) {
            backImgData = fallbackBackCanvas.toDataURL('image/jpeg', 0.82);
          }
        } else if (format === 'png') {
          if (fallbackCanvas) imgData = fallbackCanvas.toDataURL('image/png');
          if (fallbackBackCanvas) {
            backImgData = fallbackBackCanvas.toDataURL('image/png');
          }
        } else {
          if (fallbackCanvas) imgData = fallbackCanvas.toDataURL('image/jpeg', 0.82);
          if (fallbackBackCanvas) {
            backImgData = fallbackBackCanvas.toDataURL('image/jpeg', 0.82);
          }
        }
      }

      if (format === 'pdf') {
        const isLetter = paperSize === 'letter';
        const docWidth = isLetter ? 215.9 : 210; // US Letter vs A4
        const docHeight = isLetter ? 279.4 : 297;  // US Letter vs A4
        const pdfFormat = isLetter ? 'letter' : 'a4';
        
        const jsPDFCtor = (jspdf as any).jsPDF || (jspdf as any).default || jspdf;
        const doc = new jsPDFCtor({
          orientation: 'portrait',
          unit: 'mm',
          format: pdfFormat,
          compress: true
        });

        // Set PDF metadata properties
        doc.setProperties({
          title: (options?.onlyBackPage ? 'Back Cover ' : '') + (coverData.topicTitle || 'Academic Cover Page'),
          subject: coverData.courseName ? `${coverData.courseName} (${coverData.courseNo || ''})` : coverData.documentType || 'Cover Page',
          author: coverData.studentName || 'Student',
          creator: coverData.studentUniversity || 'Academic Cover Page Designer',
          keywords: `academic, coverpage, ${coverData.documentType.toLowerCase()}, ${coverData.courseNo?.toLowerCase()}`
        });

        if (options?.onlyBackPage) {
          if (backImgData) {
            doc.addImage(backImgData, 'JPEG', 0, 0, docWidth, docHeight, undefined, 'FAST');
            if (includePageNumbers) {
              doc.setFontSize(9);
              doc.setTextColor(148, 163, 184); // slate-400
              doc.text("Page 1", docWidth / 2, docHeight - 12, { align: 'center' });
            }
          }
          doc.save(`${cleanFileName}_back_cover.pdf`);
        } else {
          if (imgData) {
            doc.addImage(imgData, 'JPEG', 0, 0, docWidth, docHeight, undefined, 'FAST');
          }

          // Draw elegant page numbering if requested
          if (includePageNumbers) {
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text("Page 1", docWidth / 2, docHeight - 12, { align: 'center' });
          }

          doc.save(`${cleanFileName}_cover.pdf`);
        }
      } else if (format === 'png') {
        if (options?.onlyBackPage) {
          if (backImgData) {
            const trigger = document.createElement('a');
            trigger.href = backImgData;
            trigger.download = `${cleanFileName}_${quality}_back_cover.png`;
            trigger.click();
          }
        } else {
          const trigger = document.createElement('a');
          if (imgData) trigger.href = imgData;
          trigger.download = `${cleanFileName}_${quality}_front_cover.png`;
          trigger.click();
        }
      } else if (format === 'jpg') {
        if (options?.onlyBackPage) {
          if (backImgData) {
            const trigger = document.createElement('a');
            trigger.href = backImgData;
            trigger.download = `${cleanFileName}_${quality}_back_cover.jpg`;
            trigger.click();
          }
        } else {
          const trigger = document.createElement('a');
          if (imgData) trigger.href = imgData;
          trigger.download = `${cleanFileName}_${quality}_front_cover.jpg`;
          trigger.click();
        }
      }
    } catch (err: any) {
      console.error("Compilation / rendering layout failed: ", err);
      alert(`An unexpected layout complication occurred during printing compilation:\n${err?.message || err}`);
    } finally {
      // Restore getComputedStyle
      try {
        window.getComputedStyle = originalGetComputedStyle;
      } catch (errRestore) {
        try {
          Object.defineProperty(window, 'getComputedStyle', {
            value: originalGetComputedStyle,
            configurable: true,
            writable: true
          });
        } catch (eR) {
          console.warn("Could not restore window.getComputedStyle:", eR);
        }
      }

      // Restore page background style
      if (!printBackgroundGraphics) {
        if (options?.onlyBackPage) {
          if (backElement) {
            backElement.style.background = originalPageBg;
          }
        } else {
          if (element) {
            element.style.background = originalPageBg;
          }
        }
      }

      // Cleanup background suppression style
      if (noBgStyle) {
        noBgStyle.remove();
      }

      // Instantly restore style systems and stylesheets
      if (stylePatcher) {
        stylePatcher.restore();
      }

      // Restore inline styles
      originalInlineStyles.forEach((styleStr, el) => {
        el.setAttribute('style', styleStr);
      });

      // Restore positions immediately to preserve live interactive app preview seamlessly
      if (parent) {
        parent.style.transform = originalTransform;
        parent.style.position = originalPosition;
        parent.style.top = originalTop;
        parent.style.left = originalLeft;
      }
      if (grandParent) {
        grandParent.style.width = originalGPWidth;
        grandParent.style.height = originalGPHeight;
      }
      setIsExporting(null);
    }
  };

  // Explicit, fail-proof Button Handlers as strictly requested by user
  const handleDownloadPDF = async (
    quality: 'low' | 'medium' | 'high' = 'high',
    options?: {
      includePageNumbers?: boolean;
      printBackgroundGraphics?: boolean;
      paperSize?: 'a4' | 'letter';
      onlyBackPage?: boolean;
    }
  ) => {
    await executeExport('pdf', quality, options);
  };

  const handleDownloadJPG = async (quality: 'low' | 'medium' | 'high' = 'high', options?: { onlyBackPage?: boolean }) => {
    await executeExport('jpg', quality, options);
  };

  const handleDownloadPNG = async (quality: 'low' | 'medium' | 'high' = 'high', options?: { onlyBackPage?: boolean }) => {
    await executeExport('png', quality, options);
  };


  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen flex flex-col font-sans selection:bg-indigo-600 selection:text-white antialiased transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#06070a] text-slate-100' : 'bg-[#fafafc] text-slate-800'
      }`}>
      
      <AnimatePresence mode="wait">
        {currentStep === 'landing' ? (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex-1 flex flex-col"
          >
            <LandingPage 
              onGetStarted={() => {
                navigateStep('inputs');
              }}
              onExploreFeatures={() => {
                const el = document.getElementById('explore-features'); 
                el?.scrollIntoView({ behavior: 'smooth' }); 
              }}
              theme={theme}
              setTheme={setTheme}
              isInstallable={isInstallable}
              onInstallApp={handleInstallApp}
            />
          </motion.div>
        ) : currentStep === 'inputs' ? (
          
          <motion.div
            key="inputs"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="studio-workspace-container flex flex-col h-screen overflow-hidden w-full"
          >
            {isSharedView && (
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white text-xs py-2.5 px-4 flex items-center justify-between shadow-md relative z-30 select-none shrink-0 border-b border-indigo-500/20">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="font-semibold tracking-wide">
                    ✨ Shared Academic Cover Page Loaded! You can customize or export this design.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleRestoreMyDesign}
                    className="bg-white/15 hover:bg-white/25 active:bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                  >
                    Restore My Previous Design
                  </button>
                  <button 
                    onClick={() => {
                      setIsSharedView(false);
                      const url = new URL(window.location.href);
                      url.searchParams.delete('share');
                      window.history.replaceState({}, '', url.pathname + url.search);
                    }}
                    className="text-white/70 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    title="Dismiss Notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
            
            {/* header navigation bar */}
            <header className={`relative z-20 border-b px-5 py-3.5 flex items-center justify-between shadow-xl shrink-0 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#080a10] border-slate-900/80 text-white' : 'bg-white border-slate-200/80 text-slate-800'
            }`}>
              <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => navigateStep('landing')}>
                <AnimatedLogo size="studio" theme={theme} />
                <div className={`hidden sm:block pl-1.5 py-0.5 border-l ${theme === 'dark' ? 'border-[#161e33]' : 'border-slate-200'}`}>
                  <span className="text-[9px] block font-mono text-slate-500 uppercase tracking-widest leading-none">Studio Workshop</span>
                </div>
              </div>

              {/* Stepper overview details dashboard */}
              <div className={`hidden md:flex items-center gap-2 border px-3.5 py-1.5 rounded-xl text-xs transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#030408] border-slate-900' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="font-extrabold text-indigo-500 dark:text-indigo-400">Step 1: Credentials</span>
                <ChevronRight className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-400'}`} />
                <button 
                  onClick={() => navigateStep('builder')}
                  className={`font-medium transition-colors ${theme === 'dark' ? 'text-slate-505 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  Step 2: Customizer
                </button>
              </div>

              <div className="flex items-center space-x-2.5">
                {isInstallable && (
                  <button
                    onClick={handleInstallApp}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 cursor-pointer transition-all shadow-md animate-pulse"
                    title="Install CoverGen App"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Install App</span>
                  </button>
                )}
                {/* STATEFUL THEME TOGGLER (SUN / MOON) */}
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800' 
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm'
                  }`}
                  title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-500 hover:text-amber-400 transition-colors" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-505" />
                  )}
                </button>

                <button 
                  onClick={() => navigateStep('landing')}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-800/80 text-slate-400 hover:text-white' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm'
                  }`}
                >
                  Back
                </button>
                <button 
                  onClick={() => {
                    navigateTo('builder', 'designer');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold tracking-wider transition-all shadow-md hover:shadow-blue-500/20 active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto w-full">
              <DataInputPage 
                coverData={coverData}
                setCoverData={setCoverData}
                coverDesign={coverDesign}
                setCoverDesign={setCoverDesign}
                applyPresetDataset={applyPresetDataset}
                onNext={() => {
                  navigateTo('builder', 'designer');
                }}
                theme={theme}
              />
            </div>

          </motion.div>
        ) : (
          
          // BUILDER APP WORKSPACE
          <motion.div
            key="builder"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="studio-workspace-container flex flex-col h-screen overflow-hidden w-full"
          >
            {isSharedView && (
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white text-xs py-2.5 px-4 flex items-center justify-between shadow-md relative z-30 select-none shrink-0 border-b border-indigo-500/20">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="font-semibold tracking-wide">
                    ✨ Shared Academic Cover Page Loaded! You can customize or export this design.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleRestoreMyDesign}
                    className="bg-white/15 hover:bg-white/25 active:bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                  >
                    Restore My Previous Design
                  </button>
                  <button 
                    onClick={() => {
                      setIsSharedView(false);
                      const url = new URL(window.location.href);
                      url.searchParams.delete('share');
                      window.history.replaceState({}, '', url.pathname + url.search);
                    }}
                    className="text-white/70 hover:text-white p-1 rounded transition-colors cursor-pointer"
                    title="Dismiss Notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          
          {/* header navigation bar */}
          <header className={`relative z-20 border-b px-5 py-3.5 flex items-center justify-between shadow-xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#080a10] border-slate-900/80 text-white' : 'bg-white border-slate-200/80 text-slate-800'
          }`}>
            <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => navigateStep('landing')}>
              <AnimatedLogo size="studio" theme={theme} />
              <div className={`hidden sm:block pl-1.5 py-0.5 border-l ${theme === 'dark' ? 'border-[#161e33]' : 'border-slate-200'}`}>
                <span className="text-[9px] block font-mono text-slate-500 uppercase tracking-widest leading-none">Studio Workshop</span>
              </div>
            </div>

            {/* Middle builder workspace switches */}
            <div className={`flex items-center space-x-1.5 px-1 py-1 rounded-xl transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#030408] border border-[#161e33]' : 'bg-slate-100 border border-slate-200/80'
            }`}>
              <button 
                onClick={() => navigateTab('inputs')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  builderTab === 'inputs' 
                    ? theme === 'dark'
                      ? 'bg-[#121932] text-indigo-400 border border-[#2b3975] font-extrabold shadow' 
                      : 'bg-white text-indigo-600 border border-slate-200 font-extrabold shadow-sm'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white border border-transparent'
                      : 'text-slate-500 hover:text-slate-800 border border-transparent'
                }`}
              >
                1. Text Inputs
              </button>
              <button 
                onClick={() => navigateTab('designer')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  builderTab === 'designer' 
                    ? theme === 'dark'
                      ? 'bg-[#121932] text-indigo-400 border border-[#2b3975] font-semibold shadow' 
                      : 'bg-white text-indigo-600 border border-slate-200 font-semibold shadow-sm'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white border border-transparent'
                      : 'text-slate-500 hover:text-slate-800 border border-transparent'
                }`}
              >
                2. Theme Designer
              </button>
              <button 
                onClick={() => navigateTab('preview')}
                className={`md:hidden px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  builderTab === 'preview' 
                    ? theme === 'dark'
                      ? 'bg-[#121932] text-indigo-400 border border-[#2b3975] font-semibold shadow' 
                      : 'bg-white text-indigo-600 border border-slate-200 font-semibold shadow-sm'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white border border-transparent'
                      : 'text-slate-500 hover:text-slate-800 border border-transparent'
                }`}
              >
                3. Preview & Export
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2.5">
              {isInstallable && (
                <button
                  onClick={handleInstallApp}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 cursor-pointer transition-all shadow-md animate-pulse"
                  title="Install CoverGen App"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Install App</span>
                </button>
              )}
              {/* STATEFUL THEME TOGGLER (SUN / MOON) */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-slate-900 hover:bg-slate-800 border border-slate-800' 
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500 hover:text-amber-400 transition-colors" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-505" />
                )}
              </button>

              <button 
                onClick={handleReset}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm'
                }`}
                title="Reset Styles"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
              
              <button 
                onClick={() => navigateStep('landing')}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-sans tracking-wide transition-all cursor-pointer"
              >
                Exit Studio
              </button>
            </div>
          </header>

          {/* MAIN COLUMN BODY PLATFORM SPLIT */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
            
            {/* LEFT CONTROL SIDEBAR (TABS SPLIT) */}
            <div className={`w-full md:w-[410px] border-r flex-col h-full overflow-hidden transition-colors duration-300 ${
              builderTab === 'preview' ? 'hidden md:flex' : 'flex'
            } ${
              theme === 'dark' ? 'bg-[#060813] border-[#161e33]' : 'bg-white border-slate-200'
            }`}>
              {builderTab === 'inputs' ? (
                <InformationForm 
                  coverData={coverData}
                  setCoverData={setCoverData}
                  coverDesign={coverDesign}
                  setCoverDesign={setCoverDesign}
                  applyPresetDataset={applyPresetDataset}
                  theme={theme}
                  onNext={() => navigateTab('designer')}
                />
              ) : (
                <DesignBuilder 
                  coverDesign={coverDesign}
                  setCoverDesign={setCoverDesign}
                  handleFileUpload={handleFileUpload}
                  theme={theme}
                  coverData={coverData}
                  setCoverData={setCoverData}
                  pageBackgroundColor={pageBackgroundColor}
                  onChangePageBackgroundColor={updatePageBackgroundColor}
                />
              )}
            </div>

            {/* RIGHT A4 REALTIME PREVIEW FRAME */}
            <div className={`flex-1 flex-col overflow-hidden relative transition-colors duration-300 ${
              builderTab === 'preview' ? 'flex' : 'hidden md:flex'
            } ${
              theme === 'dark' ? 'bg-[#030407]' : 'bg-slate-50'
            }`}>
                         {/* Top toolbar header with zoom and download buttons */}
              <div className={`shrink-0 z-20 flex flex-row flex-wrap gap-3 items-center justify-between p-3.5 border-b transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#040508] border-slate-850' : 'bg-slate-50 border-slate-200/60'
              }`}>
                <div className={`flex items-center space-x-1 px-2.5 py-1.5 backdrop-blur border rounded-lg shadow-sm select-none transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#090b12]/95 border-slate-800' : 'bg-white border-slate-200/90'
                }`}>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(35, prev - 5))}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-850'
                    }`}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-[10px] font-mono px-1 font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-650'}`}>{zoomLevel}% View</span>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(100, prev + 5))}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-850'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setZoomLevel(60)}
                    className={`p-1 rounded transition-colors cursor-pointer ml-1 ${
                      theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-850'
                    }`}
                    title="Fit scale"
                  >
                    <Maximize className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className={`flex flex-row items-center gap-1.5 sm:gap-2 backdrop-blur border p-1 rounded-lg shadow-sm transition-colors duration-300 w-full sm:w-auto justify-between sm:justify-end ${
                  theme === 'dark' ? 'bg-[#090b12]/95 border-slate-800' : 'bg-white border-slate-200/90'
                }`}>
                  
                  <div 
                    className="dropdown relative"
                    onMouseLeave={() => setIsDownloadOpen(false)}
                  >
                    <button 
                      onClick={() => setIsDownloadOpen(p => !p)}
                      className="relative p-[1.5px] rounded-lg overflow-hidden flex items-center justify-center bg-transparent cursor-pointer transition-all active:scale-[0.98] group/btn w-full sm:w-auto"
                    >
                      {/* Animated rotating high fidelity neon border outline */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 via-[#a7f3d0] to-teal-600 opacity-100 animate-[spin_3.5s_linear_infinite]" />
                      
                      {/* Button content face mask */}
                      <div className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 hover:bg-[#030406] rounded-[7px] text-[10px] sm:text-xs font-bold flex items-center transition-all w-full justify-center ${
                        theme === 'dark' ? 'bg-[#090b12] text-slate-200 hover:text-white' : 'bg-slate-900 text-white hover:text-slate-100'
                      }`}>
                        {/* Interactive jumping/rising micro-animation */}
                        <motion.div
                          animate={{
                            y: [0, -4, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="mr-1.5 sm:mr-2 text-emerald-400 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent font-black tracking-wide shrink-0">
                          {coverDesign.backPageEnabled ? (
                            <>
                              <span className="inline sm:hidden">Download Front</span>
                              <span className="hidden sm:inline">Download Front Cover</span>
                            </>
                          ) : (
                            "Download Copy"
                          )}
                        </span>
                      </div>
                    </button>
                    <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl py-3 animate-fadeIn z-20 ${
                      isDownloadOpen ? 'opacity-100 pointer-events-auto scale-100 translate-y-0' : 'opacity-0 pointer-events-none scale-95 -translate-y-2 origin-top-right'
                    } ${
                      theme === 'dark' ? 'bg-[#090b11] border border-slate-850 shadow-[0_12px_40px_rgba(0,0,0,0.6)]' : 'bg-white border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.1)]'
                    }`}>
                      <div className="px-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black uppercase text-slate-400">Export Document</span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500/10 text-emerald-500 font-extrabold uppercase">High DPI</span>
                      </div>

                      {/* --- VECTOR PDF SECTION WITH ADVANCED OPTIONS --- */}
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-extrabold tracking-wide uppercase">Vector PDF Document</span>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400">Settings, size & numbers</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              setShowAdvancedPdfDialog(true);
                            }}
                            className="p-1 px-2 rounded-lg text-[9px] font-mono font-bold uppercase bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all cursor-pointer select-none"
                            title="Configure advanced page options"
                          >
                            Configure
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              setPdfQuality('low');
                              setShowAdvancedPdfDialog(true);
                            }}
                            className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              theme === 'dark' ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            }`}
                            title="Configure standard PDF"
                          >
                            Low
                          </button>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              setPdfQuality('medium');
                              setShowAdvancedPdfDialog(true);
                            }}
                            className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              theme === 'dark' ? 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-300' : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                            }`}
                            title="Configure medium PDF"
                          >
                            Med
                          </button>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              setPdfQuality('high');
                              setShowAdvancedPdfDialog(true);
                            }}
                            className="py-1 rounded text-[9px] font-mono font-extrabold uppercase bg-rose-600 hover:bg-rose-550 text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            title="Configure premium PDF"
                          >
                            High
                          </button>
                        </div>
                      </div>

                      {/* --- HIGH-RES PNG SECTION --- */}
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center space-x-2.5 mb-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                            <Image className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-extrabold tracking-wide uppercase">Lossless PNG Image</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400">Rich colors & crisp text</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              handleDownloadPNG('low');
                            }}
                            className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              theme === 'dark' ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                            }`}
                            title="Export 1x scale flat PNG"
                          >
                            Low
                          </button>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              handleDownloadPNG('medium');
                            }}
                            className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              theme === 'dark' ? 'bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                            }`}
                            title="Export 2x scale sharp PNG"
                          >
                            Med
                          </button>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              handleDownloadPNG('high');
                            }}
                            className="py-1 rounded text-[9px] font-mono font-extrabold uppercase bg-indigo-600 hover:bg-indigo-550 text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            title="Export 4.0x scale ultra premium PNG"
                          >
                            High
                          </button>
                        </div>
                      </div>

                      {/* --- COMPRESSED JPG SECTION --- */}
                      <div className="p-3.5">
                        <div className="flex items-center space-x-2.5 mb-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                            <FileImage className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-extrabold tracking-wide uppercase">Compressed JPG Image</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400">Efficient, compact cover graphic</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              handleDownloadJPG('low');
                            }}
                            className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              theme === 'dark' ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            }`}
                            title="Low quality JPG file"
                          >
                            Low
                          </button>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              handleDownloadJPG('medium');
                            }}
                            className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                              theme === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                            title="Medium quality JPG file"
                          >
                            Med
                          </button>
                          <button
                            onClick={() => {
                              setIsDownloadOpen(false);
                              handleDownloadJPG('high');
                            }}
                            className="py-1 rounded text-[9px] font-mono font-extrabold uppercase bg-emerald-650 hover:bg-emerald-600 text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            title="Maximum high quality JPG file"
                          >
                            High
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {coverDesign.backPageEnabled && (
                    <div 
                      className="dropdown relative"
                      onMouseLeave={() => setIsBackDownloadOpen(false)}
                    >
                      <button 
                        onClick={() => setIsBackDownloadOpen(p => !p)}
                        className="relative p-[1.5px] rounded-lg overflow-hidden flex items-center justify-center bg-transparent cursor-pointer transition-all active:scale-[0.98] group/btn w-full sm:w-auto"
                      >
                        {/* Animated rotating high fidelity neon border outline (distinct color scheme for Back Page) */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-[#93c5fd] to-indigo-600 opacity-100 animate-[spin_3.5s_linear_infinite]" />
                        
                        {/* Button content face mask */}
                        <div className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 hover:bg-[#030406] rounded-[7px] text-[10px] sm:text-xs font-bold flex items-center transition-all w-full justify-center ${
                          theme === 'dark' ? 'bg-[#090b12] text-slate-200 hover:text-white' : 'bg-slate-900 text-white hover:text-slate-100'
                        }`}>
                          {/* Interactive jumping/rising micro-animation */}
                          <motion.div
                            animate={{
                              y: [0, -4, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="mr-1.5 sm:mr-2 text-blue-400 shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </motion.div>
                          <span className="bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent font-black tracking-wide font-sans shrink-0">
                            <span className="inline sm:hidden">Download Back</span>
                            <span className="hidden sm:inline">Download Back Page</span>
                          </span>
                        </div>
                      </button>
                      <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl py-3 animate-fadeIn z-20 ${
                        isBackDownloadOpen ? 'opacity-100 pointer-events-auto scale-100 translate-y-0' : 'opacity-0 pointer-events-none scale-95 -translate-y-2 origin-top-right'
                      } ${
                        theme === 'dark' ? 'bg-[#090b11] border border-slate-850 shadow-[0_12px_40px_rgba(0,0,0,0.6)]' : 'bg-white border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.1)]'
                      }`}>
                        <div className="px-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-black uppercase text-slate-400">Export Back Page</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-blue-500/10 text-blue-500 font-extrabold uppercase">Back Only</span>
                        </div>

                        {/* --- VECTOR PDF SECTION FOR BACK PAGE --- */}
                        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
                          <div className="flex items-center space-x-2.5 mb-2.5">
                            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-extrabold tracking-wide uppercase">Vector PDF Back Page</span>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400">Page size & single-page layout</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={async () => {
                                setIsBackDownloadOpen(false);
                                await handleDownloadPDF('low', {
                                  includePageNumbers: pdfIncludePageNumbers,
                                  printBackgroundGraphics: pdfPrintBackground,
                                  paperSize: pdfPaperSize,
                                  onlyBackPage: true
                                });
                              }}
                              className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                                theme === 'dark' ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                              }`}
                            >
                              Low
                            </button>
                            <button
                              onClick={async () => {
                                setIsBackDownloadOpen(false);
                                await handleDownloadPDF('medium', {
                                  includePageNumbers: pdfIncludePageNumbers,
                                  printBackgroundGraphics: pdfPrintBackground,
                                  paperSize: pdfPaperSize,
                                  onlyBackPage: true
                                });
                              }}
                              className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                                theme === 'dark' ? 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-300' : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                              }`}
                            >
                              Med
                            </button>
                            <button
                              onClick={async () => {
                                setIsBackDownloadOpen(false);
                                await handleDownloadPDF('high', {
                                  includePageNumbers: pdfIncludePageNumbers,
                                  printBackgroundGraphics: pdfPrintBackground,
                                  paperSize: pdfPaperSize,
                                  onlyBackPage: true
                                });
                              }}
                              className="py-1 rounded text-[9px] font-mono font-extrabold uppercase bg-rose-600 hover:bg-rose-550 text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            >
                              High
                            </button>
                          </div>
                        </div>

                        {/* --- PNG SECTION FOR BACK PAGE --- */}
                        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/60">
                          <div className="flex items-center space-x-2.5 mb-2.5">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                              <Image className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-extrabold tracking-wide uppercase">Lossless PNG Back Page</span>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400">Crisp, single back cover image</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => {
                                setIsBackDownloadOpen(false);
                                handleDownloadPNG('low', { onlyBackPage: true });
                              }}
                              className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                                theme === 'dark' ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                              }`}
                            >
                              Low
                            </button>
                            <button
                              onClick={() => {
                                setIsBackDownloadOpen(false);
                                handleDownloadPNG('medium', { onlyBackPage: true });
                              }}
                              className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                                theme === 'dark' ? 'bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                              }`}
                            >
                              Med
                            </button>
                            <button
                              onClick={() => {
                                setIsBackDownloadOpen(false);
                                handleDownloadPNG('high', { onlyBackPage: true });
                              }}
                              className="py-1 rounded text-[9px] font-mono font-extrabold uppercase bg-indigo-600 hover:bg-indigo-550 text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            >
                              High
                            </button>
                          </div>
                        </div>

                        {/* --- JPG SECTION FOR BACK PAGE --- */}
                        <div className="p-3.5">
                          <div className="flex items-center space-x-2.5 mb-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <FileImage className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-extrabold tracking-wide uppercase">Compressed JPG Back Page</span>
                              <span className="text-[9px] text-slate-500 dark:text-slate-400">Efficient, single back cover layout</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => {
                                setIsBackDownloadOpen(false);
                                handleDownloadJPG('low', { onlyBackPage: true });
                              }}
                              className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                                theme === 'dark' ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                              }`}
                            >
                              Low
                            </button>
                            <button
                              onClick={() => {
                                setIsBackDownloadOpen(false);
                                handleDownloadJPG('medium', { onlyBackPage: true });
                              }}
                              className={`py-1 rounded text-[9px] font-mono font-bold uppercase transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                                theme === 'dark' ? 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                              }`}
                            >
                              Med
                            </button>
                            <button
                              onClick={() => {
                                setIsBackDownloadOpen(false);
                                handleDownloadJPG('high', { onlyBackPage: true });
                              }}
                              className="py-1 rounded text-[9px] font-mono font-extrabold uppercase bg-emerald-650 hover:bg-emerald-600 text-white transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            >
                              High
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Infinite background preview area */}
              <div className={`flex-1 overflow-auto flex items-start justify-center p-12 select-none transition-colors duration-300 ${
                theme === 'dark' ? 'bg-[#040508]' : 'bg-slate-100 shadow-inner'
              }`}>
                
                {/* Scaled viewport container with smooth animated transitions */}
                <motion.div
                  key={`${theme}-${coverDesign.templateId}-${coverDesign.paperColor}`}
                  initial={{ opacity: 0.85, scale: 0.985, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0.85, scale: 0.985, y: -12 }}
                  transition={{ 
                    duration: 0.55, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="flex items-center justify-center p-2"
                >
                  <CoverDocument 
                    data={coverData}
                    design={coverDesign}
                    zoom={zoomLevel}
                    pageBackgroundColor={pageBackgroundColor}
                  />
                </motion.div>

              </div>
              
              {/* Spinner feedback during canvas render */}
              {isExporting && (
                <div className="absolute inset-0 z-50 bg-[#06070b]/90 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <span className="text-xs text-slate-300 font-mono tracking-wider font-bold">{isExporting}</span>
                </div>
              )}

              {/* Advanced PDF Export Dialog */}
              {showAdvancedPdfDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none animate-fadeIn">
                  {/* Backdrop Closer */}
                  <div className="absolute inset-0 cursor-default" onClick={() => setShowAdvancedPdfDialog(false)} />
                  
                  <div className={`max-w-md w-full rounded-2xl p-6 relative shadow-2xl space-y-5 animate-scaleUp border z-10 transition-colors duration-300 ${
                    theme === 'dark' 
                      ? "bg-[#0b0f19] border-slate-800 text-slate-100 shadow-[0_24px_50px_rgba(0,0,0,0.8)]" 
                      : "bg-white border-slate-200 text-slate-800 shadow-[0_24px_50px_rgba(0,0,0,0.15)]"
                  }`}>
                    
                    {/* Close Button */}
                    <button 
                      onClick={() => setShowAdvancedPdfDialog(false)}
                      className={`absolute top-5 right-5 p-1 rounded-lg border transition-colors cursor-pointer ${
                        theme === 'dark' 
                          ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center space-x-3 pb-1">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                        <Settings2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-black uppercase tracking-wider text-left ${theme === 'dark' ? "text-white" : "text-slate-800"}`}>
                          Advanced PDF Settings
                        </h3>
                        <p className={`text-[10px] uppercase font-mono tracking-wide text-left ${theme === 'dark' ? "text-slate-400" : "text-slate-550"}`}>
                          Custom Page Size & Options
                        </p>
                      </div>
                    </div>

                    {/* Config Elements */}
                    <div className="space-y-4 pt-1">
                      {/* Configuration Element: Paper Size selection */}
                      <div className="space-y-2">
                        <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-widest text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Paper Form Size
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPdfPaperSize('a4')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer text-center ${
                              pdfPaperSize === 'a4'
                                ? 'bg-indigo-600/15 text-indigo-450 border-indigo-550 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40'
                                : theme === 'dark'
                                  ? 'bg-[#121932]/40 border-slate-850 hover:bg-slate-900 text-slate-405'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650 shadow-sm'
                            }`}
                          >
                            <span className="text-xs font-black uppercase tracking-widest">A4 Paper</span>
                            <span className="text-[9px] font-mono opacity-80 mt-0.5">210 × 297 mm</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPdfPaperSize('letter')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer text-center ${
                              pdfPaperSize === 'letter'
                                ? 'bg-indigo-600/15 text-indigo-455 border-indigo-550 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40'
                                : theme === 'dark'
                                  ? 'bg-[#121932]/40 border-slate-850 hover:bg-slate-900 text-slate-405'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650 shadow-sm'
                            }`}
                          >
                            <span className="text-xs font-black uppercase tracking-widest">Letter Paper</span>
                            <span className="text-[9px] font-mono opacity-80 mt-0.5">8.5 × 11 in</span>
                          </button>
                        </div>
                      </div>

                      {/* Quality Presets */}
                      <div className="space-y-2">
                        <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-widest text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          DPI Resolution
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'low', label: 'Standard', desc: '1.2x scale' },
                            { id: 'medium', label: 'Medium', desc: '2.2x scale' },
                            { id: 'high', label: 'Premium', desc: '3.5x scale' }
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setPdfQuality(preset.id as any)}
                              className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all cursor-pointer text-center ${
                                pdfQuality === preset.id
                                  ? 'bg-rose-500/15 text-rose-500 border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/50'
                                  : theme === 'dark'
                                    ? 'bg-[#121932]/40 border-slate-850 hover:bg-slate-900 text-slate-400'
                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650 shadow-sm'
                              }`}
                            >
                              <span className="text-[11px] font-black uppercase tracking-wider">{preset.label}</span>
                              <span className="text-[8px] font-mono opacity-70 mt-0.5">{preset.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Config Options: Toggle switches */}
                      <div className="space-y-3 pt-1">
                        {/* Option 1: Page Numbers Option */}
                        <div className={`flex items-center justify-between p-3 rounded-xl border text-left ${
                          theme === 'dark' ? 'bg-[#101524]/60 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                        }`}>
                          <div className="flex flex-col pr-3">
                            <span className="text-[11px] font-extrabold uppercase tracking-wide">Include Page Numbers</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Prints centered pagination label ("Page 1") on footers</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPdfIncludePageNumbers(prev => !prev)}
                            className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                              pdfIncludePageNumbers ? 'bg-indigo-650' : 'bg-slate-350 dark:bg-slate-800'
                            }`}
                          >
                            <span className={`absolute top-0.5 left-0.5 bg-white w-4.5 h-4.5 rounded-full shadow-md transition-transform duration-200 ${
                              pdfIncludePageNumbers ? 'translate-x-4.5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Option 2: Print Background Graphics option */}
                        <div className={`flex items-center justify-between p-3 rounded-xl border text-left ${
                          theme === 'dark' ? 'bg-[#101524]/60 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                        }`}>
                          <div className="flex flex-col pr-3">
                            <span className="text-[11px] font-extrabold uppercase tracking-wide">Print Background Graphics</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">Include gradients, borders, frames and background watermark designs</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPdfPrintBackground(prev => !prev)}
                            className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                              pdfPrintBackground ? 'bg-indigo-655' : 'bg-slate-350 dark:bg-slate-800'
                            }`}
                          >
                            <span className={`absolute top-0.5 left-0.5 bg-white w-4.5 h-4.5 rounded-full shadow-md transition-transform duration-200 ${
                              pdfPrintBackground ? 'translate-x-4.5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Action buttons panel */}
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedPdfDialog(false)}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer text-center ${
                          theme === 'dark'
                            ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-white'
                            : 'bg-slate-100 hover:bg-slate-150 border-slate-200 text-slate-650 shadow-sm'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setShowAdvancedPdfDialog(false);
                          await handleDownloadPDF(pdfQuality, {
                            includePageNumbers: pdfIncludePageNumbers,
                            printBackgroundGraphics: pdfPrintBackground,
                            paperSize: pdfPaperSize
                          });
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/20"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>

        </motion.div>
      )}
      </AnimatePresence>

    </div>
    </>
  );
}
