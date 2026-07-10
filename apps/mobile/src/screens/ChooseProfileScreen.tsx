import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { UserRole } from '@lasylab/shared';
import { Screen, Logo, Txt, BackIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseProfile'>;

function StudentAvatar() {
  return (
    <Svg width={70} height={82} viewBox="0 0 78 92">
      <Circle cx={39} cy={30} r={20} fill="#6b4a36" />
      <Circle cx={39} cy={34} r={15} fill="#c98a63" />
      <Circle cx={33} cy={34} r={2.4} fill="#2b2b2b" />
      <Circle cx={45} cy={34} r={2.4} fill="#2b2b2b" />
      <Path d="M22 92c0-13 8-22 17-22s17 9 17 22z" fill="#F19DA6" />
    </Svg>
  );
}

function TeacherAvatar() {
  return (
    <Svg width={76} height={82} viewBox="0 0 84 92">
      {/* tableau */}
      <Rect x={2} y={6} width={44} height={30} rx={3} fill="#2f5d3a" />
      <Path d="M8 14h30M8 20h22M8 26h26" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      {/* personne */}
      <Circle cx={60} cy={34} r={16} fill="#5a3c2c" />
      <Circle cx={60} cy={37} r={12} fill="#c98a63" />
      <Circle cx={55} cy={37} r={1.8} fill="#2b2b2b" />
      <Circle cx={65} cy={37} r={1.8} fill="#2b2b2b" />
      <Path d="M42 92c0-12 8-22 18-22s18 10 18 22z" fill="#3aa0c4" />
    </Svg>
  );
}

function ParentAvatar() {
  return (
    <Svg width={82} height={82} viewBox="0 0 92 92">
      <Circle cx={35} cy={35} r={13} fill="#a86b4a" />
      <Circle cx={30} cy={35} r={2} fill="#2b2b2b" />
      <Circle cx={40} cy={35} r={2} fill="#2b2b2b" />
      <Path d="M16 92c0-12 8-20 19-20s19 8 19 20z" fill="#2f5d8a" />
      <Circle cx={66} cy={46} r={10} fill="#c98a63" />
      <Circle cx={62.5} cy={46} r={1.7} fill="#2b2b2b" />
      <Circle cx={69.5} cy={46} r={1.7} fill="#2b2b2b" />
      <Path d="M52 92c0-9 6-15 14-15s14 6 14 15z" fill="#E8826F" />
    </Svg>
  );
}

const ROLES: {
  role: UserRole;
  label: string;
  colors: readonly [string, string];
  border: string;
  Avatar: ComponentType;
}[] = [
  { role: 'student', label: 'Élève', colors: ['#FDEBE0', '#FBDCC9'], border: '#e7e3dc', Avatar: StudentAvatar },
  { role: 'teacher', label: 'Enseignant', colors: ['#E4F6EC', '#CDEBD8'], border: '#cfe7d6', Avatar: TeacherAvatar },
  { role: 'parent', label: 'Parent', colors: ['#E7F1F8', '#D3E6F2'], border: '#cfe3ef', Avatar: ParentAvatar },
];

export default function ChooseProfileScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.card}>
        <View style={styles.head}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon size={22} />
          </Pressable>
          <Logo height={34} />
        </View>
        <Txt family="baloo" weight={800} size={26} color={colors.inkTitle} align="center" style={styles.h1}>
          Qui es-tu ?
        </Txt>
        <Txt weight={700} size={15} color={colors.textMuted} align="center" lineHeight={21} style={styles.sub}>
          Choisis ton profil pour{'\n'}personnaliser ton expérience
        </Txt>

        <View style={styles.choices}>
          {ROLES.map(({ role, label, colors: grad, border, Avatar }) => (
            <Pressable
              key={role}
              style={styles.choice}
              onPress={() => navigation.navigate('Inscription', { role })}
            >
              <LinearGradient colors={grad} style={[styles.avatar, { borderColor: border }]}>
                <Avatar />
              </LinearGradient>
              <Txt family="baloo" weight={800} size={15} color="#4a4a4a">
                {label}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <Txt weight={700} size={14} color={colors.textMutedAlt} align="center" style={styles.footer}>
        Tu as déjà un compte?{' '}
        <Txt weight={800} size={14} color={colors.inkTitle} onPress={() => navigation.navigate('Connexion')}>
          Connecte-toi!
        </Txt>
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 14, backgroundColor: colors.white, borderRadius: radius.cardXl, padding: 26 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  back: { position: 'absolute', left: 0 },
  h1: { marginTop: 6, marginBottom: 4 },
  sub: { marginBottom: 30 },
  choices: { gap: 16 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.cardLg,
    borderWidth: 2,
    borderColor: colors.borderSoft,
    backgroundColor: '#fdfcfa',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  footer: { marginVertical: 14 },
});
