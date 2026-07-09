import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

interface ProgressRingProps {
  size: number;
  strokeWidth?: number;
  /** Fraction remplie, de 0 à 1. */
  progress: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
}

/**
 * Anneau de progression circulaire (approxime le conic-gradient du design).
 * Le contenu (icône matière) est centré à l'intérieur.
 */
export function ProgressRing({
  size,
  strokeWidth = 9,
  progress,
  color = colors.green,
  trackColor = colors.border,
  children,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const dash = c * clamped;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {clamped > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            // Démarre en haut (rotation -90°).
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
