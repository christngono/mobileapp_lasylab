import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface ScreenProps {
  children: ReactNode;
  /** Fond : couleur unie de l'écran (défaut) ou dégradé de fond de l'app. */
  variant?: 'screen' | 'appGradient' | 'plain';
  /** Couleur de fond personnalisée (prioritaire sur variant). */
  background?: string;
  edges?: Edge[];
  style?: ViewStyle;
  padded?: boolean;
}

/**
 * Conteneur d'écran avec zone sûre. Reproduit le fond des écrans du design
 * (#fbf4ef) ou le dégradé de fond de l'app.
 */
export function Screen({
  children,
  variant = 'screen',
  background,
  edges = ['top', 'bottom'],
  style,
  padded = false,
}: ScreenProps) {
  const content = (
    <SafeAreaView style={[styles.safe, padded && styles.padded, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );

  if (variant === 'appGradient') {
    return (
      <LinearGradient colors={[colors.appBgTop, colors.appBgBottom] as const} style={styles.fill}>
        {content}
      </LinearGradient>
    );
  }

  const bg = background ?? (variant === 'plain' ? colors.white : colors.screen);
  return <View style={[styles.fill, { backgroundColor: bg }]}>{content}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  safe: { flex: 1 },
  padded: { paddingHorizontal: 16 },
});
