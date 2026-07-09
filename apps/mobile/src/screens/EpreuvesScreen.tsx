import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ActivityCategory, ActivityDTO } from '@lasylab/shared';
import { activitiesApi, progressApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { useSession } from '../store/session';
import {
  Screen,
  Logo,
  Txt,
  ProgressBar,
  StarIcon,
  GemIcon,
  LoadingView,
  ErrorView,
} from '../components';
import { colors, radius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SECTIONS: { key: ActivityCategory; label: string }[] = [
  { key: 'METHODE', label: 'MÉTHODES' },
  { key: 'DEFINITION', label: 'DÉFINITIONS' },
  { key: 'EPREUVE', label: 'ÉPREUVES' },
  { key: 'EXERCICE', label: 'EXERCICES' },
];

export default function EpreuvesScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useSession();
  const { data, loading, error, reload } = useAsync(async () => {
    const [activities, progress] = await Promise.all([activitiesApi.list(), progressApi.get()]);
    return { activities, progress };
  }, []);

  const initial = (user?.name ?? 'L').charAt(0).toUpperCase();

  return (
    <Screen edges={['top']}>
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

      <View style={styles.badgeRow}>
        <Txt family="baloo" weight={800} size={15} color="#7a5b00" style={styles.badge}>
          ACTIVITÉS
        </Txt>
      </View>

      {loading && !data ? (
        <LoadingView />
      ) : error && !data ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {SECTIONS.map((section) => {
            const items = data!.activities.filter((a) => a.category === section.key);
            if (items.length === 0) return null;
            return (
              <View key={section.key}>
                <Txt weight={800} size={14} color={colors.textMutedAlt} letterSpacing={0.8} style={styles.sectionTitle}>
                  {section.label}
                </Txt>
                <View style={styles.grid}>
                  {items.map((a) => (
                    <ActivityCard
                      key={a.id}
                      activity={a}
                      onPress={() => navigation.navigate('EpreuveDetail', { activityId: a.id })}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </Screen>
  );
}

const CATEGORY_ICON_BG: Record<ActivityCategory, string> = {
  METHODE: '#f0ece6',
  DEFINITION: '#E8412B',
  EPREUVE: '#DCEFFB',
  EXERCICE: '#DCEFFB',
};

function CardGlyph({ category }: { category: ActivityCategory }) {
  const dark = category === 'DEFINITION';
  const stroke = dark ? '#fff' : '#8a7fd6';
  return (
    <Svg width={32} height={34} viewBox="0 0 34 36">
      <Rect x={7} y={4} width={18} height={24} rx={2} fill="#fff" stroke="#3c3c3c" strokeWidth={1.4} />
      <Path d="M11 11h10M11 16h10M11 21h6" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M20 24l9-9 4 4-9 9-5 1z" fill="#FFC400" stroke="#3c3c3c" strokeWidth={1.4} strokeLinejoin="round" />
    </Svg>
  );
}

function ActivityCard({ activity, onPress }: { activity: ActivityDTO; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: CATEGORY_ICON_BG[activity.category] }]}>
        <CardGlyph category={activity.category} />
      </View>
      <Txt weight={800} size={13} color={colors.ink} align="center">
        {activity.title}
      </Txt>
      {activity.category === 'EXERCICE' && activity.progressPct != null ? (
        <View style={styles.cardProgress}>
          <ProgressBar value={activity.progressPct / 100} height={6} />
        </View>
      ) : (
        <Txt weight={800} size={11} color={colors.textFaintAlt} letterSpacing={0.4}>
          {activity.subtitle ?? activity.subjectLabel}
        </Txt>
      )}
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
  badgeRow: { alignItems: 'center', marginVertical: 8 },
  badge: {
    backgroundColor: colors.yellow,
    color: '#7a5b00',
    paddingVertical: 9,
    paddingHorizontal: 34,
    borderRadius: radius.sm,
    overflow: 'hidden',
    letterSpacing: 1,
  },
  scroll: { paddingBottom: 24 },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ece7e0',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingHorizontal: 20, paddingTop: 14 },
  card: {
    width: '46%',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
    ...shadows.soft,
  },
  iconCircle: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  cardProgress: { width: '70%' },
});
