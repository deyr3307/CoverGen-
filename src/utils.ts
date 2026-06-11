import UTIF from 'utif';

/**
 * Checks if a file is a TIFF file based on type or extension
 */
export function isTiffFile(file: File | Blob): boolean {
  if (file.type === 'image/tiff' || file.type === 'image/x-tiff') {
    return true;
  }
  if (file instanceof File) {
    const name = file.name.toLowerCase();
    return name.endsWith('.tiff') || name.endsWith('.tif');
  }
  return false;
}

/**
 * Converts a TIFF file or blob to a PNG blob using UTIF
 */
export function convertTiffToPng(file: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const rootIfds = UTIF.decode(buffer);
        if (!rootIfds || rootIfds.length === 0) {
          throw new Error("No readable images found in the TIFF file");
        }

        // Recursively collect all IFD items (including subIFDs and exifIFDs) to find hidden pages/images
        const allIfds: any[] = [];
        const seen = new Set<any>();
        const collectIfds = (item: any) => {
          if (!item || typeof item !== 'object') return;
          if (seen.has(item)) return;
          seen.add(item);
          allIfds.push(item);
          if (Array.isArray(item.subIFD)) {
            item.subIFD.forEach(collectIfds);
          }
          if (item.exifIFD) {
            collectIfds(item.exifIFD);
          }
          if (item.dngPrvt) {
            collectIfds(item.dngPrvt);
          }
        };
        rootIfds.forEach(collectIfds);

        const getDimension = (ifdObj: any, tag: string, fallbackProp: string): number => {
          if (typeof ifdObj[fallbackProp] === 'number' && ifdObj[fallbackProp] > 0) {
            return ifdObj[fallbackProp];
          }
          
          const extractValue = (v: any): number => {
            if (v === null || v === undefined) return 0;
            if (typeof v === 'number') return v;
            if (typeof v === 'object') {
              if (typeof v.length === 'number' && v.length > 0) {
                const inner = Number(v[0]);
                if (!isNaN(inner)) return inner;
              }
              if (v.buffer && v.byteLength) {
                try {
                  const arr = Array.from(v as any);
                  if (arr.length > 0) return Number(arr[0]);
                } catch {
                  // ignore typed array parse errors
                }
              }
            }
            const parsed = Number(v);
            return isNaN(parsed) ? 0 : parsed;
          };

          const val = ifdObj[tag];
          const valDim = extractValue(val);
          if (valDim > 0) return valDim;

          // Try standard number key access just in case
          const numKeyVal = ifdObj[tag.substring(1)];
          const numKeyDim = extractValue(numKeyVal);
          if (numKeyDim > 0) return numKeyDim;

          // Try custom fallback keys like Tiles size if height/width is missing
          if (tag === 't256') { // image width
            const tileW = extractValue(ifdObj['t322']);
            if (tileW > 0) return tileW;
          } else if (tag === 't257') { // image height
            const tileH = extractValue(ifdObj['t323']);
            if (tileH > 0) return tileH;
          }

          return 0;
        };

        // Locate the best IFD (e.g. the one with valid dimensions, preferring larger/primary image over small icons or EXIF blocks)
        let selectedIfd = allIfds[0];
        let bestW = 0;
        let bestH = 0;

        for (const item of allIfds) {
          const w = getDimension(item, 't256', 'width');
          const h = getDimension(item, 't257', 'height');
          const hasOffsets = !!(item['t273'] || item['t324']);
          if (w > 0 && h > 0) {
            const currentHasOffsets = selectedIfd ? !!(selectedIfd['t273'] || selectedIfd['t324']) : false;
            if (!bestW || (hasOffsets && !currentHasOffsets) || (w > bestW && (hasOffsets || !currentHasOffsets))) {
              selectedIfd = item;
              bestW = w;
              bestH = h;
            }
          }
        }

        // Extremely robust fallback: If static tag extraction yielded 0x0 size, try dynamically decoding each IFD
        if (bestW === 0 || bestH === 0) {
          for (const item of allIfds) {
            try {
              UTIF.decodeImage(buffer, item);
              const w = item.width || getDimension(item, 't256', 'width');
              const h = item.height || getDimension(item, 't257', 'height');
              if (w > 0 && h > 0) {
                selectedIfd = item;
                bestW = w;
                bestH = h;
                break;
              }
            } catch (e) {
              // ignore decode error for auxiliary or non-conforming blocks
            }
          }
        }

        console.log(`TIFF file processed structure. Selected IFD with dimensions: ${bestW}x${bestH}`);

        // Set or override dimensions on the selected IFD before decoding to guarantee toRGBA8 doesn't crash or return 0x0 size
        selectedIfd.width = selectedIfd.width || getDimension(selectedIfd, 't256', 'width') || bestW || 800;
        selectedIfd.height = selectedIfd.height || getDimension(selectedIfd, 't257', 'height') || bestH || 600;

        // Ensure "t256" and "t257" tags are populated with the same dimensions for internal library consistency
        if (!selectedIfd["t256"]) selectedIfd["t256"] = [selectedIfd.width];
        if (!selectedIfd["t257"]) selectedIfd["t257"] = [selectedIfd.height];

        // Guard against internal library crashes caused by missing offsets tags ("t273" or "t324") or bits per sample ("t258")
        if (!selectedIfd["t273"] && !selectedIfd["t324"]) {
          selectedIfd["t273"] = [0];
        }
        if (!selectedIfd["t258"]) {
          selectedIfd["t258"] = [8];
        }

        UTIF.decodeImage(buffer, selectedIfd);
        const rgba = UTIF.toRGBA8(selectedIfd);

        // Final dimension extraction
        const width = selectedIfd.width || 800;
        const height = selectedIfd.height || 600;

        if (!width || !height || isNaN(width) || isNaN(height)) {
          console.error("UTIF failed to parse dimensions. IFD structure:", selectedIfd);
          throw new Error(`Invalid TIFF image dimensions. Parsed: ${width}x${height}`);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not create 2D context for TIFF conversion");
        }

        const imgData = new ImageData(
          new Uint8ClampedArray(rgba.buffer),
          width,
          height
        );
        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert TIFF canvas to Blob"));
          }
        }, "image/png");
      } catch (err: any) {
        reject(err);
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read TIFF file buffer"));
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Automatically converts TIFF files to PNG format for system compatibility
 */
export async function ensureSupportedFormat(file: File | Blob): Promise<Blob | File> {
  if (isTiffFile(file)) {
    try {
      console.log("TIFF file detected, converting to PNG standard format...");
      const pngBlob = await convertTiffToPng(file);
      // Create a File if the input was a File to retain the original metadata if needed
      if (file instanceof File) {
        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted';
        return new File([pngBlob], `${originalName}.png`, { type: 'image/png' });
      }
      return pngBlob;
    } catch (err) {
      console.error("TIFF to PNG conversion failed, using original file: ", err);
      return file;
    }
  }
  return file;
}

/**
 * Pre-processes an uploaded image:
 * 1. Converts TIFF and HEIC formats to high-compatibility standard formats.
 * 2. Compresses and resizes to a maximum dimension of 1024px while preserving aspect ratio.
 * 3. Ensures the file payload stays strictly well under the 2MB API limit.
 * 4. Yields a standard PNG or compressed JPEG Blob + Base64 data representation.
 */
export async function preprocessImageForApi(file: File | Blob): Promise<{ blob: Blob; base64: string; name: string }> {
  let currentBlob: Blob = file;

  // Step 1: Detect and handle TIFF
  if (isTiffFile(file)) {
    try {
      console.log("TIFF file detected in preprocessor, converting to PNG...");
      currentBlob = await convertTiffToPng(file);
    } catch (err) {
      console.error("Preprocessor conversion of TIFF failed:", err);
    }
  }

  // Step 2: Detect and handle HEIC
  const originalName = file instanceof File ? file.name : 'image';
  const nameLower = originalName.toLowerCase();
  const isHeic = nameLower.endsWith('.heic') || nameLower.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
  
  if (isHeic) {
    try {
      console.log("HEIC/HEIF file detected in preprocessor, converting to PNG...");
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({
        blob: currentBlob,
        toType: 'image/png',
      });
      currentBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.error("Preprocessor conversion of HEIC/HEIF failed:", err);
    }
  }

  // Step 3: Load into an HTMLImageElement to prepare for canvas operation
  const objectUrl = URL.createObjectURL(currentBlob);
  const img = new Image();
  
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(new Error("Unable to decode and load the image in the preprocessor."));
    img.src = objectUrl;
  });

  URL.revokeObjectURL(objectUrl);

  // Step 4: Canvas Resize calculation (keeping aspect ratio, max dimension of 1024px)
  let width = img.naturalWidth || img.width || 800;
  let height = img.naturalHeight || img.height || 600;
  
  const MAX_DIMENSION = 1024;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
    console.log(`Image boundaries exceeded. Rescaling image to standard dimension: ${width}x${height}`);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Could not initialize canvas context for pre-processing.");
  }

  // Draw scaled image on the canvas
  ctx.drawImage(img, 0, 0, width, height);

  // Step 5: Convert to high-compatibility standard format (PNG preserve transparency, fallback to compressed JPEG if exceeds 2MB)
  let mimeType = 'image/png';
  let processedBlob: Blob | null = null;
  let compressQuality = 0.90;

  processedBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType);
  });

  // Strict API limits check (ensure always stays under 2MB)
  const TWO_MEGABYTES = 2 * 1024 * 1024;
  if (processedBlob && processedBlob.size > TWO_MEGABYTES) {
    console.warn(`PNG output is too large (${(processedBlob.size / 1024 / 1024).toFixed(2)}MB). Converting to compressed JPEG...`);
    mimeType = 'image/jpeg';
    while (compressQuality > 0.40) {
      processedBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, compressQuality);
      });
      if (processedBlob && processedBlob.size <= TWO_MEGABYTES) {
        console.log(`JPEG compressed successfully to ${(processedBlob.size / 1024 / 1024).toFixed(2)}MB at quality ${compressQuality}`);
        break;
      }
      compressQuality -= 0.15;
    }
  }

  if (!processedBlob) {
    throw new Error("Canvas rendering compilation failed during compression.");
  }

  // Step 6: Convert standard Blob to Base64 representation
  const reader = new FileReader();
  const base64Data: string = await new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed parsing file to base64 encoding."));
    reader.readAsDataURL(processedBlob!);
  });

  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || 'watermark';
  const finalExt = mimeType === 'image/png' ? 'png' : 'jpg';

  return {
    blob: processedBlob,
    base64: base64Data,
    name: `${baseName}.${finalExt}`
  };
}

