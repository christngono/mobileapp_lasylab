/**
 * Chargement des polices via expo-font.
 * Les paquets @expo-google-fonts/baloo-2 et @expo-google-fonts/nunito
 * fournissent les fichiers .ttf ; on les ajoutera aux dépendances à
 * l'étape 4 (fondations UI) en même temps que le hook useFonts.
 *
 * On centralise ici la map nom -> module pour qu'un seul endroit décrive
 * les variantes réellement utilisées (voir typography.ts).
 */
export const fontModules = {
  Baloo2_500Medium: '@expo-google-fonts/baloo-2/Baloo2_500Medium.ttf',
  Baloo2_600SemiBold: '@expo-google-fonts/baloo-2/Baloo2_600SemiBold.ttf',
  Baloo2_700Bold: '@expo-google-fonts/baloo-2/Baloo2_700Bold.ttf',
  Baloo2_800ExtraBold: '@expo-google-fonts/baloo-2/Baloo2_800ExtraBold.ttf',
  Nunito_400Regular: '@expo-google-fonts/nunito/Nunito_400Regular.ttf',
  Nunito_600SemiBold: '@expo-google-fonts/nunito/Nunito_600SemiBold.ttf',
  Nunito_700Bold: '@expo-google-fonts/nunito/Nunito_700Bold.ttf',
  Nunito_800ExtraBold: '@expo-google-fonts/nunito/Nunito_800ExtraBold.ttf',
  Nunito_900Black: '@expo-google-fonts/nunito/Nunito_900Black.ttf',
} as const;
