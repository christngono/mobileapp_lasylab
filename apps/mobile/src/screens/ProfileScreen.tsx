import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BadgeDTO, ProfileSubjectProgressDTO } from '@lasylab/shared';
import { profileApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { useSession } from '../store/session';
import { Screen, Txt, ProgressBar, BackIcon, LoadingView, ErrorView } from '../components';
import { colors, radius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const BADGE_TINTS = ['#FFF6DB', '#FDEAE0', '#EDEAFB', '#E8F8DC'];
const BADGE_BORDERS = ['#FFE08A', '#F6C3A8', '#C8BFF0', '#B6E89A'];

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout, isChildActive, exitToParent } = useSession();
  const { data, loading, error, reload } = useAsync(() => profileApi.get(), []);

  const initial = (data?.user.name ?? user?.name ?? 'L').charAt(0).toUpperCase();

  const onLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  const onSwitchProfile = () => {
    exitToParent();
    navigation.reset({ index: 0, routes: [{ name: 'ParentHome' }] });
  };

  if (loading && !data) {
    return <Screen><LoadingView /></Screen>;
  }
  if (error && !data) {
    return <Screen><ErrorView message={error} onRetry={reload} /></Screen>;
  }

  return (
    <Screen edges={[]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête dégradé */}
        <LinearGradient colors={[colors.blue, colors.teal]} style={styles.header}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon size={24} color={colors.white} />
          </Pressable>
          <LinearGradient colors={[colors.yellow, colors.brand]} style={styles.avatar}>
            <Txt family="baloo" weight={800} size={36} color={colors.white}>
              {initial}
            </Txt>
          </LinearGradient>
          <Txt family="baloo" weight={800} size={23} color={colors.white} style={styles.name}>
            {data?.user.name ?? user?.name}
          </Txt>
          <Txt weight={800} size={14} color="rgba(255,255,255,.85)">
            {(data?.user.classe ?? user?.classe ?? '')} · Membre Lasylab
          </Txt>
        </LinearGradient>

        {/* Cartes de stats */}
        <View style={styles.statRow}>
          <StatCard value={data?.streak ?? 0} label="série (j)" color={colors.yellowText} />
          <StatCard value={data?.gems ?? 0} label="gemmes" color={colors.redOrange} />
          <StatCard value={data?.xp ?? 0} label="XP" color={colors.green} />
        </View>

        {/* Badges */}
        <Txt family="baloo" weight={800} size={17} color={colors.inkTitle} style={styles.sectionTitle}>
          Mes badges
        </Txt>
        <View style={styles.badgeGrid}>
          {(data?.badges ?? []).map((b, i) => (
            <BadgeTile key={b.id} badge={b} index={i} />
          ))}
        </View>

        {/* Progression */}
        <Txt family="baloo" weight={800} size={17} color={colors.inkTitle} style={styles.sectionTitle}>
          Ma progression
        </Txt>
        <View style={styles.progressList}>
          {(data?.progression ?? []).map((p) => (
            <ProgressRow key={p.subjectId} item={p} />
          ))}
        </View>

        {isChildActive ? (
          <Pressable style={styles.switchProfile} onPress={onSwitchProfile}>
            <Txt weight={800} size={15} color={colors.blueText}>
              ← Changer de profil
            </Txt>
          </Pressable>
        ) : (
          <Pressable style={styles.logout} onPress={onLogout}>
            <Txt weight={800} size={15} color={colors.redText}>
              Se déconnecter
            </Txt>
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <Txt family="baloo" weight={800} size={22} color={color}>
        {value}
      </Txt>
      <Txt weight={800} size={11} color={colors.textMutedAlt}>
        {label}
      </Txt>
    </View>
  );
}

function BadgeTile({ badge, index }: { badge: BadgeDTO; index: number }) {
  if (!badge.earned) {
    return (
      <View style={styles.badgeItem}>
        <View style={[styles.badgeIcon, styles.badgeLocked]}>
          <Svg width={22} height={24} viewBox="0 0 22 24">
            <Rect x={3} y={10} width={16} height={12} rx={2.5} fill="#c2bcb2" />
            <Path d="M6 10V7a5 5 0 0110 0v3" fill="none" stroke="#c2bcb2" strokeWidth={2.4} />
          </Svg>
        </View>
        <Txt weight={700} size={10} color={colors.textFaintAlt} align="center">
          {badge.label}
        </Txt>
      </View>
    );
  }
  return (
    <View style={styles.badgeItem}>
      <View
        style={[
          styles.badgeIcon,
          { backgroundColor: BADGE_TINTS[index % 4], borderColor: BADGE_BORDERS[index % 4], borderWidth: 2 },
        ]}
      >
        <Txt size={26}>{badge.icon}</Txt>
      </View>
      <Txt weight={700} size={10} color={colors.inkBody} align="center">
        {badge.label}
      </Txt>
    </View>
  );
}

function ProgressRow({ item }: { item: ProfileSubjectProgressDTO }) {
  return (
    <View>
      <View style={styles.progressHead}>
        <Txt weight={800} size={13} color={colors.inkBody}>
          {item.name}
        </Txt>
        <Txt weight={800} size={13} color={item.color}>
          {item.pct}%
        </Txt>
      </View>
      <ProgressBar value={item.pct / 100} color={item.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 56, paddingBottom: 46, paddingHorizontal: 22, alignItems: 'center' },
  back: { position: 'absolute', left: 18, top: 52 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  name: { marginTop: 12, marginBottom: 2 },
  statRow: { flexDirection: 'row', gap: 11, paddingHorizontal: 18, marginTop: -30 },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadows.card,
  },
  sectionTitle: { marginHorizontal: 22, marginTop: 24, marginBottom: 12 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 22, gap: 12 },
  badgeItem: { width: '21%', alignItems: 'center', gap: 6 },
  badgeIcon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badgeLocked: { backgroundColor: '#f0ece6', borderWidth: 2, borderColor: '#d3cdc4', borderStyle: 'dashed' },
  progressList: { paddingHorizontal: 22, gap: 14, paddingBottom: 10 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  logout: { alignItems: 'center', paddingVertical: 22 },
  switchProfile: { alignItems: 'center', paddingVertical: 22 },
});
