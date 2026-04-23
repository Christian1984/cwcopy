import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeDialog } from '../components/ResumeDialog';
import { AppContext } from '../state/AppContext';
import type { AppState } from '../state/types';
import { initialState } from '../state/reducer';

const savedSession = {
  words: [{ id: 'w1', letters: [] }],
  currentLetters: [],
};

function renderDialog(stateOverrides: Partial<AppState> = {}) {
  const dispatch = jest.fn();
  const state: AppState = { ...initialState, ...stateOverrides };
  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <ResumeDialog />
    </AppContext.Provider>,
  );
  return { dispatch };
}

describe('ResumeDialog', () => {
  it('renders nothing when resumePrompt is null', () => {
    renderDialog({ resumePrompt: null });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when resumePrompt is set', () => {
    renderDialog({ resumePrompt: savedSession });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dispatches RESUME_SESSION with the saved session when Resume is clicked', () => {
    const { dispatch } = renderDialog({ resumePrompt: savedSession });
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESUME_SESSION',
      payload: savedSession,
    });
  });

  it('dispatches DISMISS_RESUME_PROMPT when Start over is clicked', () => {
    const { dispatch } = renderDialog({ resumePrompt: savedSession });
    fireEvent.click(screen.getByRole('button', { name: /start over/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'DISMISS_RESUME_PROMPT' });
  });
});
