import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { lessonsApi, progressApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { Screen, Txt, Button, CloseIcon, PlayIcon, LoadingView, ErrorView } from '../components';
import { colors, radius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Cours'>;

export default function CoursScreen({ navigation, route }: Props) {
  const { subjectId, nodeIndex } = route.params;
  const { data, loading, error, reload } = useAsync(
    () => lessonsApi.lesson(subjectId, nodeIndex),
    [subjectId, nodeIndex],
  );
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);

  const title = data?.title ?? (nodeIndex === 0 ? 'Cours introduction' : `Cours · Leçon ${nodeIndex / 2}`);

  const goQuiz = () => navigation.navigate('Quiz', { subjectId, nodeIndex: nodeIndex + 1 });
  const nextLesson = async () => {
    setBusy(true);
    try {
      await progressApi.complete(subjectId, nodeIndex);
    } catch {
      // On revient au parcours même si l'enregistrement échoue.
    } finally {
      setBusy(false);
      navigation.goBack();
    }
  };

  const paragraphs = data?.body
    ? data.body.split('\n').filter((l) => l.length > 0)
    : (data?.slides ?? []).map((s) => `${s.big} — ${s.sub}`);

  return (
    <Screen>
      <View style={styles.head}>
        <Pressable style={styles.close} onPress={() => navigation.goBack()} hitSlop={8}>
          <CloseIcon size={26} color={colors.ink} />
        </Pressable>
        <Txt family="baloo" weight={800} size={19} color={colors.inkStrong}>
          {title}
        </Txt>
      </View>

      {loading && !data ? (
        <LoadingView />
      ) : error && !data ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              {/* Vidéo (placeholder interactif) */}
              <Pressable onPress={() => setPlaying((p) => !p)}>
                <LinearGradient colors={['#29ABE2', '#1e7fb0']} style={styles.video}>
                  <View style={styles.videoBtn}>
                    {playing ? (
                      <Svg width={24} height={24} viewBox="0 0 24 24">
                        <Rect x={6} y={5} width={4} height={14} rx={1.4} fill="#1e7fb0" />
                        <Rect x={14} y={5} width={4} height={14} rx={1.4} fill="#1e7fb0" />
                      </Svg>
                    ) : (
                      <PlayIcon size={26} color="#1e7fb0" />
                    )}
                  </View>
                  <Txt weight={800} size={12} color={colors.white} style={styles.videoTag}>
                    VIDÉO · 2:48
                  </Txt>
                </LinearGradient>
              </Pressable>

              <View style={styles.brandTag}>
                <Txt family="baloo" weight={800} size={15} color={colors.inkStrong}>
                  lasylabe
                </Txt>
              </View>

              <View style={styles.methodRow}>
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Path d="M14.5 14.5L21 21" stroke="#29ABE2" strokeWidth={2} strokeLinecap="round" />
                  <Path d="M10 4a6 6 0 100 12 6 6 0 000-12z" fill="none" stroke="#29ABE2" strokeWidth={2} />
                </Svg>
                <Txt family="baloo" weight={800} size={21} color="#29ABE2">
                  Méthode à retenir
                </Txt>
              </View>

              {paragraphs.map((p, i) => (
                <Txt key={i} weight={700} size={14} color={colors.inkBody} lineHeight={21} style={styles.para}>
                  {p}
                </Txt>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Passer le quiz" pill onPress={goQuiz} style={styles.footBtn} />
            <Button
              label={busy ? '…' : 'Leçon suivante'}
              variant="secondary"
              pill
              disabled={busy}
              onPress={nextLesson}
              style={styles.footBtn}
            />
          </View>
        </>
      )}
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
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 16, ...shadows.card },
  video: {
    height: 158,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  videoBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTag: {
    position: 'absolute',
    top: 12,
    left: 14,
    backgroundColor: 'rgba(0,0,0,.25)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  brandTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  methodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginVertical: 10 },
  para: { marginBottom: 12 },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 18,
    gap: 10,
    backgroundColor: colors.screen,
  },
  footBtn: { width: '100%' },
});
