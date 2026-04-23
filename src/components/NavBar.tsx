import { useApp } from '../state/AppContext';

export function NavBar() {
  const { state, dispatch } = useApp();

  return (
    <nav className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
      state.darkMode
        ? 'bg-gray-900 border-gray-700 text-gray-100'
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <span className="text-base font-semibold tracking-wide">CW Notepad</span>

      <button
        role="switch"
        aria-checked={state.darkMode}
        aria-label="Toggle dark mode"
        onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
        className={`relative inline-flex h-7 w-12 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          state.darkMode
            ? 'bg-indigo-600 focus-visible:ring-indigo-500'
            : 'bg-gray-300 focus-visible:ring-gray-400'
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            state.darkMode ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
        <span className="sr-only">{state.darkMode ? 'Dark mode on' : 'Light mode on'}</span>
      </button>
    </nav>
  );
}
