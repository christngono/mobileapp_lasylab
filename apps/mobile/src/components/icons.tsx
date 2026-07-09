import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme';

interface IconProps {
  size?: number;
  color?: string;
}

/** Chevron « retour » (flèche gauche) — repris des en-têtes du design. */
export function BackIcon({ size = 24, color = colors.textDisabled }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Croix « fermer ». */
export function CloseIcon({ size = 24, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

/** Chevron bas (sélecteurs, accordéons). */
export function ChevronDown({ size = 18, color = colors.textDisabled }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Étoile de série (streak). */
export function StarIcon({ size = 22, color = colors.yellow, stroke = colors.yellowDeep }: IconProps & { stroke?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z"
        fill={color}
        stroke={stroke}
        strokeWidth={1}
      />
    </Svg>
  );
}

/** Gemme (monnaie de l'app). */
export function GemIcon({ size = 18, color = colors.redOrange }: IconProps) {
  return (
    <Svg width={size} height={(size * 20) / 18} viewBox="0 0 18 20">
      <Path d="M9 0l9 6-3.4 11H3.4L0 6z" fill="#EF4B33" />
      <Path d="M9 0l9 6-4 4-5-5z" fill="#F76B55" opacity={0.6} />
    </Svg>
  );
}

/** Icône « Études » (maison) pour la barre de navigation. */
export function HomeIcon({ size = 27, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 19V9l8-5 8 5v10a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"
        fill="none"
        stroke={color ?? colors.textDisabled}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Icône « Épreuves-exo » (liste). */
export function TasksIcon({ size = 27, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={5} y={3} width={14} height={18} rx={2} fill="none" stroke={color ?? colors.textDisabled} strokeWidth={2} />
      <Path d="M9 8h6M9 12h6M9 16h3" stroke={color ?? colors.textDisabled} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Icône « Lasy IA » (bulle de chat). */
export function ChatIcon({ size = 27, color }: IconProps) {
  const c = color ?? colors.textDisabled;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H9l-5 4V6a1 1 0 011-1z"
        fill="none"
        stroke={c}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={9} cy={11} r={1.3} fill={c} />
      <Circle cx={13} cy={11} r={1.3} fill={c} />
      <Circle cx={17} cy={11} r={1.3} fill={c} />
    </Svg>
  );
}

/** Icône « Status » (cercle lecture). */
export function StatusIcon({ size = 27, color }: IconProps) {
  const c = color ?? colors.textDisabled;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} fill="none" stroke={c} strokeWidth={2} strokeDasharray="3 3" />
      <Path d="M10 9l5 3-5 3z" fill={c} />
    </Svg>
  );
}

/** Flèche « envoyer » (chat). */
export function SendIcon({ size = 22, color = colors.white }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 11l18-8-8 18-2.5-7.5z" fill={color} />
    </Svg>
  );
}

/** Triangle « play » (leçons/stories). */
export function PlayIcon({ size = 30, color = colors.white }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8 5v14l11-7z" fill={color} />
    </Svg>
  );
}

/** Coche de validation. */
export function CheckIcon({ size = 30, color = colors.white }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 13l4 4 10-10"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
