import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { SubjectId } from '@lasylab/shared';

/** Icônes de matières reprises fidèlement du design (Études). */
export function SubjectIcon({ id, size = 46 }: { id: SubjectId; size?: number }) {
  switch (id) {
    case 'maths':
      return (
        <Svg width={size} height={size} viewBox="0 0 46 46">
          <Circle cx={23} cy={23} r={22} fill="#FDE3DE" />
          <SvgText x={14} y={21} fontFamily="Baloo2_800ExtraBold" fontSize={15} fill="#E8412B">+</SvgText>
          <SvgText x={27} y={21} fontFamily="Baloo2_800ExtraBold" fontSize={15} fill="#E8412B">−</SvgText>
          <SvgText x={13} y={36} fontFamily="Baloo2_800ExtraBold" fontSize={15} fill="#E8412B">×</SvgText>
          <SvgText x={27} y={36} fontFamily="Baloo2_800ExtraBold" fontSize={15} fill="#E8412B">÷</SvgText>
        </Svg>
      );
    case 'francais':
      return (
        <Svg width={size} height={size} viewBox="0 0 46 46">
          <Rect x={8} y={10} width={30} height={26} rx={4} fill="#39B6E8" />
          <Rect x={14} y={15} width={18} height={16} rx={2} fill="#fff" />
          <SvgText x={16} y={28} fontFamily="Baloo2_800ExtraBold" fontSize={13} fill="#E8412B">Aa</SvgText>
        </Svg>
      );
    case 'svt':
      return (
        <Svg width={(size * 42) / 46} height={size} viewBox="0 0 42 46">
          <Path
            d="M17 6h8v13l9 17a4 4 0 01-3.6 6H11.6A4 4 0 018 36l9-17z"
            fill="none"
            stroke="#3a9e2e"
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          <Path d="M14 27h14l5 8a3 3 0 01-2.7 4.5H11.7A3 3 0 019 35z" fill="#5BC406" />
          <Circle cx={18} cy={34} r={1.7} fill="#fff" />
          <Circle cx={25} cy={37} r={1.4} fill="#fff" />
        </Svg>
      );
    case 'philosophie':
      return (
        <Svg width={size} height={size} viewBox="0 0 46 46">
          <Rect x={9} y={9} width={22} height={28} rx={3} fill="#F6A623" transform="rotate(-8 20 23)" />
          <Rect x={15} y={10} width={22} height={28} rx={3} fill="#FFD37A" stroke="#F6A623" strokeWidth={1.5} transform="rotate(6 26 24)" />
          <Path d="M20 19h13M20 24h13M20 29h9" stroke="#fff" strokeWidth={2} strokeLinecap="round" transform="rotate(6 26 24)" />
        </Svg>
      );
    case 'informatique':
      return (
        <Svg width={(size * 48) / 44} height={size} viewBox="0 0 48 44">
          <Rect x={7} y={6} width={34} height={24} rx={3} fill="#7C6FE8" />
          <Rect x={11} y={10} width={26} height={16} rx={1.5} fill="#fff" />
          <Path d="M16 15l4 3-4 3M23 21h7" stroke="#7C6FE8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Rect x={19} y={30} width={10} height={6} fill="#7C6FE8" />
          <Rect x={14} y={36} width={20} height={3.5} rx={1.7} fill="#7C6FE8" />
        </Svg>
      );
    case 'anglais':
      return (
        <Svg width={size} height={(size * 34) / 50} viewBox="0 0 50 34">
          <Rect width={50} height={34} rx={4} fill="#2b4c8a" />
          <Path d="M0 0l50 34M50 0L0 34" stroke="#fff" strokeWidth={5} />
          <Path d="M0 0l50 34M50 0L0 34" stroke="#E8412B" strokeWidth={2.4} />
          <Path d="M25 0v34M0 17h50" stroke="#fff" strokeWidth={9} />
          <Path d="M25 0v34M0 17h50" stroke="#E8412B" strokeWidth={5} />
        </Svg>
      );
    default:
      return null;
  }
}
