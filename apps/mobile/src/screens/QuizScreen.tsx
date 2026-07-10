import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuizResultDTO } from '@lasylab/shared';
import { quizApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { optionState, type OptState } from '../utils/quiz';
import { Screen, Txt, Button, Mascot, CloseIcon, ProgressBar, LoadingView, ErrorView } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ navigation, route }: Props) {
  const { subjectId, nodeIndex } = route.params;
  const { data: quiz, loading, error, reload } = useAsync(
    () => quizApi.get(subjectId, nodeIndex),
    [subjectId, nodeIndex],
  );

  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResultDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading && !quiz) return <Screen><LoadingView /></Screen>;
  if ((error && !quiz) || !quiz) return <Screen><ErrorView message={error ?? 'Quiz indisponible.'} onRetry={reload} /></Screen>;

  // Écran de fin
  if (result) {
    return (
      <Screen>
        <View style={styles.doneWrap}>
          <Mascot size={140} />
          <Txt family="baloo" weight={800} size={28} color={colors.green} style={styles.doneTitle}>
            Quiz terminé !
          </Txt>
          <Txt weight={700} size={16} color={colors.inkBody} style={styles.doneSub}>
            Bravo, continue comme ça 💪
          </Txt>
          <View style={styles.statRow}>
            <View style={[styles.statCard, styles.statScore]}>
              <Txt family="baloo" weight={800} size={26} color={colors.yellowDeep}>
                {result.score}/{result.total}
              </Txt>
              <Txt weight={800} size={12} color="#b89a4a" letterSpacing={0.5}>
                RÉPONSES
              </Txt>
            </View>
            <View style={[styles.statCard, styles.statXp]}>
              <Txt family="baloo" weight={800} size={26} color={colors.green}>
                +{result.xpEarned}
              </Txt>
              <Txt weight={800} size={12} color="#7aa84a" letterSpacing={0.5}>
                XP GAGNÉS
              </Txt>
            </View>
          </View>
          <Button label="Continuer le parcours" onPress={() => navigation.goBack()} style={styles.doneBtn} />
          <Pressable onPress={restart}>
            <Txt weight={800} size={15} color={colors.textMutedAlt}>
              Refaire le quiz
            </Txt>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const question = quiz.questions[i];
  const total = quiz.questions.length;
  const isLast = i >= total - 1;
  const wasRight = checked && selected === question.correctIndex;

  function restart() {
    setI(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
    setResult(null);
  }

  async function onAction() {
    if (selected === null) return;
    if (!checked) {
      setChecked(true);
      return;
    }
    const nextAnswers = [...answers];
    nextAnswers[i] = selected;
    setAnswers(nextAnswers);

    if (isLast) {
      setSubmitting(true);
      try {
        const res = await quizApi.submit(subjectId, nodeIndex, nextAnswers);
        setResult(res);
      } catch (e) {
        // En cas d'échec réseau, on reste sur la question.
      } finally {
        setSubmitting(false);
      }
    } else {
      setI(i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  const actionLabel = !checked ? 'Vérifier' : isLast ? 'Terminer' : 'Continuer';

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <CloseIcon size={22} color="#cfcabf" />
        </Pressable>
        <View style={styles.progress}>
          <ProgressBar value={(checked ? i + 1 : i) / total} height={14} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Txt family="baloo" weight={800} size={22} color={colors.ink} align="center" lineHeight={29} style={styles.question}>
          {question.question}
        </Txt>

        <View style={styles.options}>
          {question.options.map((opt, idx) => (
            <QuizOption
              key={idx}
              label={opt}
              state={optionState(idx, selected, checked, question.correctIndex ?? -1)}
              onPress={() => {
                if (!checked) setSelected(idx);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {checked ? (
          <View style={[styles.feedback, wasRight ? styles.feedbackOk : styles.feedbackKo]}>
            <Txt weight={800} size={14.5} color={wasRight ? colors.greenText : colors.redText}>
              {wasRight ? 'Bravo, bonne réponse ! 🎉' : 'Pas tout à fait — la bonne réponse est surlignée.'}
            </Txt>
          </View>
        ) : null}
        <Button
          label={submitting ? '…' : actionLabel}
          variant={!checked ? 'blue' : 'green'}
          disabled={selected === null || submitting}
          onPress={onAction}
        />
      </View>
    </Screen>
  );
}

function QuizOption({ label, state, onPress }: { label: string; state: OptState; onPress: () => void }) {
  const s = OPTION_STYLES[state];
  return (
    <Pressable onPress={onPress} disabled={state === 'muted' || state === 'correct' || state === 'wrong'} style={[styles.option, s.box]}>
      <Txt weight={700} size={16} align="center" color={s.color}>
        {label}
      </Txt>
    </Pressable>
  );
}

const OPTION_STYLES: Record<OptState, { box: object; color: string }> = {
  idle: { box: { borderColor: colors.borderSoft, borderBottomColor: '#ddd9d3', backgroundColor: colors.white }, color: '#4a4a4a' },
  selected: { box: { borderColor: '#79CFF2', borderBottomColor: colors.blueBorder, backgroundColor: colors.blueTintSoft }, color: colors.blueText },
  correct: { box: { borderColor: colors.green, borderBottomColor: colors.greenShadow, backgroundColor: colors.greenTint }, color: colors.greenText },
  wrong: { box: { borderColor: colors.red, borderBottomColor: colors.redShadow, backgroundColor: colors.redTint }, color: colors.redText },
  muted: { box: { borderColor: colors.borderNeutral, borderBottomColor: colors.borderNeutral, backgroundColor: '#fafafa' }, color: '#bdbdbd' },
};

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingVertical: 8 },
  progress: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingTop: 14 },
  question: { marginTop: 14, marginBottom: 28, marginHorizontal: 6 },
  options: { gap: 12 },
  option: {
    minHeight: 62,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.button,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { paddingHorizontal: 22, paddingBottom: 18, gap: 12 },
  feedback: { borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16 },
  feedbackOk: { backgroundColor: colors.greenTint },
  feedbackKo: { backgroundColor: colors.redTint },
  // Écran de fin
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 },
  doneTitle: { marginTop: 18, marginBottom: 6 },
  doneSub: { marginBottom: 22 },
  statRow: { flexDirection: 'row', gap: 14, marginBottom: 30 },
  statCard: { borderRadius: 18, borderWidth: 2, paddingVertical: 16, paddingHorizontal: 22, alignItems: 'center' },
  statScore: { backgroundColor: colors.yellowTint, borderColor: colors.yellowTintBorder },
  statXp: { backgroundColor: colors.greenTint, borderColor: colors.greenTintBorder },
  doneBtn: { width: '80%', marginBottom: 12 },
});
