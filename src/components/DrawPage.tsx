import { useRef, useCallback } from 'react';
import { useApp } from '../state/AppContext';
import { useDrawing } from '../hooks/useDrawing';
import { useDebounce } from '../hooks/useDebounce';
import { captureLetterImage, clearCanvas } from '../utils/canvas';
import { LETTER_SAVE_DELAY_MS } from '../constants';

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
    strokeColor: state.darkMode ? '#ffffff' : '#1a1a1a',
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
      <canvas
        ref={canvasRef}
        className={`flex-1 w-full touch-none cursor-crosshair ${
          state.darkMode ? 'bg-black' : 'bg-white'
        }`}
      />

      <div className={`flex gap-4 justify-center px-4 py-4 shrink-0 border-t ${
        state.darkMode
          ? 'bg-gray-900 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <button
          onClick={handleSpace}
          className={`flex-1 max-w-xs py-4 rounded-2xl text-lg font-medium transition-colors active:scale-95 ${
            state.darkMode
              ? 'bg-blue-700 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          Space
        </button>

        <button
          onClick={handleResults}
          className={`flex-1 max-w-xs py-4 rounded-2xl text-lg font-medium transition-colors active:scale-95 ${
            state.darkMode
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          Results
        </button>
      </div>
    </div>
  );
}
