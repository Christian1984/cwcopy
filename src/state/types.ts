export interface LetterImage {
  id: string;
  dataUrl: string;
  capturedAt: number;
  /** Pixel dimensions of the captured (cropped) PNG. */
  pxWidth?: number;
  pxHeight?: number;
  /**
   * Distance in device pixels from the top of the cropped image to the
   * baseline. Used in the results view to align letters on their shared
   * writing line rather than on their bounding-box edges.
   */
  baselineOffset?: number;
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
  /** Seconds to wait after the last stroke before auto-capturing a letter. */
  cooldownS: number;
}
