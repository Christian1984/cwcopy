import { savePrefs, loadPrefs, saveSession, loadSession, clearStoredSession } from '../utils/storage';
import { PREFS_KEY, STORAGE_KEY } from '../constants';

describe('savePrefs / loadPrefs', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when nothing is stored', () => {
    expect(loadPrefs()).toBeNull();
  });

  it('round-trips cooldownS', () => {
    savePrefs({ cooldownS: 0.4 });
    expect(loadPrefs()).toEqual({ cooldownS: 0.4 });
  });

  it('returns null for malformed JSON', () => {
    localStorage.setItem(PREFS_KEY, 'not-json');
    expect(loadPrefs()).toBeNull();
  });

  it('returns null when cooldownS is not a number', () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ cooldownS: 'fast' }));
    expect(loadPrefs()).toBeNull();
  });

  it('overwrites a previous saved pref', () => {
    savePrefs({ cooldownS: 0.1 });
    savePrefs({ cooldownS: 0.9 });
    expect(loadPrefs()?.cooldownS).toBe(0.9);
  });
});

describe('saveSession / loadSession / clearStoredSession', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when nothing is stored', () => {
    expect(loadSession()).toBeNull();
  });

  it('round-trips words and currentLetters', () => {
    const session = {
      words: [{ id: 'w1', letters: [] }],
      currentLetters: [{ id: 'l1', dataUrl: 'data:image/png;base64,x', capturedAt: 1 }],
    };
    saveSession(session);
    expect(loadSession()).toEqual(session);
  });

  it('returns null for malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(loadSession()).toBeNull();
  });

  it('returns null when words is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ words: null, currentLetters: [] }));
    expect(loadSession()).toBeNull();
  });

  it('returns null when currentLetters is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ words: [], currentLetters: 'bad' }));
    expect(loadSession()).toBeNull();
  });

  it('clearStoredSession removes the stored session', () => {
    saveSession({ words: [], currentLetters: [] });
    clearStoredSession();
    expect(loadSession()).toBeNull();
  });
});
