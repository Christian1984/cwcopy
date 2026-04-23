import { type CSSProperties, useState } from 'react';
import { useApp } from '../state/AppContext';
import { WordRow } from './WordRow';
import { ControlBar } from './ControlBar';
import { clearStoredSession } from '../utils/storage';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.0;
const ZOOM_DEFAULT = 1.0;
const ZOOM_STEP = 0.1;

export function ResultsPage() {
  const { state, dispatch } = useApp();
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);

  const handleBack = () => dispatch({ type: 'NAVIGATE_DRAW' });

  const handleClear = () => {
    clearStoredSession();
    dispatch({ type: 'CLEAR_ALL' });
    dispatch({ type: 'NAVIGATE_DRAW' });
  };

  const bg = state.darkMode ? 'bg-gray-900' : 'bg-amber-50';
  const border = state.darkMode ? 'border-gray-500' : 'border-gray-800';
  const labelText = state.darkMode ? 'text-gray-400' : 'text-gray-500';

  // Slider colours — passed as CSS custom properties so the passive track
  // section (right of thumb) can be styled separately from the active fill.
  const sliderThumb = state.darkMode ? '#9ca3af' : '#2563eb';
  const sliderPassive = state.darkMode ? '#374151' : '#e5e7eb';
  const sliderFill = ((zoom - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100;
  const sliderStyle = {
    background: `linear-gradient(to right, ${sliderThumb} ${sliderFill}%, ${sliderPassive} ${sliderFill}%)`,
    '--slider-thumb': sliderThumb,
    '--slider-passive': sliderPassive,
  } as CSSProperties;

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${bg}`}>
      {/* Scrollable word list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {state.words.length === 0 ? (
          <p className={`text-sm ${labelText}`}>No words yet.</p>
        ) : (
          state.words.map((word, i) => (
            <div key={word.id}>
              {i > 0 && (
                <hr className={`my-3 ${state.darkMode ? 'border-gray-500' : 'border-gray-800'}`} />
              )}
              <WordRow word={word} zoom={zoom} />
            </div>
          ))
        )}
      </div>

      {/* Zoom slider — above buttons */}
      <div className={`flex items-center gap-3 px-4 py-2 border-t shrink-0 ${border}`}>
        <span className={`text-xs shrink-0 ${labelText}`}>Zoom</span>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={ZOOM_STEP}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="flex-1 styled-range"
          style={sliderStyle}
          aria-label="Zoom"
        />
        <span className={`text-xs w-8 text-right tabular-nums shrink-0 ${labelText}`}>
          {zoom.toFixed(1)}×
        </span>
      </div>

      {/* Buttons — fixed at bottom */}
      <ControlBar
        buttons={[
          { label: 'Back', onClick: handleBack, variant: 'secondary' },
          { label: 'Clear', onClick: handleClear, variant: 'danger' },
        ]}
      />
    </div>
  );
}
