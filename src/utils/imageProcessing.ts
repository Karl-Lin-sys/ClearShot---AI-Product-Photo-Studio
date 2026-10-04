/**
 * Client-side canvas tools for instant preview, background removal,
 * contact shadow generation, and high-resolution export.
 */

export interface ExportOptions {
  width: number;
  height: number;
  format: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
  backgroundColor?: string | null; // null for transparent
  addContactShadow?: boolean;
  shadowBlur?: number;
  shadowOpacity?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

// Loads an HTMLImageElement safely from a data URL or path
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image: " + e));
    img.src = src;
  });
}

/**
 * Intelligent Client-Side Background Removal & Subject Isolation.
 * Analyzes perimeter corners, samples background hues, computes delta-E / Euclidean distance,
 * generates an alpha matte with soft feathering and preserves the interior product.
 */
export async function clientSmartCutout(
  imageSrc: string,
  tolerance: number = 32,
  featherRadius: number = 2
): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width || 800;
  canvas.height = img.naturalHeight || img.height || 800;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not create 2D canvas context");

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Sample corner pixel colors (Top-left, Top-right, Bottom-left, Bottom-right, Top-mid)
  const samplePoints = [
    [4, 4],
    [width - 5, 4],
    [4, height - 5],
    [width - 5, height - 5],
    [Math.floor(width / 2), 4],
    [4, Math.floor(height / 2)],
    [width - 5, Math.floor(height / 2)],
  ];

  const bgColors: [number, number, number][] = [];
  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * 4;
    bgColors.push([data[idx], data[idx + 1], data[idx + 2]]);
  }

  // Calculate distance from any background color
  function colorDist(r: number, g: number, b: number, [br, bg, bb]: [number, number, number]) {
    const dr = r - br;
    const dg = g - bg;
    const db = b - bb;
    return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
  }

  // Create alpha mask
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let minDist = 999;
    for (const bg of bgColors) {
      const d = colorDist(r, g, b, bg);
      if (d < minDist) minDist = d;
    }

    if (minDist < tolerance) {
      data[i + 3] = 0; // Transparent
    } else if (minDist < tolerance + 15) {
      // Soft feather transition
      const factor = (minDist - tolerance) / 15;
      data[i + 3] = Math.round(data[i + 3] * factor);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Composite an image with custom background, contact shadow, and color adjustments
 */
export async function renderCompositedProduct(
  imageSrc: string,
  options: ExportOptions
): Promise<string> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  // Fill background
  if (options.backgroundColor) {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Calculate scaled aspect-fit dimensions for the product
  const srcAspect = img.width / img.height;
  const dstAspect = canvas.width / canvas.height;

  // Let's use 85% fill for e-commerce standards
  const paddingRatio = 0.85;
  let drawW: number;
  let drawH: number;

  if (srcAspect > dstAspect) {
    drawW = canvas.width * paddingRatio;
    drawH = drawW / srcAspect;
  } else {
    drawH = canvas.height * paddingRatio;
    drawW = drawH * srcAspect;
  }

  const drawX = (canvas.width - drawW) / 2;
  const drawY = (canvas.height - drawH) / 2;

  // Add realistic ground contact shadow if enabled
  if (options.addContactShadow && options.backgroundColor) {
    const shadowY = drawY + drawH - 10;
    const shadowRx = drawW * 0.42;
    const shadowRy = Math.max(12, drawH * 0.05);

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, shadowY, shadowRx, shadowRy, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(15, 23, 42, ${options.shadowOpacity ?? 0.35})`;
    ctx.filter = `blur(${options.shadowBlur ?? 20}px)`;
    ctx.fill();
    ctx.restore();
  }

  // Apply visual adjustments
  const b = options.brightness ?? 100;
  const c = options.contrast ?? 100;
  const s = options.saturation ?? 100;
  ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;

  // Draw product
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  return canvas.toDataURL(options.format, options.quality ?? 0.95);
}

/**
 * Downloads a data URL as a file in the browser
 */
export function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies an image data URL to the user's clipboard as PNG
 */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    // ClipboardItem usually requires image/png
    if (blob.type !== "image/png") {
      const img = await loadImage(dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (pngBlob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
        return true;
      }
    } else {
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      return true;
    }
  } catch (err) {
    console.warn("Failed to copy image to clipboard:", err);
    return false;
  }
  return false;
}
