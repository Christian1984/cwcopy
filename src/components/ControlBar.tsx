import { useApp } from '../state/AppContext';

export type ButtonVariant = 'primary' | 'confirm' | 'secondary' | 'danger';

export interface BarButtonDef {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
}

interface Props {
  buttons: BarButtonDef[];
}

const VARIANTS: Record<ButtonVariant, { dark: string; light: string }> = {
  primary: {
    dark: 'bg-blue-950 hover:bg-blue-900 text-gray-400',
    light: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
  confirm: {
    dark: 'bg-emerald-950 hover:bg-emerald-900 text-gray-400',
    light: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  },
  secondary: {
    dark: 'bg-gray-800 hover:bg-gray-700 text-gray-400',
    light: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  },
  danger: {
    dark: 'bg-red-950 hover:bg-red-900 text-gray-400',
    light: 'bg-red-100 hover:bg-red-200 text-red-800',
  },
};

export function ControlBar({ buttons }: Props) {
  const { state } = useApp();

  return (
    <div
      className={`flex gap-4 px-4 py-4 shrink-0 border-t ${
        state.darkMode ? 'bg-gray-900 border-gray-500' : 'bg-amber-50 border-gray-800'
      }`}
    >
      {buttons.map((btn) => {
        const colors = VARIANTS[btn.variant];
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
