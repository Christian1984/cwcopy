import { useCallback, useRef } from 'react';
import { useApp } from '../state/AppContext';
import { useDrawing } from '../hooks/useDrawing';
import { useDebounce } from '../hooks/useDebounce';
import { captureLetterImage, clearCanvas } from '../utils/canvas';
import { BASELINE_FRACTION } from '../constants';
import { theme, hex } from '../theme';
import { ControlBar } from './ControlBar';
import { StyledSlider } from './StyledSlider';

const DELAY_MIN = 0;
const DELAY_MAX = 1.0;
const DELAY_STEP = 0.05;

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
  }, [dispatch]);

  const { trigger: triggerDebounce, cancel: cancelDebounce } = useDebounce(
    saveAndClear,
    state.cooldownS * 1000,
  );

  const t = state.darkMode ? theme.dark : theme.light;
  const h = state.darkMode ? hex.dark : hex.light;

  useDrawing(canvasRef, {
    strokeColor: h.stroke,
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
          className={`absolute inset-0 w-full h-full touch-none cursor-crosshair ${t.canvas}`}
        />
        {/* Baseline — ascenders above, descenders below */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{ top: `${BASELINE_FRACTION * 100}%` }}
        >
          <div className={`border-t border-dashed ${t.baselineBorder}`} />
        </div>
      </div>

      {/* Cooldown slider — above buttons */}
      <StyledSlider
        label="Cooldown"
        min={DELAY_MIN}
        max={DELAY_MAX}
        step={DELAY_STEP}
        value={state.cooldownS}
        onChange={(v) => dispatch({ type: 'SET_COOLDOWN', payload: v })}
        formatValue={(v) => `${v.toFixed(2)}s`}
        darkMode={state.darkMode}
      />

      <ControlBar
        buttons={[
          { label: 'Space', onClick: handleSpace, variant: 'primary' },
          { label: 'Results', onClick: handleResults, variant: 'confirm' },
        ]}
      />
    </div>
  );
}