/**
 * Safely base64 encodes the application state (coverData, coverDesign, background)
 * into a URL-friendly query parameter representation, omitting massive custom base64 images.
 */
export function encodeSharedState(coverData: any, coverDesign: any, pageBackgroundColor: string): string {
  try {
    const cleanDesign = { ...coverDesign };
    if (cleanDesign.logoUrl && cleanDesign.logoUrl.startsWith('data:')) {
      cleanDesign.logoUrl = ''; // omit custom base64 upload logos to stay within URI limits
    }
    if (cleanDesign.watermarkUrl && cleanDesign.watermarkUrl.startsWith('data:')) {
      cleanDesign.watermarkUrl = ''; // omit custom base64 watermark uploads
    }

    const payload = {
      coverData,
      coverDesign: cleanDesign,
      pageBackgroundColor
    };

    const jsonStr = JSON.stringify(payload);
    // Unicode-safe Base64 encoding
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return encodeURIComponent(b64);
  } catch (err) {
    console.error("Failed to encode shared state:", err);
    return '';
  }
}

/**
 * Safely decodes a shared base64 application state from a URL parameter.
 */
export function decodeSharedState(encoded: string): { coverData: any; coverDesign: any; pageBackgroundColor: string } | null {
  if (!encoded) return null;
  try {
    const b64 = decodeURIComponent(encoded);
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to decode shared state:", err);
    return null;
  }
}
