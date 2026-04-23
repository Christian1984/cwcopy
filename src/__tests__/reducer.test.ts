import { reducer, initialState } from '../state/reducer';
import type { AppState, LetterImage, SavedSession } from '../state/types';

const letter = (id = 'l1'): LetterImage => ({
  id,
  dataUrl: `data:image/png;base64,${id}`,
  capturedAt: 1000,
});

describe('reducer', () => {
  // ── SAVE_LETTER ────────────────────────────────────────────────────────────
  describe('SAVE_LETTER', () => {
    it('appends the letter to currentLetters', () => {
      const next = reducer(initialState, { type: 'SAVE_LETTER', payload: letter('a') });
      expect(next.currentLetters).toHaveLength(1);
      expect(next.currentLetters[0].id).toBe('a');
    });

    it('does not mutate the previous state', () => {
      const prev = { ...initialState };
      reducer(prev, { type: 'SAVE_LETTER', payload: letter('a') });
      expect(prev.currentLetters).toHaveLength(0);
    });

    it('preserves existing letters', () => {
      const state: AppState = { ...initialState, currentLetters: [letter('a')] };
      const next = reducer(state, { type: 'SAVE_LETTER', payload: letter('b') });
      expect(next.currentLetters.map((l) => l.id)).toEqual(['a', 'b']);
    });
  });

  // ── COMMIT_WORD ────────────────────────────────────────────────────────────
  describe('COMMIT_WORD', () => {
    it('moves currentLetters into a new Word', () => {
      const state: AppState = { ...initialState, currentLetters: [letter('a'), letter('b')] };
      const next = reducer(state, { type: 'COMMIT_WORD' });
      expect(next.words).toHaveLength(1);
      expect(next.words[0].letters.map((l) => l.id)).toEqual(['a', 'b']);
    });

    it('clears currentLetters after committing', () => {
      const state: AppState = { ...initialState, currentLetters: [letter()] };
      const next = reducer(state, { type: 'COMMIT_WORD' });
      expect(next.currentLetters).toHaveLength(0);
    });

    it('is a no-op when currentLetters is empty', () => {
      const next = reducer(initialState, { type: 'COMMIT_WORD' });
      expect(next).toBe(initialState);
    });

    it('assigns a unique id to each new Word', () => {
      let state: AppState = { ...initialState, currentLetters: [letter('a')] };
      state = reducer(state, { type: 'COMMIT_WORD' });
      state = { ...state, currentLetters: [letter('b')] };
      state = reducer(state, { type: 'COMMIT_WORD' });
      expect(state.words[0].id).not.toBe(state.words[1].id);
    });

    it('accumulates multiple committed words', () => {
      let state: AppState = { ...initialState, currentLetters: [letter('a')] };
      state = reducer(state, { type: 'COMMIT_WORD' });
      state = { ...state, currentLetters: [letter('b')] };
      state = reducer(state, { type: 'COMMIT_WORD' });
      expect(state.words).toHaveLength(2);
    });
  });

  // ── NAVIGATE_RESULTS ───────────────────────────────────────────────────────
  describe('NAVIGATE_RESULTS', () => {
    it('sets view to results', () => {
      const next = reducer(initialState, { type: 'NAVIGATE_RESULTS' });
      expect(next.view).toBe('results');
    });

    it('auto-commits currentLetters when non-empty', () => {
      const state: AppState = { ...initialState, currentLetters: [letter('a'), letter('b')] };
      const next = reducer(state, { type: 'NAVIGATE_RESULTS' });
      expect(next.words).toHaveLength(1);
      expect(next.words[0].letters.map((l) => l.id)).toEqual(['a', 'b']);
    });

    it('does not add an empty word when currentLetters is empty', () => {
      const next = reducer(initialState, { type: 'NAVIGATE_RESULTS' });
      expect(next.words).toHaveLength(0);
    });

    it('clears currentLetters', () => {
      const state: AppState = { ...initialState, currentLetters: [letter()] };
      const next = reducer(state, { type: 'NAVIGATE_RESULTS' });
      expect(next.currentLetters).toHaveLength(0);
    });
  });

  // ── NAVIGATE_DRAW ──────────────────────────────────────────────────────────
  describe('NAVIGATE_DRAW', () => {
    it('sets view to draw', () => {
      const state: AppState = { ...initialState, view: 'results' };
      const next = reducer(state, { type: 'NAVIGATE_DRAW' });
      expect(next.view).toBe('draw');
    });

    it('does not clear words', () => {
      const word = { id: 'w1', letters: [letter()] };
      const state: AppState = { ...initialState, view: 'results', words: [word] };
      const next = reducer(state, { type: 'NAVIGATE_DRAW' });
      expect(next.words).toHaveLength(1);
    });
  });

  // ── CLEAR_ALL ──────────────────────────────────────────────────────────────
  describe('CLEAR_ALL', () => {
    it('empties words and currentLetters', () => {
      const state: AppState = {
        ...initialState,
        words: [{ id: 'w1', letters: [letter()] }],
        currentLetters: [letter('x')],
      };
      const next = reducer(state, { type: 'CLEAR_ALL' });
      expect(next.words).toHaveLength(0);
      expect(next.currentLetters).toHaveLength(0);
    });

    it('does not change view', () => {
      const state: AppState = { ...initialState, view: 'results' };
      const next = reducer(state, { type: 'CLEAR_ALL' });
      expect(next.view).toBe('results');
    });

    it('does not change darkMode', () => {
      const state: AppState = { ...initialState, darkMode: false };
      const next = reducer(state, { type: 'CLEAR_ALL' });
      expect(next.darkMode).toBe(false);
    });
  });

  // ── TOGGLE_DARK_MODE ───────────────────────────────────────────────────────
  describe('TOGGLE_DARK_MODE', () => {
    it('toggles dark mode on', () => {
      const state: AppState = { ...initialState, darkMode: false };
      expect(reducer(state, { type: 'TOGGLE_DARK_MODE' }).darkMode).toBe(true);
    });

    it('toggles dark mode off', () => {
      const state: AppState = { ...initialState, darkMode: true };
      expect(reducer(state, { type: 'TOGGLE_DARK_MODE' }).darkMode).toBe(false);
    });
  });

  // ── RESUME_SESSION ─────────────────────────────────────────────────────────
  describe('RESUME_SESSION', () => {
    it('loads words and currentLetters from the payload', () => {
      const saved: SavedSession = {
        words: [{ id: 'w1', letters: [letter()] }],
        currentLetters: [letter('x')],
      };
      const next = reducer(initialState, { type: 'RESUME_SESSION', payload: saved });
      expect(next.words).toHaveLength(1);
      expect(next.currentLetters[0].id).toBe('x');
    });

    it('clears resumePrompt', () => {
      const state: AppState = {
        ...initialState,
        resumePrompt: { words: [], currentLetters: [] },
      };
      const next = reducer(state, {
        type: 'RESUME_SESSION',
        payload: { words: [], currentLetters: [] },
      });
      expect(next.resumePrompt).toBeNull();
    });
  });

  // ── DISMISS_RESUME_PROMPT ──────────────────────────────────────────────────
  describe('DISMISS_RESUME_PROMPT', () => {
    it('clears resumePrompt', () => {
      const state: AppState = {
        ...initialState,
        resumePrompt: { words: [], currentLetters: [] },
      };
      const next = reducer(state, { type: 'DISMISS_RESUME_PROMPT' });
      expect(next.resumePrompt).toBeNull();
    });
  });

  // ── SET_COOLDOWN ───────────────────────────────────────────────────────────
  describe('SET_COOLDOWN', () => {
    it('updates cooldownS', () => {
      const next = reducer(initialState, { type: 'SET_COOLDOWN', payload: 0.5 });
      expect(next.cooldownS).toBe(0.5);
    });

    it('does not mutate other state fields', () => {
      const state: AppState = { ...initialState, darkMode: true };
      const next = reducer(state, { type: 'SET_COOLDOWN', payload: 0.3 });
      expect(next.darkMode).toBe(true);
      expect(next.words).toBe(state.words);
    });
  });

  // ── cooldownS preservation ─────────────────────────────────────────────────
  describe('cooldownS preservation', () => {
    it('CLEAR_ALL does not reset cooldownS', () => {
      const state: AppState = { ...initialState, cooldownS: 0.7 };
      const next = reducer(state, { type: 'CLEAR_ALL' });
      expect(next.cooldownS).toBe(0.7);
    });

    it('RESUME_SESSION does not reset cooldownS', () => {
      const state: AppState = { ...initialState, cooldownS: 0.8 };
      const next = reducer(state, {
        type: 'RESUME_SESSION',
        payload: { words: [], currentLetters: [] },
      });
      expect(next.cooldownS).toBe(0.8);
    });

    it('DISMISS_RESUME_PROMPT does not reset cooldownS', () => {
      const state: AppState = {
        ...initialState,
        cooldownS: 0.6,
        resumePrompt: { words: [], currentLetters: [] },
      };
      const next = reducer(state, { type: 'DISMISS_RESUME_PROMPT' });
      expect(next.cooldownS).toBe(0.6);
    });

    it('initialState has the default cooldown', () => {
      expect(initialState.cooldownS).toBe(0.05);
    });
  });
});
