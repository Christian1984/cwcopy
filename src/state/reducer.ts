import type { AppState } from './types';
import type { Action } from './actions';

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export const initialState: AppState = {
  view: 'draw',
  currentLetters: [],
  words: [],
  darkMode: prefersDark,
  resumePrompt: null,
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SAVE_LETTER':
      return { ...state, currentLetters: [...state.currentLetters, action.payload] };

    case 'COMMIT_WORD': {
      if (state.currentLetters.length === 0) return state;
      const word = { id: crypto.randomUUID(), letters: state.currentLetters };
      return { ...state, words: [...state.words, word], currentLetters: [] };
    }

    case 'NAVIGATE_RESULTS': {
      // Auto-commit in-progress letters so nothing is silently discarded.
      const extra =
        state.currentLetters.length > 0
          ? [{ id: crypto.randomUUID(), letters: state.currentLetters }]
          : [];
      return {
        ...state,
        view: 'results',
        words: [...state.words, ...extra],
        currentLetters: [],
      };
    }

    case 'NAVIGATE_DRAW':
      return { ...state, view: 'draw' };

    case 'CLEAR_ALL':
      return { ...state, words: [], currentLetters: [] };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'RESUME_SESSION':
      return {
        ...state,
        currentLetters: action.payload.currentLetters,
        words: action.payload.words,
        resumePrompt: null,
      };

    case 'DISMISS_RESUME_PROMPT':
      return { ...state, resumePrompt: null };

    default:
      return state;
  }
}
