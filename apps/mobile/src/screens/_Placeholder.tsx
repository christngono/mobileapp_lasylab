import { View, StyleSheet } from 'react-native';
import { Screen, Txt, Logo } from '../components';
import { colors } from '../theme';

/**
 * Écran temporaire affiché tant que le contenu réel n'est pas implémenté.
 * Remplacé progressivement aux étapes 5 à 10.
 */
export function Placeholder({ title, note }: { title: string; note?: string }) {
  return (
    <Screen>
      <View style={styles.center}>
        <Logo height={30} />
        <Txt family="baloo" weight={800} size={24} color={colors.ink} align="center" style={styles.title}>
          {title}
        </Txt>
        <Txt weight={700} size={14} color={colors.textMuted} align="center">
          {note ?? 'Écran à venir'}
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { marginTop: 8 },
});
