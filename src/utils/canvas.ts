import { CANVAS_CROP_PADDING } from '../constants';
import type { LetterImage } from '../state/types';

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Scans ImageData for non-transparent pixels and returns the tight bounding
 * box, or null if the canvas is blank.
 *
 * Exported separately so it can be unit-tested without a real canvas.
 */
export function getBoundingBox(imageData: ImageData): BoundingBox | null {
  const { width, height, data } = imageData;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === -1) return null;
  return { minX, minY, maxX, maxY };
}

/**
 * Captures the drawn strokes from the canvas, crops to the bounding box
 * (plus padding), and returns a LetterImage with a transparent background.
 *
 * The canvas uses a transparent background (CSS supplies the visible colour),
 * so the captured PNG preserves that transparency. The results page background
 * provides contrast — no solid fill needed here.
 *
 * Returns null if the canvas is blank (nothing drawn).
 */
export function captureLetterImage(canvas: HTMLCanvasElement): LetterImage | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const bbox = getBoundingBox(imageData);
  if (!bbox) return null;

  const cropW = bbox.maxX - bbox.minX + 1 + CANVAS_CROP_PADDING * 2;
  const cropH = bbox.maxY - bbox.minY + 1 + CANVAS_CROP_PADDING * 2;

  const offscreen = document.createElement('canvas');
  offscreen.width = cropW;
  offscreen.height = cropH;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return null;

  // No background fill — transparent PNG, page background provides contrast.
  offCtx.drawImage(
    canvas,
    bbox.minX,
    bbox.minY,
    bbox.maxX - bbox.minX + 1,
    bbox.maxY - bbox.minY + 1,
    CANVAS_CROP_PADDING,
    CANVAS_CROP_PADDING,
    bbox.maxX - bbox.minX + 1,
    bbox.maxY - bbox.minY + 1,
  );

  return {
    id: crypto.randomUUID(),
    dataUrl: offscreen.toDataURL('image/png'),
    capturedAt: Date.now(),
  };
}

/** Clears the canvas to fully transparent. */
export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
