/**
 * Typographie Lasylab — deux familles issues du design :
 *  - Baloo 2 : titres, boutons, chiffres (arrondie, chaleureuse)
 *  - Nunito  : corps de texte, libellés
 *
 * Les noms de police ci-dessous correspondent aux fichiers chargés via
 * expo-font (voir src/theme/fonts.ts). React Native ne gère pas les poids
 * numériques comme le web : on mappe chaque poids sur une variante nommée.
 */

export const fonts = {
  baloo: {
    500: 'Baloo2_500Medium',
    600: 'Baloo2_600SemiBold',
    700: 'Baloo2_700Bold',
    800: 'Baloo2_800ExtraBold',
  },
  nunito: {
    400: 'Nunito_400Regular',
    600: 'Nunito_600SemiBold',
    700: 'Nunito_700Bold',
    800: 'Nunito_800ExtraBold',
    900: 'Nunito_900Black',
  },
} as const;

/**
 * Styles de texte réutilisables, calqués sur les usages récurrents du mock.
 * (taille / interligne repris tels quels du design.)
 */
export const textStyles = {
  // Titres Baloo 2
  splashDots: { fontFamily: fonts.nunito[800], fontSize: 12, letterSpacing: 0.6 },
  h1: { fontFamily: fonts.baloo[800], fontSize: 27 },
  h1Login: { fontFamily: fonts.baloo[800], fontSize: 30 },
  h2: { fontFamily: fonts.baloo[800], fontSize: 25 },
  screenTitle: { fontFamily: fonts.baloo[800], fontSize: 19 },
  cardTitle: { fontFamily: fonts.baloo[800], fontSize: 21 },
  storyTitle: { fontFamily: fonts.baloo[800], fontSize: 32 },

  // Boutons
  buttonLg: { fontFamily: fonts.baloo[800], fontSize: 19 },
  buttonMd: { fontFamily: fonts.baloo[800], fontSize: 17 },

  // Corps Nunito
  body: { fontFamily: fonts.nunito[700], fontSize: 15 },
  bodyStrong: { fontFamily: fonts.nunito[800], fontSize: 18 },
  label: { fontFamily: fonts.nunito[800], fontSize: 13 },
  caption: { fontFamily: fonts.nunito[700], fontSize: 12 },
  chip: { fontFamily: fonts.nunito[800], fontSize: 13 },
  stat: { fontFamily: fonts.baloo[800], fontSize: 22 },
  sectionHeader: { fontFamily: fonts.nunito[800], fontSize: 14, letterSpacing: 0.84 },
} as const;
