import type { LetterImage as LetterImageType } from '../state/types';
import { useApp } from '../state/AppContext';

interface Props {
  letter: LetterImageType;
  /** Pre-computed display height in px (from WordRow). */
  displayH: number;
  /** marginTop in px so this letter's baseline aligns with siblings. */
  topOffset: number;
}

export function LetterImage({ letter, displayH, topOffset }: Props) {
  const { state } = useApp();

  // Normalise stroke colour regardless of what mode it was drawn in:
  //   brightness(0)           → all opaque pixels become black
  //   brightness(0) invert(1) → all opaque pixels become white
  // Transparent pixels are unaffected by both, so the background shows through.
  // Light mode: render strokes as near-black.
  // Dark mode: render strokes as medium gray (brightness(0) → black,
  //   invert(1) → white, brightness(0.65) → ~65% white ≈ gray-400).
  const filter = state.darkMode
    ? 'brightness(0) invert(1) brightness(0.65)'
    : 'brightness(0)';

  return (
    <img
      src={letter.dataUrl}
      alt="drawn letter"
      style={{ height: `${displayH}px`, marginTop: `${topOffset}px`, filter }}
      className="w-auto"
      draggable={false}
    />
  );
}
