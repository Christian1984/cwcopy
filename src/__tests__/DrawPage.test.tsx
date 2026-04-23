import { render, screen, fireEvent, act } from '@testing-library/react';
import { DrawPage } from '../components/DrawPage';
import { AppContext } from '../state/AppContext';
import type { AppState } from '../state/types';
import { initialState } from '../state/reducer';

// Helper: render DrawPage with a controlled dispatch spy
function renderDrawPage(stateOverrides: Partial<AppState> = {}) {
  const dispatch = jest.fn();
  const state: AppState = { ...initialState, ...stateOverrides };

  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <DrawPage />
    </AppContext.Provider>,
  );

  return { dispatch };
}

describe('DrawPage', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders a canvas element', () => {
    renderDrawPage();
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders the Space button', () => {
    renderDrawPage();
    expect(screen.getByRole('button', { name: /space/i })).toBeInTheDocument();
  });

  it('renders the Results button', () => {
    renderDrawPage();
    expect(screen.getByRole('button', { name: /results/i })).toBeInTheDocument();
  });

  it('dispatches COMMIT_WORD when Space is clicked', () => {
    const { dispatch } = renderDrawPage();
    fireEvent.click(screen.getByRole('button', { name: /space/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'COMMIT_WORD' });
  });

  it('dispatches NAVIGATE_RESULTS when Results is clicked', () => {
    const { dispatch } = renderDrawPage();
    fireEvent.click(screen.getByRole('button', { name: /results/i }));
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'NAVIGATE_RESULTS' }),
    );
  });

  it('does not fire the debounce before the delay elapses', () => {
    const { dispatch } = renderDrawPage();
    const canvas = document.querySelector('canvas')!;

    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.pointerUp(canvas, { clientX: 10, clientY: 10 });

    act(() => jest.advanceTimersByTime(499));
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SAVE_LETTER' }),
    );
  });

  it('resets the debounce when the pointer goes down again before the delay', () => {
    const { dispatch } = renderDrawPage();
    const canvas = document.querySelector('canvas')!;

    // First stroke ends — debounce starts
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.pointerUp(canvas, { clientX: 10, clientY: 10 });

    // Second stroke begins before 500 ms — debounce should reset
    act(() => jest.advanceTimersByTime(300));
    fireEvent.pointerDown(canvas, { clientX: 20, clientY: 5 });

    // 300 ms more: would have fired if not reset, but should not
    act(() => jest.advanceTimersByTime(300));
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SAVE_LETTER' }),
    );
  });

  it('Space button is keyboard-accessible', () => {
    renderDrawPage();
    const btn = screen.getByRole('button', { name: /space/i });
    expect(btn.tagName).toBe('BUTTON');
  });

  it('Results button is keyboard-accessible', () => {
    renderDrawPage();
    const btn = screen.getByRole('button', { name: /results/i });
    expect(btn.tagName).toBe('BUTTON');
  });

  it('uses a dark canvas background in dark mode', () => {
    renderDrawPage({ darkMode: true });
    const canvas = document.querySelector('canvas')!;
    expect(canvas.className).toMatch(/bg-black/);
  });

  it('uses a light canvas background in light mode', () => {
    renderDrawPage({ darkMode: false });
    const canvas = document.querySelector('canvas')!;
    expect(canvas.className).toMatch(/bg-white/);
  });
});
