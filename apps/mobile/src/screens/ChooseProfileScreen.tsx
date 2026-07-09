import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Logo, Txt, BackIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseProfile'>;

function StudentAvatar() {
  return (
    <Svg width={78} height={92} viewBox="0 0 78 92">
      <Circle cx={39} cy={30} r={20} fill="#6b4a36" />
      <Circle cx={39} cy={34} r={15} fill="#c98a63" />
      <Circle cx={33} cy={34} r={2.4} fill="#2b2b2b" />
      <Circle cx={45} cy={34} r={2.4} fill="#2b2b2b" />
      <Circle cx={33} cy={34} r={5.4} fill="none" stroke="#2b2b2b" strokeWidth={1.4} />
      <Circle cx={45} cy={34} r={5.4} fill="none" stroke="#2b2b2b" strokeWidth={1.4} />
      <Path d="M38.4 34h1.2" stroke="#2b2b2b" strokeWidth={1.4} />
      <Path d="M22 92c0-13 8-22 17-22s17 9 17 22z" fill="#F19DA6" />
    </Svg>
  );
}

function ParentAvatar() {
  return (
    <Svg width={92} height={92} viewBox="0 0 92 92">
      <Circle cx={35} cy={32} r={18} fill="#5a3c2c" />
      <Path d="M22 30a13 13 0 0126 0z" fill="#3aa0c4" />
      <Circle cx={35} cy={35} r={13} fill="#a86b4a" />
      <Circle cx={30} cy={35} r={2} fill="#2b2b2b" />
      <Circle cx={40} cy={35} r={2} fill="#2b2b2b" />
      <Path d="M16 92c0-12 8-20 19-20s19 8 19 20z" fill="#2f5d8a" />
      <Circle cx={66} cy={44} r={13} fill="#7a4f38" />
      <Circle cx={66} cy={46} r={10} fill="#c98a63" />
      <Circle cx={62.5} cy={46} r={1.7} fill="#2b2b2b" />
      <Circle cx={69.5} cy={46} r={1.7} fill="#2b2b2b" />
      <Path d="M52 92c0-9 6-15 14-15s14 6 14 15z" fill="#E8826F" />
    </Svg>
  );
}

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
          Crée ton compte
        </Txt>
        <Txt weight={700} size={15} color={colors.textMuted} align="center" lineHeight={21} style={styles.sub}>
          Si vous abonnez votre enfant,{'\n'}choisissez le profil
        </Txt>

        <View style={styles.choices}>
          <Pressable style={styles.choice} onPress={() => navigation.navigate('ChooseClasse')}>
            <LinearGradient colors={['#FDEBE0', '#FBDCC9']} style={[styles.avatar, styles.avatarStudent]}>
              <StudentAvatar />
            </LinearGradient>
            <Txt family="baloo" weight={800} size={16} color="#4a4a4a">
              Élève
            </Txt>
          </Pressable>

          <Pressable style={styles.choice} onPress={() => navigation.navigate('ChooseClasse')}>
            <LinearGradient colors={['#E7F1F8', '#D3E6F2']} style={[styles.avatar, styles.avatarParent]}>
              <ParentAvatar />
            </LinearGradient>
            <Txt family="baloo" weight={800} size={16} color="#4a4a4a">
              Parent
            </Txt>
          </Pressable>
        </View>
      </View>

      <Txt weight={700} size={14} color={colors.textMutedAlt} align="center" style={styles.footer}>
        Tu as déjà un compte?{' '}
        <Txt
          weight={800}
          size={14}
          color={colors.inkTitle}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        >
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
  sub: { marginBottom: 26 },
  choices: { flexDirection: 'row', gap: 18, justifyContent: 'center', marginTop: 6 },
  choice: { alignItems: 'center', gap: 10 },
  avatar: {
    width: 118,
    height: 118,
    borderRadius: 22,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  avatarStudent: { borderColor: '#e7e3dc' },
  avatarParent: { borderColor: '#cfe3ef' },
  footer: { marginVertical: 14 },
});
