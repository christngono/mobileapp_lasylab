import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PARCOURS_TOTAL_NODES, type ProgressDTO, type SubjectMeta } from '@lasylab/shared';
import { subjectsApi, progressApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { useSession } from '../store/session';
import {
  Screen,
  Logo,
  Txt,
  ProgressRing,
  SubjectIcon,
  StarIcon,
  GemIcon,
  ChevronDown,
  LoadingView,
  ErrorView,
} from '../components';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useSession();

  const { data, loading, error, reload } = useAsync(
    async () => {
      const [subjects, progress] = await Promise.all([subjectsApi.list(), progressApi.get()]);
      return { subjects, progress };
    },
    [],
  );

  // Rafraîchit la progression au retour sur l'écran.
  useFocusEffect(useCallback(() => reload(), [reload]));

  const initial = (user?.name ?? 'L').charAt(0).toUpperCase();

  return (
    <Screen edges={['top']}>
      {/* En-tête */}
      <View style={styles.header}>
        <Logo height={26} />
        <View style={styles.headerRight}>
          <View style={styles.stat}>
            <StarIcon />
            <Txt weight={900} size={16} color={colors.yellowText}>
              {data?.progress.streak ?? 0}
            </Txt>
          </View>
          <View style={styles.stat}>
            <GemIcon />
            <Txt weight={900} size={16} color={colors.redOrange}>
              {data?.progress.gems ?? 0}
            </Txt>
          </View>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <LinearGradient colors={[colors.yellow, colors.brand]} style={styles.avatar}>
              <Txt weight={900} size={17} color={colors.white}>
                {initial}
              </Txt>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.classeRow}>
        <Txt family="baloo" weight={800} size={18} color={colors.inkMuted}>
          {user?.classe ?? 'Ma classe'}
        </Txt>
        <ChevronDown />
      </View>
      <Txt weight={700} size={12.5} color={colors.textFaint} align="center" style={styles.hint}>
        Touche une matière pour ouvrir son parcours
      </Txt>

      {loading && !data ? (
        <LoadingView />
      ) : error && !data ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {data?.subjects.map((s) => (
            <SubjectTile
              key={s.id}
              subject={s}
              progress={data.progress}
              onPress={() => navigation.navigate('Parcours', { subjectId: s.id })}
            />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function SubjectTile({
  subject,
  progress,
  onPress,
}: {
  subject: SubjectMeta;
  progress: ProgressDTO;
  onPress: () => void;
}) {
  const done = progress.bySubject[subject.id] ?? 0;
  const ratio = done / PARCOURS_TOTAL_NODES;
  const active = done > 0;

  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <ProgressRing size={100} strokeWidth={9} progress={ratio} color={subject.color}>
        <View style={styles.tileInner}>
          <View style={active ? undefined : styles.dim}>
            <SubjectIcon id={subject.id} size={46} />
          </View>
        </View>
      </ProgressRing>
      <Txt family="baloo" weight={800} size={14} color={active ? '#4a4a4a' : colors.textMutedAlt}>
        {subject.name}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  classeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 10 },
  hint: { marginTop: 2, marginBottom: 6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 26,
    rowGap: 20,
  },
  tile: { width: '46%', alignItems: 'center', gap: 9 },
  tileInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dim: { opacity: 0.5 },
});
