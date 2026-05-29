import { Jimp } from 'jimp';
import fs from 'fs';

// Helper function to calculate perpendicular distance to a line segment
function getDistanceToSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

async function main() {
  console.log('Generating high-fidelity 512x512 CoverGen app icon (custom orange graduation cap)...');
  
  // Dimensions 512x512
  const width = 512;
  const height = 512;
  const image = new Jimp({ width, height, color: 0x000000ff }); // Black Background
  
  // Rhombus vertices
  const rx1 = 256, ry1 = 125; // Top
  const rx2 = 425, ry2 = 195; // Right
  const rx3 = 256, ry3 = 265; // Bottom
  const rx4 = 87, ry4 = 195;  // Left

  // Tassel tip segment
  const tx1 = 410, ty1 = 310;
  const tx2 = 410, ty2 = 335;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let samplesInside = 0;
      
      // Perform 3x3 multi-sampling anti-aliasing (9 sub-pixel samples per pixel)
      const subpixelOffsets = [0.2, 0.5, 0.8];
      for (const ox of subpixelOffsets) {
        for (const oy of subpixelOffsets) {
          const sx = x + ox;
          const sy = y + oy;
          let isInside = false;

          // 1. Check rhombus border (solid line thickness = 20px, so distance <= 10px)
          const dRhombus = Math.min(
            getDistanceToSegment(sx, sy, rx1, ry1, rx2, ry2),
            getDistanceToSegment(sx, sy, rx2, ry2, rx3, ry3),
            getDistanceToSegment(sx, sy, rx3, ry3, rx4, ry4),
            getDistanceToSegment(sx, sy, rx4, ry4, rx1, ry1)
          );
          if (dRhombus <= 11) {
            isInside = true;
          }

          // 2. Check center cap button
          const dButton = Math.sqrt((sx - 256) * (sx - 256) + (sy - 195) * (sy - 195));
          if (dButton <= 16) {
            isInside = true;
          }

          // 3. Check cap band (bowl underneath the board)
          // X spans the width of the band
          if (sx >= 145 && sx <= 367) {
            const t = (sx - 145) / 222;
            const y_inner = (1 - t) * (1 - t) * 230 + 2 * (1 - t) * t * 335 + t * t * 230;
            const y_outer = (1 - t) * (1 - t) * 230 + 2 * (1 - t) * t * 415 + t * t * 230;
            
            if (sy >= y_inner && sy <= y_outer) {
              isInside = true;
            }
          }

          // 4. Check tassel thread segments (thickness = 8px, distance <= 4px)
          const dTassel1 = getDistanceToSegment(sx, sy, 256, 195, 410, 215);
          const dTassel2 = getDistanceToSegment(sx, sy, 410, 215, 410, 310);
          if (dTassel1 <= 4.5 || dTassel2 <= 4.5) {
            isInside = true;
          }

          // 5. Check tassel pendant at the end (thickness = 16px, distance <= 8px)
          const dTasselTip = getDistanceToSegment(sx, sy, tx1, ty1, tx2, ty2);
          if (dTasselTip <= 8.5) {
            isInside = true;
          }

          if (isInside) {
            samplesInside++;
          }
        }
      }

      // Compute anti-aliased gradient blending over black
      const alpha = samplesInside / 9.0;
      
      // Gorgeous, high-fidelity orange color hex: RGB(255, 132, 0)
      const r = Math.round(255 * alpha);
      const g = Math.round(132 * alpha);
      const b = 0;
      
      const pixelColor = ((r * 0x1000000) + (g << 16) + (b << 8) + 0xff) >>> 0;
      image.setPixelColor(pixelColor, x, y);
    }
  }

  // Save the image in all target formats
  await image.write('src/app-icon.jpg');
  console.log('App icon at "src/app-icon.jpg" generated successfully!');

  // Also write to public/ folder for static Vite crawler/Vercel support
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  
  await image.write('public/app-icon.jpg');
  await image.write('public/app-icon.png'); // write png version
  
  // Copy to favicon.ico using safe method
  fs.copyFileSync('public/app-icon.jpg', 'public/favicon.ico');
  
  console.log('Static fallback public assets successfully copied with graduation cap visual.');
}

main().catch((err) => {
  console.error('Error in generating icon:', err);
  process.exit(1);
});
