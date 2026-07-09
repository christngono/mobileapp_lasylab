import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from './src/theme';

/**
 * Écran de vérification de l'étape 1 (setup).
 * Il affiche le logo et un échantillon des tokens de couleur pour confirmer
 * que le thème et les assets se chargent correctement.
 * La navigation et les 17 écrans arrivent à partir de l'étape 4.
 */
export default function App() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Setup — étape 1</Text>
      <Text style={styles.subtitle}>Monorepo · thème · assets OK</Text>

      <View style={styles.swatchRow}>
        {[colors.green, colors.blue, colors.brand, colors.yellow, colors.purple, colors.teal].map(
          (c) => (
            <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.screen,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  logo: { width: 200, height: 60 },
  title: { fontSize: 20, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 14, color: colors.textMuted },
  swatchRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  swatch: { width: 34, height: 34, borderRadius: radius.sm },
});
