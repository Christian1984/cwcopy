/**
 * Central theme tokens. All color values live here — no magic strings in
 * components. Tailwind v4 scans this file for class names automatically.
 */

// ── Tailwind class tokens ─────────────────────────────────────────────────────

export const theme = {
  dark: {
    /** Main surface: nav, sidebars, control bars */
    surface: 'bg-gray-900',
    /** Drawing canvas background */
    canvas: 'bg-black',
    /** Standard border */
    border: 'border-gray-500',
    /** Dashed baseline rule inside the canvas */
    baselineBorder: 'border-gray-500',
    /** Secondary / label text */
    labelText: 'text-gray-400',
    /** Primary text (nav title, etc.) */
    titleText: 'text-gray-400',
    /** Dark-mode toggle switch track */
    toggleTrack: 'bg-gray-600',
    /** Dark-mode toggle switch dot */
    toggleDot: 'bg-gray-400',
    /** Focus ring on the toggle */
    toggleFocusRing: 'ring-gray-500',
  },
  light: {
    surface: 'bg-amber-50',
    canvas: 'bg-amber-50',
    border: 'border-gray-800',
    baselineBorder: 'border-gray-300',
    labelText: 'text-gray-500',
    titleText: 'text-gray-900',
    toggleTrack: 'bg-gray-300',
    toggleDot: 'bg-white',
    toggleFocusRing: 'ring-gray-400',
  },
} as const;

// ── Hex values for canvas / inline styles ─────────────────────────────────────

export const hex = {
  dark: {
    /** Canvas stroke color */
    stroke: '#9ca3af',
    /** Slider filled-track / thumb color */
    sliderThumb: '#9ca3af',
    /** Slider passive (unfilled) track */
    sliderTrack: '#374151',
  },
  light: {
    stroke: '#1a1a1a',
    sliderThumb: '#2563eb',
    sliderTrack: '#e5e7eb',
  },
} as const;

// ── Button variant classes ────────────────────────────────────────────────────

export const buttonVariants = {
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
} as const;
