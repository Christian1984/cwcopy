import { useApp } from '../state/AppContext';
import { theme, buttonVariants } from '../theme';

export type ButtonVariant = 'primary' | 'confirm' | 'secondary' | 'danger';

export interface BarButtonDef {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
}

interface Props {
  buttons: BarButtonDef[];
}


export function ControlBar({ buttons }: Props) {
  const { state } = useApp();
  const t = state.darkMode ? theme.dark : theme.light;

  return (
    <div className={`flex gap-4 px-4 py-4 shrink-0 border-t ${t.surface} ${t.border}`}>
      {buttons.map((btn) => {
        const colors = buttonVariants[btn.variant];
        return (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={`flex-1 py-4 rounded-2xl text-lg font-medium transition-colors active:scale-95 ${
              state.darkMode ? colors.dark : colors.light
            }`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}
