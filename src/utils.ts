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
        const ifds = UTIF.decode(buffer);
        if (!ifds || ifds.length === 0) {
          throw new Error("No readable images found in the TIFF file");
        }

        const getDimension = (ifdObj: any, tag: string, fallbackProp: string): number => {
          if (typeof ifdObj[fallbackProp] === 'number' && ifdObj[fallbackProp] > 0) {
            return ifdObj[fallbackProp];
          }
          const val = ifdObj[tag];
          if (Array.isArray(val) && val.length > 0) {
            return Number(val[0]);
          }
          if (typeof val === 'number') {
            return val;
          }
          // Try standard number key access just in case
          const numKeyVal = ifdObj[tag.substring(1)];
          if (Array.isArray(numKeyVal) && numKeyVal.length > 0) {
            return Number(numKeyVal[0]);
          }
          if (typeof numKeyVal === 'number') {
            return numKeyVal;
          }
          return 0;
        };

        // Locate the best IFD (e.g. the one with valid dimensions, preferring larger/primary image over small icons or EXIF blocks)
        let selectedIfd = ifds[0];
        let bestW = 0;
        let bestH = 0;

        for (const item of ifds) {
          const w = getDimension(item, 't256', 'width');
          const h = getDimension(item, 't257', 'height');
          if (w > 0 && h > 0) {
            if (w > bestW) {
              selectedIfd = item;
              bestW = w;
              bestH = h;
            }
          }
        }

        console.log(`TIFF file processed structure. Selected IFD with dimensions: ${bestW}x${bestH}`);

        UTIF.decodeImage(buffer, selectedIfd);
        const rgba = UTIF.toRGBA8(selectedIfd);

        // Re-calculate or fallback to retrieved dimensions after decoding
        const width = selectedIfd.width || getDimension(selectedIfd, 't256', 'width') || bestW;
        const height = selectedIfd.height || getDimension(selectedIfd, 't257', 'height') || bestH;

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
