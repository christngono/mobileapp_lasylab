import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

interface ProgressBarProps {
  /** Valeur de 0 à 1. */
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
}

/** Barre de progression arrondie (leçons, quiz, profil). */
export function ProgressBar({
  value,
  height = 11,
  color = colors.green,
  trackColor = colors.border,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: radius.pill }]}>
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
});
