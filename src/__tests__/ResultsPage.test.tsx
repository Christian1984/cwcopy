import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsPage } from '../components/ResultsPage';
import { AppContext } from '../state/AppContext';
import type { AppState, LetterImage, Word } from '../state/types';
import { initialState } from '../state/reducer';

const letter = (id: string, pxHeight = 60, baselineOffset?: number): LetterImage => ({
  id,
  dataUrl: `data:image/png;base64,${id}`,
  capturedAt: 1000,
  pxWidth: 40,
  pxHeight,
  baselineOffset: baselineOffset ?? Math.round(pxHeight * 0.62),
});

const word = (id: string, letterIds: string[]): Word => ({
  id,
  letters: letterIds.map((id) => letter(id)),
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

  it('renders the tallest letter at MAX_DISPLAY_PX and shorter letters proportionally', () => {
    // tall = 80px, short = 40px  →  short renders at 80/2 = 40px
    const w = { id: 'w1', letters: [letter('tall', 80), letter('short', 40)] };
    renderResultsPage([w]);
    const [imgTall, imgShort] = screen.getAllByRole('img');
    expect(imgTall).toHaveStyle({ height: '80px' });
    expect(imgShort).toHaveStyle({ height: '40px' });
  });

  it('renders a zoom slider with default value 1', () => {
    renderResultsPage();
    const slider = screen.getByRole('slider', { name: /zoom/i });
    expect(slider).toHaveAttribute('min', '0.5');
    expect(slider).toHaveAttribute('max', '2');
    expect(slider).toHaveAttribute('value', '1');
  });

  it('zoom slider scales letter heights (zoom 2 → tallest letter at 160px)', () => {
    const w = { id: 'w1', letters: [letter('a', 80)] };
    renderResultsPage([w]);
    const slider = screen.getByRole('slider', { name: /zoom/i });
    fireEvent.change(slider, { target: { value: '2' } });
    const img = screen.getByRole('img');
    expect(img).toHaveStyle({ height: '160px' });
  });

  it('baseline-aligns letters via marginTop', () => {
    // tall: pxHeight=80, baselineOffset=50  → aboveBaseline(display)=50, topOffset=0
    // short: pxHeight=40, baselineOffset=20 → aboveBaseline(display)=20, topOffset=30
    const tall = letter('tall', 80, 50);
    const short = letter('short', 40, 20);
    const w = { id: 'w1', letters: [tall, short] };
    renderResultsPage([w]);
    const [imgTall, imgShort] = screen.getAllByRole('img');
    // tallest letter has no top offset (maxAbove = its own aboveBaseline)
    expect(imgTall).toHaveStyle({ marginTop: '0px' });
    // short letter pushed down so its baseline aligns: maxAbove(50) - aboveBaseline(20) = 30
    expect(imgShort).toHaveStyle({ marginTop: '30px' });
  });
});
