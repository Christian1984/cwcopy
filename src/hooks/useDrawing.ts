import { useEffect, useRef, type RefObject } from 'react';

export interface DrawingOptions {
  strokeColor: string;
  strokeWidth: number;
  /** Called when the pointer goes down — use to reset a pending debounce. */
  onStrokeStart: () => void;
  /** Called every time the user lifts the pointer (finger/stylus/mouse). */
  onStrokeEnd: () => void;
}

/**
 * Wires pointer events onto the canvas and manages high-DPI scaling via a
 * ResizeObserver (canvas is re-scaled whenever its CSS size changes).
 *
 * The canvas background is left transparent — callers apply a background
 * colour via CSS. Only the drawn strokes have pixels, which allows
 * captureLetterImage to use alpha > 0 for bounding-box detection.
 *
 * Toggling strokeColor takes effect on the next pointerdown (no re-mount).
 */
export function useDrawing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: DrawingOptions,
): void {
  // Keep a stable ref to options so event handlers always see the latest
  // values without the effect needing to re-run (which would clear the canvas).
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Canvas setup + ResizeObserver (runs once on mount).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const applySize = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    const observer = new ResizeObserver(applySize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [canvasRef]);

  // Pointer event listeners (runs once on mount).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDrawing = false;

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      isDrawing = true;
      optionsRef.current.onStrokeStart();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = optionsRef.current.strokeColor;
      ctx.lineWidth = optionsRef.current.strokeWidth;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const onPointerUp = (_e: PointerEvent) => {
      if (!isDrawing) return;
      isDrawing = false;
      optionsRef.current.onStrokeEnd();
    };

    const onPointerCancel = (_e: PointerEvent) => {
      if (!isDrawing) return;
      isDrawing = false;
      optionsRef.current.onStrokeEnd();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [canvasRef]);
}
