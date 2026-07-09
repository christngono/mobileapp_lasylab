import { Image, ImageStyle, StyleProp } from 'react-native';

const LOGO = require('../../assets/logo.png');
const MASCOT = require('../../assets/mascot.png');

/** Logo Lasylab. `height` fixe la hauteur, la largeur suit le ratio. */
export function Logo({ height = 34, style }: { height?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={LOGO}
      resizeMode="contain"
      style={[{ height, width: height * 5.6 }, style]}
    />
  );
}

/** Mascotte Lasylab (le personnage « Lasy »). */
export function Mascot({ size = 120, style }: { size?: number; style?: StyleProp<ImageStyle> }) {
  return (
    <Image source={MASCOT} resizeMode="contain" style={[{ width: size, height: size }, style]} />
  );
}
