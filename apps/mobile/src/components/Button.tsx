import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Txt } from './Txt';
import { colors, radius } from '../theme';

type Variant = 'green' | 'blue' | 'yellow' | 'secondary';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  /** Rayon "pilule" (999) au lieu du rayon bouton (18). */
  pill?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const VARIANTS: Record<
  Variant,
  { bg: string; shadow: string; color: string; border?: string }
> = {
  green: { bg: colors.green, shadow: colors.greenShadow, color: colors.white },
  blue: { bg: colors.blue, shadow: colors.blueShadow, color: colors.white },
  yellow: { bg: colors.yellow, shadow: colors.yellowShadow, color: colors.inkStrong },
  secondary: { bg: colors.white, shadow: '#e5dccf', color: colors.green, border: '#eee5da' },
};

/**
 * Bouton principal du design : pastille arrondie avec liseré bas plus foncé
 * (effet 3D). Reproduit les CTA verts/bleus/jaunes et le bouton secondaire.
 */
export function Button({
  label,
  onPress,
  variant = 'green',
  pill = false,
  disabled = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const v: { bg: string; shadow: string; color: string; border?: string } = disabled
    ? { bg: colors.borderSoft, shadow: '#d8d4ce', color: colors.white }
    : VARIANTS[variant];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderBottomColor: v.shadow,
          borderRadius: pill ? radius.pill : radius.buttonLg,
        },
        v.border ? { borderWidth: 2, borderColor: v.border } : null,
        fullWidth ? styles.full : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <View style={styles.inner}>
        <Txt family="baloo" weight={800} size={18} color={v.color} align="center">
          {label}
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { width: '100%' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 3,
    marginBottom: 2,
  },
});
