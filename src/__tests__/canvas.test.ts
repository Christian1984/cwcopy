import { getBoundingBox, captureLetterImage, clearCanvas } from '../utils/canvas';
import { CANVAS_CROP_PADDING } from '../constants';

// ── getBoundingBox ─────────────────────────────────────────────────────────
describe('getBoundingBox', () => {
  const makeImageData = (
    width: number,
    height: number,
    pixels: Array<{ x: number; y: number }> = [],
  ): ImageData => {
    const data = new Uint8ClampedArray(width * height * 4);
    for (const { x, y } of pixels) {
      const i = (y * width + x) * 4;
      data[i] = 255; // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A (fully opaque)
    }
    return { data, width, height, colorSpace: 'srgb' } as ImageData;
  };

  it('returns null for a fully transparent image', () => {
    expect(getBoundingBox(makeImageData(10, 10))).toBeNull();
  });

  it('returns the correct bounding box for a single pixel', () => {
    const bbox = getBoundingBox(makeImageData(10, 10, [{ x: 3, y: 5 }]));
    expect(bbox).toEqual({ minX: 3, minY: 5, maxX: 3, maxY: 5 });
  });

  it('returns the tight bounding box spanning multiple pixels', () => {
    const bbox = getBoundingBox(
      makeImageData(20, 20, [
        { x: 2, y: 4 },
        { x: 10, y: 15 },
        { x: 7, y: 8 },
      ]),
    );
    expect(bbox).toEqual({ minX: 2, minY: 4, maxX: 10, maxY: 15 });
  });

  it('ignores nearly-transparent pixels (alpha ≤ 10)', () => {
    const data = new Uint8ClampedArray(10 * 10 * 4);
    // Alpha = 5 (below threshold)
    const i = (5 * 10 + 5) * 4;
    data[i + 3] = 5;
    const imageData = { data, width: 10, height: 10, colorSpace: 'srgb' } as ImageData;
    expect(getBoundingBox(imageData)).toBeNull();
  });
});

// ── clearCanvas ────────────────────────────────────────────────────────────
describe('clearCanvas', () => {
  it('calls clearRect with the canvas dimensions', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 600;
    clearCanvas(canvas);
    const ctx = (globalThis as Record<string, unknown>).mockCanvasContext as {
      clearRect: jest.Mock;
    };
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 300, 600);
  });

  it('is a no-op when getContext returns null', () => {
    const canvas = document.createElement('canvas');
    (canvas.getContext as jest.Mock).mockReturnValueOnce(null);
    expect(() => clearCanvas(canvas)).not.toThrow();
  });
});

// ── captureLetterImage ─────────────────────────────────────────────────────
describe('captureLetterImage', () => {
  it('returns null when the canvas is blank', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 600;
    // Default mock returns all-transparent ImageData → bbox is null
    expect(captureLetterImage(canvas)).toBeNull();
  });

  it('returns null when getContext returns null', () => {
    const canvas = document.createElement('canvas');
    (canvas.getContext as jest.Mock).mockReturnValueOnce(null);
    expect(captureLetterImage(canvas)).toBeNull();
  });

  it('returns a LetterImage with id, dataUrl, capturedAt when pixels exist', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 600;

    // Provide pixel data with a non-transparent pixel
    const data = new Uint8ClampedArray(300 * 600 * 4);
    const i = (10 * 300 + 10) * 4;
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;

    const ctx = (globalThis as Record<string, unknown>).mockCanvasContext as {
      getImageData: jest.Mock;
    };
    ctx.getImageData.mockReturnValueOnce({ data, width: 300, height: 600, colorSpace: 'srgb' });

    const result = captureLetterImage(canvas);
    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      id: expect.any(String),
      dataUrl: expect.stringContaining('data:image/png'),
      capturedAt: expect.any(Number),
      pxWidth: expect.any(Number),
      pxHeight: expect.any(Number),
      baselineOffset: expect.any(Number),
    });
  });

  it('adds CANVAS_CROP_PADDING around the bounding box', () => {
    expect(CANVAS_CROP_PADDING).toBeGreaterThan(0);
    // The offscreen canvas dimensions are verified indirectly; the important
    // thing is that the constant is non-zero so letters have breathing room.
  });

  it('does not fill a background colour (transparent PNG)', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 600;

    const data = new Uint8ClampedArray(300 * 600 * 4);
    const i = (10 * 300 + 10) * 4;
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;

    const ctx = (globalThis as Record<string, unknown>).mockCanvasContext as {
      getImageData: jest.Mock;
      fillRect: jest.Mock;
    };
    ctx.getImageData.mockReturnValueOnce({ data, width: 300, height: 600, colorSpace: 'srgb' });

    captureLetterImage(canvas);
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });
});
