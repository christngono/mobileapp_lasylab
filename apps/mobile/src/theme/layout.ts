import { colors } from './colors';

/** Rayons d'arrondi récurrents dans le design. */
export const radius = {
  sm: 8,
  input: 14,
  button: 16,
  buttonLg: 18,
  card: 20,
  cardLg: 26,
  cardXl: 30,
  pill: 999,
  full: 9999,
} as const;

/** Espacements de base. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 26,
} as const;

/**
 * Ombres portées. Sur le web le design utilise des box-shadow douces ;
 * on les transpose en élévation React Native (iOS shadow* + Android elevation).
 */
export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  soft: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
} as const;

/**
 * Effet "bouton 3D" du design (border-bottom épais plus foncé).
 * En RN on le reproduit avec une bordure basse colorée.
 */
export function button3d(shadowColor: string, size = 5) {
  return {
    borderBottomWidth: size,
    borderBottomColor: shadowColor,
  };
}
