import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  /** Rayon d'arrondi (défaut : grande carte 30). */
  rounded?: number;
  padded?: boolean;
}

/** Carte blanche arrondie avec ombre douce, omniprésente dans le design. */
export function Card({ children, style, rounded = radius.cardXl, padded = true }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { borderRadius: rounded },
        padded && styles.padded,
        shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface },
  padded: { padding: 22 },
});
