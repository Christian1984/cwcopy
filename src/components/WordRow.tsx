import type { Word } from '../state/types';
import { LetterImage } from './LetterImage';

interface Props {
  word: Word;
}

export function WordRow({ word }: Props) {
  return (
    <div className="flex flex-row flex-wrap items-end gap-0.5">
      {word.letters.map((letter) => (
        <LetterImage key={letter.id} letter={letter} />
      ))}
    </div>
  );
}
