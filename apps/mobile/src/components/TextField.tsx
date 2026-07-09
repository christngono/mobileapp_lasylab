import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Pressable,
  ViewStyle,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Txt } from './Txt';
import { colors, radius } from '../theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  labelColor?: string;
  borderColor?: string;
  /** Coins « pilule » (999) au lieu de 14. */
  pill?: boolean;
  /** Ajoute l'icône œil pour révéler le mot de passe. */
  password?: boolean;
  containerStyle?: ViewStyle;
}

/** Champ de saisie du design : label au-dessus, bordure arrondie. */
export function TextField({
  label,
  labelColor = colors.textMuted,
  borderColor = colors.border,
  pill = false,
  password = false,
  containerStyle,
  ...input
}: TextFieldProps) {
  const [hidden, setHidden] = useState(password);

  return (
    <View style={containerStyle}>
      {label ? (
        <Txt weight={800} size={13} color={labelColor} style={styles.label}>
          {label}
        </Txt>
      ) : null}
      <View style={styles.row}>
        <TextInput
          placeholderTextColor={colors.textDisabled}
          {...input}
          secureTextEntry={password ? hidden : input.secureTextEntry}
          style={[
            styles.input,
            {
              borderColor,
              borderRadius: pill ? radius.pill : radius.input,
              paddingRight: password ? 46 : 16,
            },
          ]}
        />
        {password ? (
          <Pressable style={styles.eye} onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path
                d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
                fill="none"
                stroke={colors.textDisabled}
                strokeWidth={1.8}
              />
              <Circle cx={12} cy={12} r={3} fill="none" stroke={colors.textDisabled} strokeWidth={1.8} />
              {!hidden ? (
                <Path d="M4 4l16 16" stroke={colors.textDisabled} strokeWidth={1.8} strokeLinecap="round" />
              ) : null}
            </Svg>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginLeft: 6, marginBottom: 5 },
  row: { position: 'relative', justifyContent: 'center' },
  input: {
    width: '100%',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.ink,
  },
  eye: { position: 'absolute', right: 16 },
});
