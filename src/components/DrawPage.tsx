import { useRef, useCallback } from 'react';
import { useApp } from '../state/AppContext';
import { useDrawing } from '../hooks/useDrawing';
import { useDebounce } from '../hooks/useDebounce';
import { captureLetterImage, clearCanvas } from '../utils/canvas';
import { LETTER_SAVE_DELAY_MS, BASELINE_FRACTION } from '../constants';
import { ControlBar } from './ControlBar';

export function DrawPage() {
  const { state, dispatch } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** Capture whatever is on the canvas as a letter and clear it. */
  const saveAndClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const letter = captureLetterImage(canvas);
    if (letter) dispatch({ type: 'SAVE_LETTER', payload: letter });
    clearCanvas(canvas);
  }, [state.darkMode, dispatch]);

  const { trigger: triggerDebounce, cancel: cancelDebounce } = useDebounce(
    saveAndClear,
    LETTER_SAVE_DELAY_MS,
  );

  useDrawing(canvasRef, {
    strokeColor: state.darkMode ? '#9ca3af' : '#1a1a1a',
    strokeWidth: 3,
    onStrokeStart: cancelDebounce,
    onStrokeEnd: triggerDebounce,
  });

  const handleSpace = useCallback(() => {
    cancelDebounce();
    // Flush any content currently on the canvas before committing the word.
    saveAndClear();
    dispatch({ type: 'COMMIT_WORD' });
  }, [cancelDebounce, saveAndClear, dispatch]);

  const handleResults = useCallback(() => {
    cancelDebounce();
    // Flush current canvas content. NAVIGATE_RESULTS will auto-commit any
    // pending currentLetters (including the one we just saved).
    saveAndClear();
    dispatch({ type: 'NAVIGATE_RESULTS' });
  }, [cancelDebounce, saveAndClear, dispatch]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Canvas + baseline overlay. The line is CSS-only — it never touches
          canvas pixel data and will not appear in captured letter images. */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full touch-none cursor-crosshair ${
            state.darkMode ? 'bg-black' : 'bg-amber-50'
          }`}
        />
        {/* Baseline — ascenders above, descenders below */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: `${BASELINE_FRACTION * 100}%` }}
        >
          <div className={`border-t border-dashed ${
            state.darkMode ? 'border-gray-700' : 'border-gray-300'
          }`} />
        </div>
      </div>

      <ControlBar buttons={[
        { label: 'Space',   onClick: handleSpace,   variant: 'primary'  },
        { label: 'Results', onClick: handleResults, variant: 'confirm'  },
      ]} />
    </div>
  );
}
