import { render, screen } from '@testing-library/react';
import { AppContext } from '../state/AppContext';
import { App } from '../App';
import type { AppState } from '../state/types';
import { initialState } from '../state/reducer';

function renderApp(stateOverrides: Partial<AppState> = {}) {
  const state: AppState = { ...initialState, ...stateOverrides };
  const dispatch = jest.fn();
  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <App />
    </AppContext.Provider>,
  );
  return { dispatch };
}

describe('App', () => {
  it('renders DrawPage when view is draw', () => {
    renderApp({ view: 'draw' });
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders ResultsPage when view is results', () => {
    renderApp({ view: 'results' });
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('shows ResumeDialog when resumePrompt is set', () => {
    renderApp({
      resumePrompt: {
        words: [{ id: 'w1', letters: [] }],
        currentLetters: [],
      },
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not show ResumeDialog when resumePrompt is null', () => {
    renderApp({ resumePrompt: null });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
