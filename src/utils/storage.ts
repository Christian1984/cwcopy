import { STORAGE_KEY, PREFS_KEY } from '../constants';
import type { SavedSession } from '../state/types';

export interface SavedPrefs {
  cooldownS: number;
}

export function savePrefs(prefs: SavedPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore.
  }
}

export function loadPrefs(): SavedPrefs | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPrefs;
    if (typeof parsed.cooldownS !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: SavedSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore.
  }
}

export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSession;
    if (!Array.isArray(parsed.currentLetters) || !Array.isArray(parsed.words)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
