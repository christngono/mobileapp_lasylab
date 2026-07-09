import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ParcoursNodeDTO } from '@lasylab/shared';
import { lessonsApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { Screen, Txt, BackIcon, PlayIcon, CheckIcon, LoadingView, ErrorView } from '../components';
import { colors, radius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Parcours'>;

export default function ParcoursScreen({ navigation, route }: Props) {
  const { subjectId } = route.params;
  const { data, loading, error, reload } = useAsync(() => lessonsApi.parcours(subjectId), [subjectId]);
  useFocusEffect(useCallback(() => reload(), [reload]));

  const openNode = (node: ParcoursNodeDTO) => {
    if (node.status === 'locked') return;
    if (node.kind === 'quiz') {
      navigation.navigate('Quiz', { subjectId, nodeIndex: node.nodeIndex });
    } else {
      // Leçon en mode « stories », qui enchaîne ensuite vers le Cours détaillé.
      navigation.navigate('Lesson', { subjectId, nodeIndex: node.nodeIndex });
    }
  };

  return (
    <Screen>
      <View style={styles.head}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <BackIcon color="#8a857c" />
        </Pressable>
      </View>

      {data ? (
        <View style={styles.pillRow}>
          <Txt family="baloo" weight={800} size={15} color="#7a5b00" style={styles.pill}>
            {data.subject.short} · 1re
          </Txt>
        </View>
      ) : null}

      {loading && !data ? (
        <LoadingView />
      ) : error && !data ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            {data?.nodes.map((node, i) => (
              <View key={node.nodeIndex} style={styles.nodeWrap}>
                {i > 0 ? (
                  <View
                    style={[
                      styles.bar,
                      { backgroundColor: node.status !== 'locked' ? colors.green : colors.border },
                    ]}
                  />
                ) : null}
                <NodeLabel node={node} />
                <Pressable onPress={() => openNode(node)} disabled={node.status === 'locked'}>
                  <NodeCircle node={node} />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

function NodeLabel({ node }: { node: ParcoursNodeDTO }) {
  let bg = colors.dividerWarm;
  let color = colors.textFaint;
  if (node.status === 'done') {
    bg = colors.greenTint;
    color = colors.greenText;
  } else if (node.status === 'current') {
    bg = node.kind === 'quiz' ? '#DFF3FC' : colors.yellow;
    color = node.kind === 'quiz' ? colors.blueText : '#7a5b00';
  }
  return (
    <Txt family="baloo" weight={800} size={13} color={color} style={[styles.label, { backgroundColor: bg }]}>
      {node.label}
    </Txt>
  );
}

function QuizGlyph({ color }: { color: string }) {
  return (
    <Svg width={30} height={24} viewBox="0 0 30 24">
      <Rect x={5} y={4} width={20} height={4} rx={2} fill={color} />
      <Rect x={5} y={11} width={14} height={4} rx={2} fill={color} />
      <Rect x={5} y={18} width={18} height={4} rx={2} fill={color} />
    </Svg>
  );
}

function NodeCircle({ node }: { node: ParcoursNodeDTO }) {
  if (node.status === 'done') {
    return (
      <View style={[styles.node, styles.nodeDone]}>
        <CheckIcon size={34} color={colors.white} />
      </View>
    );
  }
  if (node.status === 'current') {
    const isQuiz = node.kind === 'quiz';
    return (
      <View
        style={[
          styles.node,
          isQuiz ? styles.nodeCurrentQuiz : styles.nodeCurrentLesson,
          styles.nodeCurrentBorder,
        ]}
      >
        {isQuiz ? <QuizGlyph color={colors.white} /> : <PlayIcon size={30} color="#E8125A" />}
      </View>
    );
  }
  // locked
  return (
    <View style={[styles.node, styles.nodeLocked]}>
      {node.kind === 'quiz' ? (
        <QuizGlyph color={colors.textDisabled} />
      ) : (
        <PlayIcon size={30} color={colors.textDisabled} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: 18, paddingTop: 6 },
  pillRow: { alignItems: 'center', marginTop: 2, marginBottom: 6 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.yellow,
    overflow: 'hidden',
    letterSpacing: 0.6,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: radius.cardLg,
    paddingVertical: 26,
    paddingHorizontal: 16,
    paddingBottom: 34,
    alignItems: 'center',
    ...shadows.card,
  },
  nodeWrap: { alignItems: 'center', width: '100%' },
  bar: { width: 9, height: 44, borderRadius: 6, marginTop: 2 },
  label: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 12,
  },
  node: { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.green, ...shadows.soft },
  nodeCurrentLesson: { backgroundColor: colors.yellow },
  nodeCurrentQuiz: { backgroundColor: colors.blue },
  nodeCurrentBorder: { borderWidth: 5, borderColor: colors.white, ...shadows.soft },
  nodeLocked: { backgroundColor: colors.dividerWarm },
});
