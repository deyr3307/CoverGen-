import { Jimp } from 'jimp';

async function main() {
  console.log('Generating high-fidelity 512x512 CoverGen app icon...');
  
  // Create a base 512x512 image in deep slate
  const image = new Jimp({ width: 512, height: 512, color: 0x07090eff });
  
  // Draw an ultra-aesthetic background gradient, blueprint grids, and professional floating book covers
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const rx = x - 256;
      const ry = y - 256;
      const dist = Math.sqrt(rx * rx + ry * ry);
      
      // Base radial dark slate to deep charcoal gradient
      let r = 7 + Math.floor(15 * (1 - dist / 360));
      let g = 9 + Math.floor(20 * (1 - dist / 360));
      let b = 14 + Math.floor(35 * (1 - dist / 360));
      r = Math.max(5, Math.min(255, r));
      g = Math.max(7, Math.min(255, g));
      b = Math.max(10, Math.min(255, b));
      
      let pixelColor = (r << 24) | (g << 16) | (b << 8) | 0xff;
      
      // Draw subtle secondary blueprints grids (every 32px)
      if (x % 32 === 0 || y % 32 === 0) {
        const gridOpacity = (x % 160 === 0 || y % 160 === 0) ? 0.08 : 0.035;
        const gr = Math.floor(99 * gridOpacity);
        const gg = Math.floor(102 * gridOpacity);
        const gb = Math.floor(241 * gridOpacity);
        
        const currentR = (pixelColor >> 24) & 0xff;
        const currentG = (pixelColor >> 16) & 0xff;
        const currentB = (pixelColor >> 8) & 0xff;
        
        pixelColor = ((currentR + gr) << 24) | ((currentG + gg) << 16) | ((currentB + gb) << 8) | 0xff;
      }
      
      // Draw 2 dynamic stacked premium book/document covers in the center to symbolize "CoverGen"
      // Cover 1 (Bottom, tilted slightly left / back)
      // Represented by a rotated rectangular bounding box
      // Math for a rect tilted at ~15 degrees:
      // rotated coordinates:
      const angle1 = -12 * Math.PI / 180;
      const cos1 = Math.cos(angle1);
      const sin1 = Math.sin(angle1);
      const rotX1 = (rx + 25) * cos1 - (ry + 10) * sin1;
      const rotY1 = (rx + 25) * sin1 + (ry + 10) * cos1;
      
      // Check if inside Cover 1 (width = 120, height = 180, centered around translated center)
      const inCover1 = (rotX1 >= -60 && rotX1 <= 60 && rotY1 >= -90 && rotY1 <= 90);
      const onBorder1 = inCover1 && (rotX1 <= -57 || rotX1 >= 57 || rotY1 <= -87 || rotY1 >= 87);
      
      // Cover 2 (Top, floating, tilted slightly right / front)
      const angle2 = 8 * Math.PI / 180;
      const cos2 = Math.cos(angle2);
      const sin2 = Math.sin(angle2);
      const rotX2 = (rx - 25) * cos2 - (ry - 20) * sin2;
      const rotY2 = (rx - 25) * sin2 + (ry - 20) * cos2;
      
      const inCover2 = (rotX2 >= -65 && rotX2 <= 65 && rotY2 >= -95 && rotY2 <= 95);
      const onBorder2 = inCover2 && (rotX2 <= -62 || rotX2 >= 62 || rotY2 <= -92 || rotY2 >= 92);
      const onSpine2 = inCover2 && (rotX2 >= -58 && rotX2 <= -50); // book spine line
      
      if (onBorder2) {
        // Glowing cyan-blue front border
        pixelColor = 0x22d3eeff;
      } else if (onSpine2) {
        // Spine design line on front cover
        pixelColor = 0x818cf8ff;
      } else if (inCover2) {
        // Sleek primary indigo base front cover
        const rotDist = Math.sqrt(rotX2 * rotX2 + rotY2 * rotY2);
        const rVal = Math.max(30, Math.min(80, 49 + Math.floor(rotDist / 4)));
        const gVal = Math.max(35, Math.min(85, 46 + Math.floor(rotDist / 5)));
        const bVal = Math.max(100, Math.min(180, 129 + Math.floor(rotDist / 2)));
        pixelColor = (rVal << 24) | (gVal << 16) | (bVal << 8) | 0xff;
      } else if (onBorder1) {
        // Glowing violet back border
        pixelColor = 0x8b5cf6ff;
      } else if (inCover1) {
        // Purple-violet gradient back cover
        const rotDist = Math.sqrt(rotX1 * rotX1 + rotY1 * rotY1);
        const rVal = Math.max(40, Math.min(90, 67 + Math.floor(rotDist / 5)));
        const gVal = Math.max(25, Math.min(65, 30 + Math.floor(rotDist / 6)));
        const bVal = Math.max(110, Math.min(190, 149 + Math.floor(rotDist / 3)));
        pixelColor = (rVal << 24) | (gVal << 16) | (bVal << 8) | 0xff;
      }
      
      // Let's draw some fine engineering details (glowing connection vertices or nodes)
      // Corner crossings of the 160px grid
      if ((Math.abs(x - 176) < 3.5 && Math.abs(y - 176) < 3.5) || 
          (Math.abs(x - 336) < 3.5 && Math.abs(y - 336) < 3.5) ||
          (Math.abs(x - 176) < 3.5 && Math.abs(y - 336) < 3.5) ||
          (Math.abs(x - 336) < 3.5 && Math.abs(y - 176) < 3.5)) {
        // Bright glowing node pixels
        pixelColor = 0x22d3eeff;
      }

      // Dynamic central crosshairs
      if ((Math.abs(rx) < 1 && Math.abs(ry) < 10) || (Math.abs(ry) < 1 && Math.abs(rx) < 10)) {
        if (pixelColor === 0x07090eff || (pixelColor & 0xffffff00) === 0) {
          pixelColor = 0x6366f1ee;
        }
      }

      image.setPixelColor(pixelColor, x, y);
    }
  }

  // Save the beautiful generated image as a high-quality JPG at src/app-icon.jpg
  await image.write('src/app-icon.jpg');
  console.log('App icon at "src/app-icon.jpg" generated successfully!');
}

main().catch((err) => {
  console.error('Error in generating icon:', err);
  process.exit(1);
});
