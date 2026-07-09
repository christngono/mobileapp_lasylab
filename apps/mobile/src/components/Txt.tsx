import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

type Family = 'baloo' | 'nunito';
type BalooWeight = 500 | 600 | 700 | 800;
type NunitoWeight = 400 | 600 | 700 | 800 | 900;

interface TxtProps extends TextProps {
  /** Famille de police (défaut : nunito). */
  family?: Family;
  /** Poids — doit exister pour la famille choisie. */
  weight?: BalooWeight | NunitoWeight;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
}

/**
 * Texte de base de l'app : applique la bonne fontFamily (Baloo 2 / Nunito)
 * selon famille + poids, comme dans le design. RN ne gère pas les poids
 * numériques, on mappe donc vers les variantes nommées chargées.
 */
export function Txt({
  family = 'nunito',
  weight,
  size = 15,
  color = colors.ink,
  align,
  letterSpacing,
  lineHeight,
  style,
  ...rest
}: TxtProps) {
  const table = fonts[family] as Record<number, string>;
  const w = weight ?? (family === 'baloo' ? 700 : 700);
  const fontFamily = table[w] ?? table[family === 'baloo' ? 700 : 700];

  return (
    <Text
      {...rest}
      style={[
        styles.base,
        { fontFamily, fontSize: size, color },
        align ? { textAlign: align } : null,
        letterSpacing != null ? { letterSpacing } : null,
        lineHeight != null ? { lineHeight } : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
