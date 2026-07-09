import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Logo, Mascot, Button, Txt } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  title: string;
  text: string;
  colors: readonly [string, string];
}

const SLIDES: Slide[] = [
  { title: 'Bienvenue 👋', text: 'Ton labo pour réviser autrement, à ton rythme.', colors: ['#FFC400', '#F6A623'] },
  { title: 'Apprendre', text: 'Grâce aux activités et aux quiz, progresse dans ton apprentissage.', colors: ['#39B6E8', '#1e8fc4'] },
  { title: "S'entraîner", text: "Épreuves, méthodes et exercices corrigés pour bien t'exercer.", colors: ['#7C6FE8', '#5849c4'] },
  { title: 'Progresser', text: 'Garde ta série, gagne des gemmes et suis ta progression.', colors: ['#5BC406', '#3f9a02'] },
];

function SlideIcon({ index }: { index: number }) {
  if (index === 0) return <Mascot size={150} />;
  if (index === 1)
    return (
      <Svg width={118} height={118} viewBox="0 0 24 24">
        <Path d="M12 3L2 8l10 5 8-4v6" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </Svg>
    );
  if (index === 2)
    return (
      <Svg width={112} height={112} viewBox="0 0 24 24">
        <Rect x={4} y={3} width={13} height={18} rx={2} fill="none" stroke="#fff" strokeWidth={1.6} />
        <Path d="M7 8h7M7 12h7M7 16h4" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M15 15l5-5 2.4 2.4-5 5-3 .6z" fill="#fff" opacity={0.92} />
      </Svg>
    );
  return (
    <Svg width={120} height={120} viewBox="0 0 24 24">
      <Path
        d="M12 3c1 3-1.5 4-1.5 6.5C10.5 12 12 12.5 12 12.5s1.5-.5 1.5-3C13.5 7 16 6 15 3c2 1.5 4 4.5 4 8a7 7 0 11-14 0c0-3 1.5-5 3-6 .2 2 1 3 2 3.5"
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (isLast) navigation.navigate('Inscription');
    else setIndex((i) => i + 1);
  };
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.navigate('Connexion')} hitSlop={8}>
          <Txt weight={800} size={14} color={colors.textFaint}>
            Passer
          </Txt>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Logo height={30} />
        <Txt family="baloo" weight={800} size={27} color="#3f3f3f" align="center" style={styles.title}>
          {slide.title}
        </Txt>

        <LinearGradient
          colors={slide.colors}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.circle}
        >
          <SlideIcon index={index} />
        </LinearGradient>

        <View style={{ flex: 1, minHeight: 20 }} />

        <Txt weight={800} size={18} color={colors.textMutedAlt} align="center" lineHeight={25} style={styles.text}>
          {slide.text}
        </Txt>

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setIndex(i)}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotIdle]}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <Pressable onPress={prev} hitSlop={8} disabled={index === 0}>
          <Txt weight={800} size={16} color={index === 0 ? 'transparent' : colors.textFaint}>
            Retour
          </Txt>
        </Pressable>
        <Button label={isLast ? 'Commencer' : 'Suivant'} fullWidth={false} onPress={next} style={styles.nextBtn} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 8 },
  card: {
    flex: 1,
    margin: 14,
    marginTop: 6,
    backgroundColor: colors.white,
    borderRadius: radius.cardXl,
    padding: 26,
    paddingBottom: 22,
    alignItems: 'center',
  },
  title: { marginTop: 20, marginBottom: 22 },
  circle: {
    width: 212,
    height: 212,
    borderRadius: 106,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { maxWidth: 280, marginBottom: 22 },
  dots: { flexDirection: 'row', gap: 9 },
  dot: { height: 9, borderRadius: 999 },
  dotActive: { width: 24, backgroundColor: colors.blue },
  dotIdle: { width: 9, backgroundColor: '#dcd6cc' },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingBottom: 22,
  },
  nextBtn: { paddingHorizontal: 30 },
});
