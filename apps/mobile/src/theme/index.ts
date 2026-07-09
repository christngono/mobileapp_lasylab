export { colors } from './colors';
export type { ColorToken } from './colors';
export { fonts, textStyles } from './typography';
export { radius, spacing, shadows, button3d } from './layout';
export { useAppFonts } from './fonts';

import { colors } from './colors';
import { fonts, textStyles } from './typography';
import { radius, spacing, shadows } from './layout';

/** Objet thème agrégé, pratique à passer en contexte plus tard. */
export const theme = {
  colors,
  fonts,
  textStyles,
  radius,
  spacing,
  shadows,
} as const;

export type Theme = typeof theme;
