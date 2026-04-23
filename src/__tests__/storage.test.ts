import { savePrefs, loadPrefs } from '../utils/storage';
import { PREFS_KEY } from '../constants';

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
