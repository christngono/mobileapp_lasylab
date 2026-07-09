import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Txt } from './Txt';
import { colors, radius } from '../theme';

interface PillProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  /** Couleur de fond quand sélectionné (défaut : teinte bleue). */
  activeBg?: string;
  activeColor?: string;
  style?: ViewStyle;
}

/**
 * Pastille cliquable (choix de classe/objectif, chips, filtres) reprenant le
 * style sélectionné/non-sélectionné du design.
 */
export function Pill({
  label,
  onPress,
  selected = false,
  activeBg = colors.blueTintSoft,
  activeColor = colors.blueText,
  style,
}: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        selected
          ? { backgroundColor: activeBg, borderColor: colors.blueBorder }
          : { backgroundColor: colors.white, borderColor: colors.borderSoft },
        style,
      ]}
    >
      <Txt
        family="baloo"
        weight={700}
        size={16}
        color={selected ? activeColor : colors.inkBody}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 64,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radius.button,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
