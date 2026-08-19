// Built-in SVG representations for University Logos and Watermarks.
// These are standard scalables that output perfectly inside HTML nodes and html2canvas exports.

export interface VisualPreset {
  id: string;
  name: string;
  svgPath: string; // The inner SVG path or elements
  viewBox: string;
  primaryColor: string;
}

export const LOGO_PRESETS: VisualPreset[] = [
  {
    id: 'preset-khulna',
    name: 'Elegant Royalty Shield (Stag Detail)',
    viewBox: '0 0 100 115',
    primaryColor: '#0ea5e9',
    svgPath: `
      <!-- Golden-Orange outer shield contour -->
      <path d="M50 4 C24 4 10 24 10 52 C10 82 42 110 50 112 C58 110 90 82 90 52 C90 24 76 4 50 4 Z" fill="none" stroke="#f97316" stroke-width="3.5" />
      <path d="M50 8 C28 8 14 27 14 52 C14 80 44 106 50 108 C56 106 86 80 86 52 C86 27 72 8 50 8 Z" fill="currentColor" fill-opacity="0.04" stroke="#0284c7" stroke-width="3" />
      
      <!-- Top fan crown representing rays/leaves of knowledge splay -->
      <path d="M50 32 C50 32 46 22 28 20 C42 22 48 28 48 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 54 22 72 20 C58 22 52 28 52 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 44 17 31 13 C42 16 47 24 48 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 56 17 69 13 C58 16 53 24 52 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 40 13 36 7 C43 12 46 21 48 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 60 13 64 7 C57 12 54 21 52 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 48 10 44 4 C48 10 49 20 50 32 Z" fill="#0284c7" />
      <path d="M50 32 C50 32 52 10 56 4 C52 10 51 20 50 32 Z" fill="#0284c7" />

      <!-- Center container ribbon style arches -->
      <path d="M22 41 C22 41 28 35 50 35 C72 35 78 41 78 41 L78 90 C78 90 70 96 50 96 C30 96 22 90 22 90 Z" fill="none" stroke="#0284c7" stroke-width="3" />
      <path d="M30 46 C30 46 34 42 50 42 C66 42 70 46 70 46 L70 85 C70 85 64 89 50 89 C36 89 30 85 30 85 Z" fill="none" stroke="#0284c7" stroke-width="2" />

      <!-- Bengali calligraphy arch markings inside border -->
      <path d="M17 38 C16 42 16 47 16 52 C16 64 19 72 23 80" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round" />
      <path d="M83 38 C84 42 84 47 84 52 C84 64 81 72 77 80" fill="none" stroke="#0284c7" stroke-width="4" stroke-linecap="round" />

      <!-- Royal Spotted Stag (Deer of the Sundarbans Mangroves) -->
      <path d="M50 44 C48.5 44 47.5 41 47.5 39 C47.5 38 48 37 49 37 C50 37 50.5 38 50.5 39 C50.5 41 51.5 44 50 44 Z" fill="#f97316" />
      <path d="M48.5 41 L43.5 47 L46.5 47 L43 51" stroke="#f97316" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" /> <!-- Left Antler -->
      <path d="M51.5 41 L56.5 47 L53.5 47 L57 51" stroke="#f97316" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" /> <!-- Right Antler -->
      
      <!-- Body of the majestic stag -->
      <path d="M49 43 C49 43 41.5 47 41.5 59 C41.5 68 46.5 73.5 52 73.5 C57.5 73.5 60.5 68 60.5 59 C60.5 47 51 43 49 43 Z" fill="#f97316" />
      
      <!-- Limbs / hooves of the stag standing in royal grace -->
      <path d="M44 65 L41.5 74 L39.5 83" stroke="#f97316" stroke-width="3" stroke-linecap="round" fill="none" stroke-linejoin="round" />
      <path d="M49.5 68 L49.5 77 L49.5 84" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" fill="none" stroke-linejoin="round" />
      <path d="M57 65 L59.5 74 L61.5 83" stroke="#f97316" stroke-width="3" stroke-linecap="round" fill="none" stroke-linejoin="round" />
      
      <!-- Beautiful fluffy tail -->
      <path d="M59.5 54 C61.5 54 63.5 56.5 62 59.5 Z" fill="#f97316" />
    `
  },
  {
    id: 'preset-academic',
    name: 'Classic Academic Shield',
    viewBox: '0 0 100 100',
    primaryColor: '#1e3a8a',
    svgPath: `
      <path d="M50 5 L15 15 L15 45 C15 70 50 95 50 95 C50 95 85 70 85 45 L85 15 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <path d="M50 12 L18 21 L18 45 C18 66 50 88 50 88 C50 88 82 66 82 45 L82 21 Z" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M50 15 V85" stroke="currentColor" stroke-width="2" stroke-dasharray="1 2"/>
      <!-- Book icon inside -->
      <path d="M32 40 C32 40 40 38 50 42 C60 38 68 40 68 40 V65 C68 65 60 63 50 67 C40 63 32 65 32 65 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 42 V67" stroke="currentColor" stroke-width="3"/>
      <!-- Small stars -->
      <path d="M50 24 L52 28 L57 28 L53 31 L55 35 L50 33 L45 35 L47 31 L43 28 L48 28 Z" fill="currentColor"/>
    `
  },
  {
    id: 'preset-science',
    name: 'Scientific / Lab Shield',
    viewBox: '0 0 100 100',
    primaryColor: '#0f766e',
    svgPath: `
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="4"/>
      <circle cx="50" cy="50" r="40" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3"/>
      <!-- Atom orbits -->
      <ellipse cx="50" cy="50" rx="28" ry="10" transform="rotate(30 50 50)" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.7"/>
      <ellipse cx="50" cy="50" rx="28" ry="10" transform="rotate(90 50 50)" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.7"/>
      <ellipse cx="50" cy="50" rx="28" ry="10" transform="rotate(150 50 50)" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity="0.7"/>
      <!-- Lab Beaker/Flask -->
      <path d="M42 35 H58 M46 35 V42 L34 68 C32 72 35 77 40 77 H60 C65 77 68 72 66 68 L54 42 V35" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
      <!-- Rising bubbles & liquid -->
      <path d="M37 62 C43 60 47 64 53 62 C59 60 63 62 63 62 L61 68 H39 Z" fill="currentColor"/>
      <circle cx="50" cy="50" r="3" fill="currentColor"/>
    `
  },
  {
    id: 'preset-engineering',
    name: 'Engineering & Gear Crest',
    viewBox: '0 0 100 100',
    primaryColor: '#b45309',
    svgPath: `
      <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="50,12 84,31 84,69 50,88 16,69 16,31" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <!-- Gear -->
      <path d="M50 28 C37.8 28 28 37.8 28 50 C28 62.2 37.8 72 50 72 C62.2 72 72 62.2 72 50 C72 37.8 62.2 28 50 28 Z M50 36 C57.7 36 64 42.3 64 50 C64 57.7 57.7 64 50 64 C42.3 64 36 57.7 36 50 C36 42.3 42.3 36 50 36 Z" fill="currentColor" fill-rule="evenodd"/>
      <!-- Gear Teeth -->
      <path d="M47 22 H53 V29 H47 Z" fill="currentColor"/>
      <path d="M47 71 H53 V78 H47 Z" fill="currentColor"/>
      <path d="M22 47 H29 V53 H22 Z" fill="currentColor"/>
      <path d="M71 47 H78 V53 H71 Z" fill="currentColor"/>
      <path d="M30 30 L35 35 L30 40 L25 35 Z" fill="currentColor" transform="rotate(15 30 30)"/>
      <polygon points="50,38 42,54 58,54" fill="currentColor"/>
      <line x1="50" y1="36" x2="50" y2="64" stroke="currentColor" stroke-width="2"/>
    `
  },
  {
    id: 'preset-environmental',
    name: 'Eco & Ecology Tree',
    viewBox: '0 0 100 100',
    primaryColor: '#15803d',
    svgPath: `
      <path d="M50 5 C74.8 5 95 25.2 95 50 C95 74.8 74.8 95 50 95 C25.2 95 5 74.8 5 50 C5 25.2 25.2 5 50 5 Z" fill="none" stroke="currentColor" stroke-width="4"/>
      <!-- Tree drawing -->
      <path d="M50 78 V45" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
      <path d="M50 60 L38 50" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 52 L62 44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <!-- Foliage clouds -->
      <circle cx="50" cy="32" r="15" fill="currentColor" fill-opacity="0.9"/>
      <circle cx="38" cy="42" r="12" fill="currentColor" fill-opacity="0.9"/>
      <circle cx="62" cy="40" r="12" fill="currentColor" fill-opacity="0.9"/>
      <!-- Waves at bottom -->
      <path d="M20 78 C30 74 40 82 50 78 C60 74 70 82 80 78" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    `
  },
  {
    id: 'preset-du',
    name: 'Classic Academic Shield (Quartered Emblem)',
    viewBox: '0 0 100 105',
    primaryColor: '#1e3a8a',
    svgPath: `
      <!-- Rounded Academic Shield Quarters contour -->
      <path d="M50 4 C18 4 11 20 11 50 C11 75 42 96 50 98 C58 96 89 75 89 50 C89 20 82 4 50 4 Z" fill="#ffffff" stroke="#1e3a8a" stroke-width="4.5" />
      <path d="M50 4 C18 4 11 20 11 50 C11 75 42 96 50 98 C58 96 89 75 89 50 C89 20 82 4 50 4 Z" fill="currentColor" fill-opacity="0.03" />
      
      <!-- Inner boundary accent bar -->
      <path d="M50 8 C23 8 16 23 16 50 C16 71 44 91 50 93 C56 91 84 71 84 50 C84 23 77 8 50 8 Z" fill="none" stroke="#d97706" stroke-width="2" />
      
      <!-- Quadrants Divider Line -->
      <line x1="50" y1="8" x2="50" y2="93" stroke="#1e3a8a" stroke-width="2.5" />
      <line x1="16" y1="50" x2="84" y2="50" stroke="#1e3a8a" stroke-width="2.5" />
      
      <!-- Quadrant 1 (Top-Left): Star crescent shining representing light of Bengal -->
      <path d="M36 22 L37.5 25.5 L41 26 L38.2 28.5 L39 32 L36 30 L33 32 L33.8 28.5 L31 26 L34.5 25.5 Z" fill="#ef4444" stroke="none" />
      <path d="M22 36 C22 41 26 44 32 44 C27 44 24 41 24 36 C24 33 26 31 28 29 C24 31 22 33 22 36 Z" fill="#ea580c" stroke="none" />
      
      <!-- Quadrant 2 (Top-Right): Rising flame torch representing knowledge and insight -->
      <path d="M65 42 L65 30" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round" />
      <path d="M60 30 C60 30 65 24 65 20 C65 24 70 30 70 30 Z" fill="#ef4444" stroke="none" />
      <path d="M62 31 C62 31 65 27 65 24 C65 27 68 31 68 31 Z" fill="#f57c00" stroke="none" />
      <circle cx="65" cy="42" r="3" fill="#d97706" />
      
      <!-- Quadrant 3 (Bottom-Left): Floating leaf blades representing Bengal river water -->
      <path d="M22 75 Q33 64 36 78" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M28 80 Q35 73 42 81" stroke="#15803d" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M33 65 C34 68 31 71 28 69" stroke="#15803d" stroke-width="1.5" fill="none" stroke-linecap="round" />
      
      <!-- Quadrant 4 (Bottom-Right): Open pupil eye representing active perception & focus -->
      <path d="M57 70 Q65 60 73 70" stroke="#1e3a8a" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M57 70 Q65 80 73 70" stroke="#1e3a8a" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <circle cx="65" cy="70" r="4.5" fill="#1e3a8a" />
      <circle cx="67.5" cy="67.5" r="1.5" fill="#ffffff" />
      
      <!-- Scroll ribbon at very bottom of the shield -->
      <path d="M12 94 C32 101 68 101 88 94 L84 91 C68 97 32 97 16 91 Z" fill="none" stroke="#1e3a8a" stroke-width="1.5" />
    `
  },
  {
    id: 'preset-jnu',
    name: 'Academic Medallion (Crimson Red Shield)',
    viewBox: '0 0 100 105',
    primaryColor: '#be123c',
    svgPath: `
      <!-- Double Circular border enclosing core symbols -->
      <circle cx="50" cy="46" r="42" fill="#ffffff" stroke="#be123c" stroke-width="4.5" />
      <circle cx="50" cy="46" r="36" fill="currentColor" fill-opacity="0.04" stroke="#1e3a8a" stroke-width="1.5" stroke-dasharray="1 1.5" />
      
      <!-- Atom orbit in the left field representing sciences -->
      <ellipse cx="36" cy="38" rx="11" ry="4" transform="rotate(22 36 38)" stroke="#3b82f6" stroke-width="1.5" fill="none" />
      <ellipse cx="36" cy="38" rx="11" ry="4" transform="rotate(-22 36 38)" stroke="#3b82f6" stroke-width="1.5" fill="none" />
      <circle cx="36" cy="38" r="2.5" fill="#3b82f6" />
      
      <!-- Cogwheel representing industries on right field -->
      <circle cx="64" cy="38" r="7" stroke="#10b981" stroke-width="2" fill="none" />
      <circle cx="64" cy="38" r="3.5" fill="#10b981" />
      <path d="M64 29.5 V31.5 M64 44.5 V46.5 M55.5 38 H57.5 M70.5 38 H72.5" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
      
      <!-- Open Textbook with bookmarks representing humanities and research -->
      <path d="M30 60 Q50 56 70 60 V76 Q50 72 30 76 Z" fill="#ffffff" stroke="#be123c" stroke-width="2.5" stroke-linejoin="round" />
      <line x1="50" y1="58" x2="50" y2="74" stroke="#d97706" stroke-width="2.5" />
      <path d="M33 64 H46 M33 68 H46 M33 72 H43 M54 64 H67 M54 68 H67 M54 72 H64" stroke="#94a3b8" stroke-width="1" />
      
      <!-- Traditional star and ribbon below -->
      <path d="M20 86 Q50 96 80 86 L74 81 Q50 90 26 81 Z" stroke="#be123c" stroke-width="1.5" fill="none" />
    `
  },
  {
    id: 'preset-ruet',
    name: 'Industrial Engineering Motif (Technical Cogwheel)',
    viewBox: '0 0 100 105',
    primaryColor: '#f97316',
    svgPath: `
      <!-- Industrial Outer Gear/Cog boundary representation -->
      <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#1e293b" stroke-width="3" />
      <circle cx="50" cy="50" r="32" fill="currentColor" fill-opacity="0.04" stroke="#0ea5e9" stroke-width="2" />
      
      <!-- Atomic rings representing progressive sciences -->
      <ellipse cx="50" cy="36" rx="16" ry="5.5" stroke="#ea585c" stroke-width="1.8" transform="rotate(30 50 36)" fill="none" />
      <ellipse cx="50" cy="36" rx="16" ry="5.5" stroke="#ea585c" stroke-width="1.8" transform="rotate(-30 50 36)" fill="none" />
      <circle cx="50" cy="36" r="3" fill="#ea585c" />
      
      <!-- Bridge suspension spans indicating Civil Architecture -->
      <path d="M22 66 C32 55 68 55 78 66" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M22 72 Q50 63 78 72" stroke="#ea580c" stroke-width="2.2" fill="none" stroke-linecap="round" />
      <line x1="33" y1="62" x2="33" y2="70" stroke="#1e293b" stroke-width="1.5" />
      <line x1="50" y1="58.5" x2="50" y2="67" stroke="#1e293b" stroke-width="1.8" />
      <line x1="67" y1="62" x2="67" y2="70" stroke="#1e293b" stroke-width="1.5" />
      
      <!-- Gear tooth lines outside of the main boundary -->
      <path d="M50 8 V12 M50 88 V92 M10 50 H14 M86 50 H90 M23.5 23.5 L26 26 M74 74 L76.5 76.5 M23.5 76.5 L26 74 M74 23.5 L26 74" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
      <circle cx="50" cy="50" r="3" fill="#f97316" />
    `
  },
  {
    id: 'preset-presidency',
    name: 'Presidency University Shield & Infinity Crest',
    viewBox: '0 0 100 115',
    primaryColor: '#b91c1c',
    svgPath: `
      <!-- Red Shield Outer Boundary -->
      <path d="M50 8 C18 8 16 30 16 64 C16 90 44 110 50 112 C56 110 84 90 84 64 C84 30 82 8 50 8 Z" fill="#ffffff" stroke="#b91c1c" stroke-width="3.2" />
      <path d="M50 12 C22 12 20 32 20 64 C20 86 46 104 50 106 C54 104 80 86 80 64 C80 32 78 12 50 12 Z" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.2" />

      <!-- Top curved banners -->
      <path d="M30 20 C40 17 60 17 70 20" stroke="#b91c1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
      <text x="50" y="21" font-size="3" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.1">SAPIENTIA FI SCIENTIA</text>

      <!-- Stars on sides -->
      <text x="23" y="28" font-size="4.5" fill="#1e3a8a" font-weight="bold" text-anchor="middle">★</text>
      <text x="77" y="28" font-size="4.5" fill="#1e3a8a" font-weight="bold" text-anchor="middle">★</text>

      <!-- Inner crimson circle -->
      <circle cx="50" cy="56" r="19" fill="#ffffff" stroke="#b91c1c" stroke-width="1.5" />
      <circle cx="50" cy="56" r="16.5" fill="#b91c1c" />

      <!-- Infinity Loop symbol in white -->
      <path d="M44 51.5 C42 51.5 40.5 53 40.5 55 C40.5 57 42 58.5 44 58.5 C46 58.5 47.5 57 49 55 C50.5 53 52 51.5 54 51.5 C56 51.5 57.5 53 57.5 55 C57.5 57 56 58.5 54 58.5 C52 58.5 50.5 57 49 55 C47.5 53 46 51.5 44 51.5 Z" fill="none" stroke="#ffffff" stroke-width="1.2" />

      <!-- Tree of life -->
      <path d="M50 71 V61" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="50" cy="60" r="2" fill="#ffffff" />
      <circle cx="45" cy="62" r="1.5" fill="#ffffff" />
      <circle cx="55" cy="62" r="1.5" fill="#ffffff" />
      <circle cx="47" cy="66" r="1.2" fill="#ffffff" />
      <circle cx="53" cy="66" r="1.2" fill="#ffffff" />

      <!-- Presidency University curved sidebar text indicators -->
      <text x="14" y="52" font-size="4.2" fill="#1e3a8a" font-family="'Georgia', serif" font-weight="bold" transform="rotate(-68 14 52)">PRESIDENCY</text>
      <text x="80" y="30" font-size="4.2" fill="#1e3a8a" font-family="'Georgia', serif" font-weight="bold" transform="rotate(68 80 30)">UNIVERSITY</text>
    `
  }
];

