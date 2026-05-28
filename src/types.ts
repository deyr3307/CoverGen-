export interface CoverPageData {
  documentType: string;
  topicTitle: string;
  courseNo: string;
  courseNoHeading?: string;
  courseName: string;
  courseNameHeading?: string;
  assignmentNoText?: string;
  
  // Submitted To (Primary)
  teacherName: string;
  teacherDesignation: string;
  teacherDiscipline: string;
  teacherUniversity: string;
  teacherLocation: string;
  teacherHeading?: string;
  teacherDetails?: string;

  // Submitted To (Secondary - optional for multiple teachers)
  teacher2Name?: string;
  teacher2Designation?: string;
  teacher2Discipline?: string;
  teacher2University?: string;
  teacher2Location?: string;
  
  // Submitted By
  submittedByLabel: string; // "Submitted By" or "Prepared By"
  studentName: string;
  studentId: string;
  studentYearTerm: string;
  studentDiscipline: string;
  studentUniversity: string;
  studentLocation: string;
  studentDetails?: string;
  
  // Date
  submissionDate: string;
  submissionDateHeading?: string;
  universityName?: string;
}

export interface FontConfig {
  fontFamily: string;
  color: string;
  fontSize: number; // in pt or relative scale
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface CoverPageDesign {
  fontTitle: FontConfig;
  fontCourse: FontConfig;
  fontSubSection: FontConfig;
  fontDate: FontConfig;

  // Granular individual font controls for every single topic and content field
  fontAssignmentTopic?: FontConfig;
  fontTopicTitle?: FontConfig;
  fontCourseNoHeading?: FontConfig;
  fontCourseNoContent?: FontConfig;
  fontCourseTitleHeading?: FontConfig;
  fontCourseTitleContent?: FontConfig;
  fontSubmittedToHeading?: FontConfig;
  fontSubmittedToContent?: FontConfig;
  fontSubmittedByHeading?: FontConfig;
  fontSubmittedByContent?: FontConfig;
  fontSubmissionDateHeading?: FontConfig;
  fontSubmissionDateContent?: FontConfig;
  fontUniversity?: FontConfig;
  fontDiscipline?: FontConfig;
  
  // Branding assets
  logoUrl: string; // data URL or standard preset SVG
  logoHeight: number; // logo height in px
  watermarkUrl: string; // custom watermark image URL or preset
  watermarkOpacity: number; // 0 to 1
  watermarkScale: number; // scale percent
  watermarkXOffset?: number; // horizontal offset in pixels (can be negative)
  watermarkYOffset?: number; // vertical offset in pixels (can be negative)
  
  // Accents and layout
  borderColor: string;
  borderStyle: 'none' | 'single' | 'double' | 'classic' | 'modern';
  borderWidth: number; // dynamically adjustable from 1px to 20px
  accentColor: string; // primary matching theme color
  paperColor: string; // white, or academic cream
  
  // Extra elements
  hasHeaderLine: boolean;
  hasFooterLine: boolean;

  // QR Code settings
  showQrCode: boolean;
  qrCodeUrl: string;
  qrCodeSize: number;
  qrCodePosition: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';

  // Selected Template Style
  templateId?: 'ku' | 'du-classic' | 'du-minimal' | 'jnu' | 'ruet' | 'jnu-finance' | 'presidency' | 'jnu-traditional' | 'teal-bars' | 'ku-law-table' | 'cu-boxed-code' | 'asymmetrical-research' | 'top-header-asymmetric';

  // Drag and drop custom element positions
  positions?: Record<string, { x: number; y: number }>;
}

// Default values as specified in user guidelines
export const DEFAULT_COVER_DATA: CoverPageData = {
  documentType: 'AN ASSIGNMENT ON',
  topicTitle: 'ANALYSIS OF HEAVY METAL CONCENTRATION IN URBAN RIVER WATER',
  courseNo: 'ES-1205',
  courseNoHeading: 'COURSE NO:',
  courseName: 'Environmental Chemistry & Pollution Lab',
  courseNameHeading: 'COURSE TITLE:',
  assignmentNoText: '',
  
  teacherHeading: 'SUBMITTED TO,',
  teacherName: 'Dr. S. M. Tariqul Islam',
  teacherDesignation: 'Professor',
  teacherDiscipline: 'Environmental Science Discipline',
  teacherUniversity: 'Khulna University',
  teacherLocation: 'Khulna-9208',
  teacherDetails: `Dr. S. M. Tariqul Islam\nProfessor\nEnvironmental Science Discipline\nKhulna University\nKhulna-9208`,
  
  submittedByLabel: 'SUBMITTED BY,',
  studentName: 'Anirudha Dey',
  studentId: '251009',
  studentYearTerm: '1st Year, 2nd Term',
  studentDiscipline: 'Environmental Science Discipline',
  studentUniversity: 'Khulna University',
  studentLocation: 'Khulna',
  studentDetails: `Anirudha Dey\nSTUDENT ID: 251009\n1st Year, 2nd Term\nEnvironmental Science Discipline\nKhulna University\nKhulna`,
  
  submissionDate: '2026-05-25',
  submissionDateHeading: 'DATE OF SUBMISSION:',
};

export const STANDARD_FONTS = [
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Garamond', value: 'Garamond, "EB Garamond", serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'UnifrakturMaguntia (Gothic)', value: 'UnifrakturMaguntia, serif' },
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { name: 'Kaushan Script (Cursive)', value: '"Kaushan Script", cursive' },
  { name: 'Playball (Cursive)', value: '"Playball", cursive' },
  { name: 'Satisfy (Cursive)', value: '"Satisfy", cursive' },
  { name: 'Dancing Script (Cursive)', value: '"Dancing Script", cursive' },
  { name: 'Caveat (Cursive)', value: '"Caveat", cursive' },
  // Additional new fonts to complete exactly 50 styles limit
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Cinzel', value: '"Cinzel", serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Merriweather', value: '"Merriweather", serif' },
  { name: 'Oswald', value: '"Oswald", sans-serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'Great Vibes (Elegant)', value: '"Great Vibes", cursive' },
  { name: 'Alex Brush (Elegant)', value: '"Alex Brush", cursive' },
  { name: 'Sacramento (Monoline)', value: '"Sacramento", cursive' },
  { name: 'Allura (Calligraphy)', value: '"Allura", cursive' },
  { name: 'Abril Fatface', value: '"Abril Fatface", serif' },
  { name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
  { name: 'DM Sans', value: '"DM Sans", sans-serif' },
  { name: 'Fira Sans', value: '"Fira Sans", sans-serif' },
  { name: 'Inconsolata', value: '"Inconsolata", monospace' },
  { name: 'Josefin Sans', value: '"Josefin Sans", sans-serif' },
  { name: 'Kanit', value: '"Kanit", sans-serif' },
  { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
  { name: 'Lobster (Retro)', value: '"Lobster", cursive' },
  { name: 'Cinzel Decorative', value: '"Cinzel Decorative", serif' },
  { name: 'Noto Serif', value: '"Noto Serif", serif' },
  { name: 'Pacifico (Retro)', value: '"Pacifico", cursive' },
  { name: 'Quicksand (Round)', value: '"Quicksand", sans-serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif' },
  { name: 'Spectral', value: '"Spectral", serif' },
  { name: 'Fascinate', value: '"Fascinate", display' },
  { name: 'Bebas Neue (Condensed)', value: '"Bebas Neue", sans-serif' },
  { name: 'Amatic SC', value: '"Amatic SC", sans-serif' },
  { name: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
  { name: 'Permanent Marker', value: '"Permanent Marker", cursive' },
  { name: 'Comfortaa (Rounded)', value: '"Comfortaa", sans-serif' },
  { name: 'Arvo (Slab)', value: '"Arvo", serif' },
  { name: 'Cardo (Classic)', value: '"Cardo", serif' },
  { name: 'Crimson Text', value: '"Crimson Text", serif' },
  { name: 'Courier New', value: '"Courier New", monospace' }
];

export const DEFAULT_DESIGN: CoverPageDesign = {
  fontTitle: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#d95d39', // Salmon accent
    fontSize: 24,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontCourse: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02', // Soft dark warm charcoal
    fontSize: 16,
    bold: true,
    italic: false,
    uppercase: false,
    align: 'center'
  },
  fontSubSection: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#d95d39', // Salmon accent
    fontSize: 12,
    bold: false,
    italic: false,
    uppercase: false,
    align: 'center'
  },
  fontDate: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 12,
    bold: true,
    italic: false,
    uppercase: false,
    align: 'center'
  },

  // Default individual field styles matching original defaults precisely
  fontAssignmentTopic: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#d95d39', // Salmon accent
    fontSize: 10,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontTopicTitle: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 24,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontCourseNoHeading: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 14,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontCourseNoContent: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 14,
    bold: true,
    italic: false,
    uppercase: false,
    align: 'center'
  },
  fontCourseTitleHeading: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 14,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontCourseTitleContent: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 14,
    bold: true,
    italic: false,
    uppercase: false,
    align: 'center'
  },
  fontSubmittedToHeading: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#c2410c', // Salmon dark
    fontSize: 12.5,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'left'
  },
  fontSubmittedToContent: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 12,
    bold: false,
    italic: false,
    uppercase: false,
    align: 'left'
  },
  fontSubmittedByHeading: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#c2410c', // Salmon dark
    fontSize: 12.5,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'right'
  },
  fontSubmittedByContent: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 12,
    bold: false,
    italic: false,
    uppercase: false,
    align: 'right'
  },
  fontSubmissionDateHeading: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 12,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontSubmissionDateContent: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#2a0c02',
    fontSize: 12,
    bold: true,
    italic: false,
    uppercase: false,
    align: 'center'
  },
  fontUniversity: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#c2410c',
    fontSize: 18,
    bold: true,
    italic: false,
    uppercase: true,
    align: 'center'
  },
  fontDiscipline: {
    fontFamily: '"Times New Roman", Times, serif',
    color: '#ff7f50', // Coral color
    fontSize: 12,
    bold: true,
    italic: false,
    uppercase: false,
    align: 'center'
  },

  logoUrl: '', // starts empty so the user uploads their own logo, preserving no built-in presets by default
  logoHeight: 110, // slightly larger standard logo for perfect proportion
  watermarkUrl: '',
  watermarkOpacity: 0.08,
  watermarkScale: 100,
  watermarkXOffset: 0,
  watermarkYOffset: 0,
  borderColor: '#ffa07a', // Light Salmon border
  borderStyle: 'double',
  borderWidth: 6,
  accentColor: '#d95d39', // Salmon primary
  paperColor: '#fff0eb', // Light Salmon background
  hasHeaderLine: false,
  hasFooterLine: false,
  showQrCode: false,
  qrCodeUrl: 'https://ais-pre-addwarwd4aeqduqml4nd7h-507388019707.asia-southeast1.run.app',
  qrCodeSize: 60,
  qrCodePosition: 'bottom-right',
  templateId: 'top-header-asymmetric', // Use the stunning, highly personalized asymmetric template by default now!
  positions: {}
};
