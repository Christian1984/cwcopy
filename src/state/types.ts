export interface LetterImage {
  id: string;
  dataUrl: string;
  capturedAt: number;
}

export interface Word {
  id: string;
  letters: LetterImage[];
}

export type View = 'draw' | 'results';

/** Subset of state persisted to localStorage. */
export interface SavedSession {
  currentLetters: LetterImage[];
  words: Word[];
}

export interface AppState {
  view: View;
  /** Letters captured since the last Space press (word in progress). */
  currentLetters: LetterImage[];
  /** Completed words (Space was pressed after each). */
  words: Word[];
  darkMode: boolean;
  /** Non-null when the app loaded with a saved session and hasn't asked the
   *  user whether to resume or start over yet. */
  resumePrompt: SavedSession | null;
}
