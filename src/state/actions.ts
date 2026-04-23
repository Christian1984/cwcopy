import type { LetterImage, SavedSession } from './types';

export type Action =
  /** Debounce fired: a captured letter is added to the current word. */
  | { type: 'SAVE_LETTER'; payload: LetterImage }
  /** Space button: commit currentLetters as a completed Word. No-op if empty. */
  | { type: 'COMMIT_WORD' }
  /** Results button: auto-commit any pending letters, then switch view. */
  | { type: 'NAVIGATE_RESULTS' }
  /** Back button on results page. */
  | { type: 'NAVIGATE_DRAW' }
  /** Clear button on results page: wipe all words and currentLetters. */
  | { type: 'CLEAR_ALL' }
  /** NavBar toggle. */
  | { type: 'TOGGLE_DARK_MODE' }
  /** User chose "Resume" on the reload dialog. */
  | { type: 'RESUME_SESSION'; payload: SavedSession }
  /** User chose "Start over" on the reload dialog. */
  | { type: 'DISMISS_RESUME_PROMPT' }
  /** Cooldown slider changed. */
  | { type: 'SET_COOLDOWN'; payload: number };
