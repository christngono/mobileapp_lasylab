import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { lessonsApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { Screen, Txt, CloseIcon, PlayIcon, LoadingView, ErrorView } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

/** Leçon en mode « stories » : diapositives grand format, puis passage au cours. */
export default function LessonScreen({ navigation, route }: Props) {
  const { subjectId, nodeIndex } = route.params;
  const { data, loading, error, reload } = useAsync(
    () => lessonsApi.lesson(subjectId, nodeIndex),
    [subjectId, nodeIndex],
  );
  const [seg, setSeg] = useState(0);

  const slides = data?.slides ?? [];
  const header = nodeIndex === 0 ? 'Introduction' : `Leçon ${nodeIndex / 2}`;

  const next = () => {
    if (seg >= slides.length - 1) {
      // Dernière diapositive : on passe au cours détaillé.
      navigation.replace('Cours', { subjectId, nodeIndex });
    } else {
      setSeg((s) => s + 1);
    }
  };

  if (loading && !data) {
    return (
      <Screen background="#29ABE2">
        <LoadingView />
      </Screen>
    );
  }
  if ((error && !data) || slides.length === 0) {
    return (
      <Screen background="#29ABE2">
        <ErrorView message={error ?? 'Leçon indisponible.'} onRetry={reload} />
      </Screen>
    );
  }

  const slide = slides[Math.min(seg, slides.length - 1)];

  return (
    <Screen background="#29ABE2">
      <View style={styles.head}>
        <Pressable style={styles.close} onPress={() => navigation.goBack()} hitSlop={8}>
          <CloseIcon size={26} color={colors.white} />
        </Pressable>
        <Txt family="baloo" weight={800} size={16} color={colors.white}>
          {header}
        </Txt>
      </View>

      {/* Segments de progression */}
      <View style={styles.segs}>
        {slides.map((_, i) => (
          <View key={i} style={styles.segTrack}>
            <View style={[styles.segFill, { width: i <= seg ? '100%' : '0%' }]} />
          </View>
        ))}
        <View style={styles.segDot} />
      </View>

      {/* Zone de contenu (tap pour avancer) */}
      <Pressable style={styles.body} onPress={next}>
        <View style={styles.playCircle}>
          <PlayIcon size={44} color={colors.white} />
        </View>
        <Txt family="baloo" weight={800} size={34} color={colors.white} align="center" lineHeight={38} style={styles.big}>
          {slide.big}
        </Txt>
        <Txt weight={700} size={18} color="rgba(255,255,255,.92)" align="center" lineHeight={27} style={styles.sub}>
          {slide.sub}
        </Txt>
      </Pressable>

      {/* Bas : corrections + bouton suivant */}
      <View style={styles.footer}>
        <View style={styles.corrections}>
          <Svg width={30} height={26} viewBox="0 0 30 26">
            <Path
              d="M15 2l11 10M15 2L4 12M15 10l11 10M15 10L4 20"
              fill="none"
              stroke="#F6A623"
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Txt weight={800} size={10} color="#8a857c" style={styles.corrText}>
            CORRECTIONS
          </Txt>
        </View>
        <Pressable style={styles.fab} onPress={next}>
          <Svg width={30} height={30} viewBox="0 0 24 24">
            <Path
              d="M12 4v14M6 12l6 6 6-6"
              fill="none"
              stroke={colors.white}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  close: { position: 'absolute', left: 16 },
  segs: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 6 },
  segTrack: { flex: 1, height: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.35)', overflow: 'hidden' },
  segFill: { height: '100%', borderRadius: 999, backgroundColor: colors.yellow },
  segDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.green, borderWidth: 3, borderColor: colors.white },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  playCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  big: { marginBottom: 18 },
  sub: { maxWidth: 300 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  corrections: {
    width: 96,
    height: 64,
    backgroundColor: colors.white,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  corrText: { marginTop: 2 },
  fab: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.yellow,
    borderBottomWidth: 5,
    borderBottomColor: colors.yellowShadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