export const WATERMARK_PRESETS = [
  {
    id: 'wm-none',
    name: 'No Watermark',
    svgPath: ''
  },
  {
    id: 'use-logo',
    name: 'Current University Crest',
    viewBox: '0 0 100 100',
    svgPath: `
      <g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 8 C20 8 16 30 16 64 C16 90 44 110 50 112 C56 110 84 90 84 64 C84 30 80 8 50 8 Z" />
        <circle cx="50" cy="55" r="22" />
        <path d="M50 35 L62 48 L50 61 L38 48 Z" fill="currentColor" fill-opacity="0.15" />
      </g>
    `
  },
  {
    id: 'wm-crest',
    name: 'Academic Crest Watermark',
    viewBox: '0 0 100 100',
    svgPath: `
      <g stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 5 L15 15 L15 45 C15 70 50 95 50 95 C50 95 85 70 85 45 L85 15 Z" />
        <path d="M50 20 L65 32 L50 44 L35 32 Z" />
        <path d="M35 55 H65" />
        <path d="M35 62 H65" />
        <path d="M50 44 V80" />
        <circle cx="50" cy="50" r="28" stroke-dasharray="1 3" />
      </g>
    `
  },
  {
    id: 'wm-compass',
    name: 'Compass Rose Watermark',
    viewBox: '0 0 100 100',
    svgPath: `
      <g stroke="currentColor" stroke-width="1.2" fill="none">
        <circle cx="50" cy="50" r="45" />
        <circle cx="50" cy="50" r="42" stroke-dasharray="2 2" />
        <!-- Points of compass -->
        <polygon points="50,5 53,47 50,50" fill="currentColor" fill-opacity="0.2" stroke="currentColor" />
        <polygon points="50,5 47,47 50,50" stroke="currentColor" />
        <polygon points="50,95 47,53 50,50" fill="currentColor" fill-opacity="0.2" stroke="currentColor" />
        <polygon points="50,95 53,53 50,50" stroke="currentColor" />
        
        <polygon points="95,50 53,47 50,50" fill="currentColor" fill-opacity="0.2" stroke="currentColor" />
        <polygon points="95,50 53,53 50,50" stroke="currentColor" />
        <polygon points="5,50 47,53 50,50" fill="currentColor" fill-opacity="0.2" stroke="currentColor" />
        <polygon points="5,50 47,47 50,50" stroke="currentColor" />
        
        <!-- Diagonal points -->
        <polygon points="81.8,18.2 50.5,47.5 50,50" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="0.8" />
        <polygon points="18.2,81.8 49.5,52.5 50,50" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="0.8" />
        <polygon points="81.8,81.8 52.5,50.5 50,50" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="0.8" />
        <polygon points="18.2,18.2 47.5,49.5 50,50" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="0.8" />
      </g>
    `
  },
  {
    id: 'wm-grid',
    name: 'Fine Grid Watermark',
    viewBox: '0 0 100 100',
    svgPath: `
      <g stroke="currentColor" stroke-width="0.5" stroke-dasharray="2 4" stroke-opacity="0.5">
        <line x1="10" y1="0" x2="10" y2="100" />
        <line x1="20" y1="0" x2="20" y2="100" />
        <line x1="30" y1="0" x2="30" y2="100" />
        <line x1="40" y1="0" x2="40" y2="100" />
        <line x1="50" y1="0" x2="50" y2="100" stroke-width="1.2" />
        <line x1="60" y1="0" x2="60" y2="100" />
        <line x1="70" y1="0" x2="70" y2="100" />
        <line x1="80" y1="0" x2="80" y2="100" />
        <line x1="90" y1="0" x2="90" y2="100" />
        
        <line x1="0" y1="10" x2="100" y2="10" />
        <line x1="0" y1="20" x2="100" y2="20" />
        <line x1="0" y1="30" x2="100" y2="30" />
        <line x1="0" y1="40" x2="100" y2="40" />
        <line x1="0" y1="50" x2="100" y2="50" stroke-width="1.2" />
        <line x1="0" y1="60" x2="100" y2="60" />
        <line x1="0" y1="70" x2="100" y2="70" />
        <line x1="0" y1="80" x2="100" y2="80" />
        <line x1="0" y1="90" x2="100" y2="90" />
      </g>
    `
  },
  {
    id: 'preset-khulna',
    name: 'Khulna Univ Stag Crest',
    viewBox: '0 0 100 115',
    svgPath: LOGO_PRESETS[0].svgPath
  },
  {
    id: 'preset-du',
    name: 'Dhaka Univ Curzon Crest',
    viewBox: '0 0 100 100',
    svgPath: LOGO_PRESETS[2].svgPath
  },
  {
    id: 'preset-academic',
    name: 'Classic University Seal',
    viewBox: '0 0 100 100',
    svgPath: LOGO_PRESETS[1].svgPath
  },
  {
    id: 'preset-ruet',
    name: 'RUET Engineering Cog',
    viewBox: '0 0 100 105',
    svgPath: LOGO_PRESETS[5].svgPath
  },
  {
    id: 'preset-presidency',
    name: 'Presidency Univ Shield',
    viewBox: '0 0 100 115',
    svgPath: LOGO_PRESETS[6].svgPath
  }
];
