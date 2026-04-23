import { useState } from 'react';
import { useApp } from '../state/AppContext';
import { WordRow } from './WordRow';
import { ControlBar } from './ControlBar';
import { StyledSlider } from './StyledSlider';
import { clearStoredSession } from '../utils/storage';
import { theme } from '../theme';

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

  const t = state.darkMode ? theme.dark : theme.light;

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${t.surface}`}>
      {/* Scrollable word list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {state.words.length === 0 ? (
          <p className={`text-sm ${t.labelText}`}>No words yet.</p>
        ) : (
          state.words.map((word, i) => (
            <div key={word.id}>
              {i > 0 && (
                <hr className={`my-3 ${t.border}`} />
              )}
              <WordRow word={word} zoom={zoom} />
            </div>
          ))
        )}
      </div>

      {/* Zoom slider — above buttons */}
      <StyledSlider
        label="Zoom"
        min={ZOOM_MIN}
        max={ZOOM_MAX}
        step={ZOOM_STEP}
        value={zoom}
        onChange={setZoom}
        formatValue={(v) => `${v.toFixed(1)}×`}
        darkMode={state.darkMode}
      />

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
