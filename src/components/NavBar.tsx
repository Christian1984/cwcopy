import { useApp } from '../state/AppContext';
import { theme } from '../theme';

export function NavBar() {
  const { state, dispatch } = useApp();
  const t = state.darkMode ? theme.dark : theme.light;

  return (
    <nav
      className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${t.surface} ${t.border} ${t.titleText}`}
    >
      <div className="flex items-center gap-2">
        <a
          href="https://ko-fi.com/chrisvomrhein"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support on Ko-fi"
          className="text-xl leading-none opacity-70 hover:opacity-100 transition-opacity"
        >
          ☕
        </a>
        <span className="text-base font-semibold tracking-wide">cwcopy</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-base select-none" aria-hidden="true">
          {state.darkMode ? '🌙' : '☀️'}
        </span>
        <button
          role="switch"
          aria-checked={state.darkMode}
          aria-label="Toggle dark mode"
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className={`relative inline-flex h-7 w-12 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${t.toggleTrack} focus-visible:${t.toggleFocusRing}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full shadow transition-transform ${t.toggleDot} ${state.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
          <span className="sr-only">{state.darkMode ? 'Dark mode on' : 'Light mode on'}</span>
        </button>
      </div>
    </nav>
  );
}
