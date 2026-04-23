import '@testing-library/jest-dom';

// ── Canvas mock ──────────────────────────────────────────────────────────────
// jsdom does not implement the Canvas 2D API. We provide a minimal mock so
// components that call getContext('2d') don't throw.

export const mockCanvasContext = {
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  drawImage: jest.fn(),
  scale: jest.fn(),
  getImageData: jest.fn(() => ({
    // 300×600 all-transparent pixels by default (nothing drawn)
    data: new Uint8ClampedArray(300 * 600 * 4),
    width: 300,
    height: 600,
    colorSpace: 'srgb',
  })),
  fillStyle: '#000000',
  strokeStyle: '#ffffff',
  lineWidth: 3,
  lineCap: 'round',
  lineJoin: 'round',
};

HTMLCanvasElement.prototype.getContext = jest.fn(
  () => mockCanvasContext as unknown as CanvasRenderingContext2D,
);
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mockdata==');

// Make mock accessible to individual tests that need to inspect or override it
(global as Record<string, unknown>).mockCanvasContext = mockCanvasContext;

// ── Pointer capture mock ────────────────────────────────────────────────────
// jsdom does not implement pointer capture APIs.
HTMLElement.prototype.setPointerCapture = jest.fn();
HTMLElement.prototype.releasePointerCapture = jest.fn();

// ── ResizeObserver mock ──────────────────────────────────────────────────────
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// ── crypto.randomUUID mock ───────────────────────────────────────────────────
// jsdom may not expose crypto.randomUUID; provide a deterministic stand-in.
let uuidCounter = 0;
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${++uuidCounter}`,
  },
  configurable: true,
});

beforeEach(() => {
  uuidCounter = 0;
  jest.clearAllMocks();
  // Reset default getImageData to all-transparent
  mockCanvasContext.getImageData.mockReturnValue({
    data: new Uint8ClampedArray(300 * 600 * 4),
    width: 300,
    height: 600,
    colorSpace: 'srgb',
  });
});
