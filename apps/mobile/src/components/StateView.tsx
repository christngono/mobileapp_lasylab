import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Txt } from './Txt';
import { colors } from '../theme';

/** Vue de chargement centrée. */
export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.green} size="large" />
    </View>
  );
}

/** Vue d'erreur avec bouton « Réessayer ». */
export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Txt weight={700} size={15} color={colors.textMuted} align="center">
        {message}
      </Txt>
      {onRetry ? (
        <Pressable style={styles.retry} onPress={onRetry}>
          <Txt family="baloo" weight={800} size={15} color={colors.white}>
            Réessayer
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  retry: {
    backgroundColor: colors.green,
    borderBottomWidth: 4,
    borderBottomColor: colors.greenShadow,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
});
