import type { Word } from '../state/types';
import { BASELINE_FRACTION } from '../constants';
import { LetterImage } from './LetterImage';

interface Props {
  word: Word;
  /** Zoom multiplier from the results-page slider (default 1.0). */
  zoom: number;
}

/** Base display height (px) for the tallest letter at zoom 1.0. */
const BASE_MAX_PX = 80;
/** Floor so hairline strokes are still visible, before zoom is applied. */
const MIN_DISPLAY_PX = 16;

export function WordRow({ word, zoom }: Props) {
  const { letters } = word;
  const maxDisplayPx = BASE_MAX_PX * zoom;

  // Scale factor: tallest letter → maxDisplayPx.
  const maxPxH = Math.max(0, ...letters.map((l) => l.pxHeight ?? 0));
  const scale = maxPxH > 0 ? maxDisplayPx / maxPxH : zoom;

  // Per-letter display height and how many display-px sit above the baseline.
  const computed = letters.map((l) => {
    const displayH =
      maxPxH > 0 && l.pxHeight
        ? Math.max(MIN_DISPLAY_PX, Math.round(l.pxHeight * scale))
        : maxDisplayPx;

    // baselineOffset is stored in device pixels; scale it to display pixels.
    // Fall back to the global baseline fraction for old/missing data.
    const aboveBaseline =
      l.baselineOffset != null && l.pxHeight
        ? Math.round(l.baselineOffset * scale)
        : Math.round(displayH * BASELINE_FRACTION);

    return { displayH, aboveBaseline };
  });

  // Common baseline = max above-baseline across all letters in the word.
  // Each letter is pushed down by (maxAbove - its own aboveBaseline) so all
  // baselines land on the same horizontal line.
  const maxAbove = Math.max(0, ...computed.map((c) => c.aboveBaseline));

  return (
    // items-start + per-letter marginTop achieves baseline alignment.
    // Row height emerges naturally as maxAbove + maxBelow (no fixed height needed).
    <div className="flex flex-row flex-wrap items-start gap-0.5">
      {letters.map((letter, i) => (
        <LetterImage
          key={letter.id}
          letter={letter}
          displayH={computed[i].displayH}
          topOffset={maxAbove - computed[i].aboveBaseline}
        />
      ))}
    </div>
  );
}
