import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsPage } from '../components/ResultsPage';
import { AppContext } from '../state/AppContext';
import type { AppState, LetterImage, Word } from '../state/types';
import { initialState } from '../state/reducer';

const letter = (id: string): LetterImage => ({
  id,
  dataUrl: `data:image/png;base64,${id}`,
  capturedAt: 1000,
});

const word = (id: string, letterIds: string[]): Word => ({
  id,
  letters: letterIds.map(letter),
});

function renderResultsPage(words: Word[] = []) {
  const dispatch = jest.fn();
  const state: AppState = { ...initialState, view: 'results', words };

  render(
    <AppContext.Provider value={{ state, dispatch }}>
      <ResultsPage />
    </AppContext.Provider>,
  );

  return { dispatch };
}

describe('ResultsPage', () => {
  it('shows an empty-state message when there are no words', () => {
    renderResultsPage([]);
    expect(screen.getByText(/no words/i)).toBeInTheDocument();
  });

  it('renders one row per word', () => {
    renderResultsPage([word('w1', ['a', 'b']), word('w2', ['c'])]);
    // Each word is rendered as a group of images; check that both words' letters appear.
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(3); // 2 letters + 1 letter
  });

  it('renders letter images with the correct src', () => {
    renderResultsPage([word('w1', ['x'])]);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,x');
  });

  it('dispatches NAVIGATE_DRAW when Back is clicked', () => {
    const { dispatch } = renderResultsPage();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'NAVIGATE_DRAW' });
  });

  it('dispatches CLEAR_ALL when Clear is clicked', () => {
    const { dispatch } = renderResultsPage();
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_ALL' });
  });
});
