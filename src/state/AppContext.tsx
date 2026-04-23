import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { reducer, initialState } from './reducer';
import type { AppState } from './types';
import type { Action } from './actions';
import { loadSession, saveSession } from '../utils/storage';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

// Exported so tests can provide a controlled context value directly.
export const AppContext = createContext<AppContextValue | null>(null);

/** Runs once on first render to hydrate initial state from localStorage. */
function init(base: AppState): AppState {
  const saved = loadSession();
  if (saved && (saved.words.length > 0 || saved.currentLetters.length > 0)) {
    return { ...base, resumePrompt: saved };
  }
  return base;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  // Persist session whenever letters or words change.
  useEffect(() => {
    saveSession({ currentLetters: state.currentLetters, words: state.words });
  }, [state.currentLetters, state.words]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
