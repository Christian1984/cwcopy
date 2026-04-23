import type { LetterImage as LetterImageType } from '../state/types';

interface Props {
  letter: LetterImageType;
}

export function LetterImage({ letter }: Props) {
  return (
    <img
      src={letter.dataUrl}
      alt="drawn letter"
      className="h-16 w-auto rounded"
      draggable={false}
    />
  );
}
