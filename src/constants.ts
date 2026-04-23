/** Milliseconds of pointer inactivity after lifting the finger before the
 *  current canvas content is captured as a letter and the canvas is cleared. */
export const LETTER_SAVE_DELAY_MS = 500;

/** localStorage key for session persistence. */
export const STORAGE_KEY = 'cwcopy-session';

/** Padding (px) added around the bounding box when cropping a letter image. */
export const CANVAS_CROP_PADDING = 8;

/**
 * Vertical position of the baseline as a fraction of the canvas height.
 * Used both for the CSS reference line overlay and to record where the
 * baseline falls inside each captured letter image.
 */
export const BASELINE_FRACTION = 0.62;
