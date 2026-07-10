import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { statusApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { Screen, Txt, Mascot, CloseIcon, PlayIcon, LoadingView, ErrorView } from '../components';
import { parseGradient } from '../utils/gradient';
import { colors } from '../theme';
import type { MainTabsParamList } from '../navigation/types';

const AUTO_MS = 4500;

export default function StatusScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const { data: stories, loading, error, reload } = useAsync(() => statusApi.stories(), []);
  const [idx, setIdx] = useState(0);

  const count = stories?.length ?? 0;

  useEffect(() => {
    if (count === 0) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % count), AUTO_MS);
    return () => clearInterval(timer);
  }, [count]);

  if (loading && !stories) {
    return (
      <Screen background="#29ABE2">
        <LoadingView />
      </Screen>
    );
  }
  if ((error && !stories) || count === 0) {
    return (
      <Screen background="#29ABE2">
        <ErrorView message={error ?? 'Aucune story disponible.'} onRetry={reload} />
      </Screen>
    );
  }

  const story = stories![Math.min(idx, count - 1)];
  const gradient = parseGradient(story.bg);
  const prev = () => setIdx((i) => (i - 1 + count) % count);
  const next = () => setIdx((i) => (i + 1) % count);

  return (
    <LinearGradient colors={gradient} style={styles.fill}>
      <Screen background="transparent" edges={['top']}>
        {/* Segments */}
        <View style={styles.segs}>
          {stories!.map((_, i) => (
            <View key={i} style={styles.segTrack}>
              <View style={[styles.segFill, { width: i <= idx ? '100%' : '0%' }]} />
            </View>
          ))}
        </View>

        {/* En-tête */}
        <View style={styles.header}>
          <Mascot size={34} />
          <View style={styles.flex}>
            <Txt family="baloo" weight={800} size={14} color={colors.white}>
              Lasylab · Status
            </Txt>
            <Txt weight={700} size={11} color="rgba(255,255,255,.8)">
              {story.tag}
            </Txt>
          </View>
          <Pressable onPress={() => navigation.navigate('Home')} hitSlop={8}>
            <CloseIcon size={24} color={colors.white} />
          </Pressable>
        </View>

        {/* Contenu + zones de tap */}
        <View style={styles.body}>
          <Pressable style={styles.tapLeft} onPress={prev} />
          <Pressable style={styles.tapRight} onPress={next} />
          <View style={styles.playCircle} pointerEvents="none">
            <PlayIcon size={46} color={colors.white} />
          </View>
          <Txt family="baloo" weight={800} size={32} color={colors.white} align="center" lineHeight={36} style={styles.title}>
            {story.title}
          </Txt>
          <Txt weight={700} size={18} color="rgba(255,255,255,.94)" align="center" lineHeight={27} style={styles.text}>
            {story.text}
          </Txt>
        </View>

        {/* Indice */}
        <View style={styles.hint} pointerEvents="none">
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Circle cx={12} cy={12} r={9} fill="none" stroke="#fff" strokeWidth={2} />
            <Path d="M12 7v5l3 2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          </Svg>
          <Txt weight={700} size={13} color={colors.white}>
            Touche à droite pour la suite · à gauche pour revenir
          </Txt>
        </View>
      </Screen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  segs: { flexDirection: 'row', gap: 5, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
  segTrack: { flex: 1, height: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,.4)', overflow: 'hidden' },
  segFill: { height: '100%', borderRadius: 999, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  tapLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '38%' },
  tapRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '62%' },
  playCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  title: { marginBottom: 14 },
  text: { maxWidth: 300 },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 20,
    backgroundColor: 'rgba(255,255,255,.2)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
