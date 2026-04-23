import { type CSSProperties } from 'react';
import { theme, hex } from '../theme';

interface StyledSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  darkMode: boolean;
}

export function StyledSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  darkMode,
}: StyledSliderProps) {
  const t = darkMode ? theme.dark : theme.light;
  const h = darkMode ? hex.dark : hex.light;
  const sliderThumb = h.sliderThumb;
  const sliderPassive = h.sliderTrack;
  const sliderFill = ((value - min) / (max - min)) * 100;
  const sliderStyle = {
    background: `linear-gradient(to right, ${sliderThumb} ${sliderFill}%, ${sliderPassive} ${sliderFill}%)`,
    '--slider-thumb': sliderThumb,
    '--slider-passive': sliderPassive,
  } as CSSProperties;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 border-t shrink-0 ${t.border}`}>
      <span className={`text-xs shrink-0 ${t.labelText}`}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 styled-range"
        style={sliderStyle}
        aria-label={label}
      />
      <span className={`text-xs w-8 text-right tabular-nums shrink-0 ${t.labelText}`}>
        {formatValue(value)}
      </span>
    </div>
  );
}
