import { useApp } from '../state/AppContext';
import { WordRow } from './WordRow';
import { clearStoredSession } from '../utils/storage';

export function ResultsPage() {
  const { state, dispatch } = useApp();

  const handleBack = () => dispatch({ type: 'NAVIGATE_DRAW' });

  const handleClear = () => {
    clearStoredSession();
    dispatch({ type: 'CLEAR_ALL' });
    dispatch({ type: 'NAVIGATE_DRAW' });
  };

  const headerBorder = state.darkMode ? 'border-gray-700' : 'border-gray-200';
  const bg = state.darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const btnBase = 'px-5 py-2 rounded-xl font-medium transition-colors text-sm';

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${bg}`}>
      <div className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${headerBorder}`}>
        <button
          onClick={handleBack}
          className={`${btnBase} ${
            state.darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Back
        </button>

        <button
          onClick={handleClear}
          className={`${btnBase} ${
            state.darkMode
              ? 'bg-red-800 hover:bg-red-700 text-gray-100'
              : 'bg-red-100 hover:bg-red-200 text-red-800'
          }`}
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {state.words.length === 0 ? (
          <p className={`text-sm ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No words yet.
          </p>
        ) : (
          state.words.map((word) => <WordRow key={word.id} word={word} />)
        )}
      </div>
    </div>
  );
}
