import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { reducer, initialState } from './reducer';
import type { AppState } from './types';
import type { Action } from './actions';
import { loadSession, saveSession, loadPrefs, savePrefs } from '../utils/storage';
import { hex } from '../theme';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

// Exported so tests can provide a controlled context value directly.
export const AppContext = createContext<AppContextValue | null>(null);

/** Runs once on first render to hydrate initial state from localStorage. */
function init(base: AppState): AppState {
  const prefs = loadPrefs();
  const state = prefs ? { ...base, cooldownS: prefs.cooldownS } : base;
  const saved = loadSession();
  if (saved && (saved.words.length > 0 || saved.currentLetters.length > 0)) {
    return { ...state, resumePrompt: saved };
  }
  return state;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  // Persist session whenever letters or words change.
  useEffect(() => {
    saveSession({ currentLetters: state.currentLetters, words: state.words });
  }, [state.currentLetters, state.words]);

  // Persist preferences (survive session clear) whenever they change.
  useEffect(() => {
    savePrefs({ cooldownS: state.cooldownS });
  }, [state.cooldownS]);

  // Keep the browser/OS status-bar colour in sync with the app theme.
  useEffect(() => {
    const color = state.darkMode ? hex.dark.surface : hex.light.surface;
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
      el.setAttribute('content', color);
    });
  }, [state.darkMode]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
