import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ChatMessageDTO, SubjectId } from '@lasylab/shared';
import { socraticApi } from '../api/socratic';
import { useSession } from '../store/session';
import { Screen, Txt, Mascot, SendIcon } from '../components';
import { colors, radius } from '../theme';

type Layout = 'bulles' | 'coach' | 'sujets';

const TABS: { key: Layout; label: string }[] = [
  { key: 'bulles', label: 'Bulles' },
  { key: 'coach', label: 'Coach' },
  { key: 'sujets', label: 'Sujets' },
];

const SUGGESTIONS = [
  "C'est quoi une variable ?",
  'Explique le discriminant',
  'Qui a inventé la philosophie ?',
  'Aide-moi à réviser',
];

const SUBJECT_CHIPS: { label: string; q: string; id: SubjectId }[] = [
  { label: 'Maths', q: 'Explique le discriminant', id: 'maths' },
  { label: 'SVT', q: 'Explique la photosynthèse', id: 'svt' },
  { label: 'Philo', q: 'Qui a inventé la philosophie ?', id: 'philosophie' },
  { label: 'Info', q: "C'est quoi une variable ?", id: 'informatique' },
  { label: 'Anglais', q: 'Comment dire « depuis » en anglais ?', id: 'anglais' },
];

const GREETING: ChatMessageDTO = {
  role: 'assistant',
  text: "Salut 👋 Je suis Lasy, ton assistant. Pose-moi une question sur tes cours : je ne te donne pas la réponse tout de suite, je t'aide à la trouver toi-même, pas à pas !",
};

export default function ChatScreen() {
  const { user } = useSession();
  const [layout, setLayout] = useState<Layout>('bulles');
  const [messages, setMessages] = useState<ChatMessageDTO[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [subjectId, setSubjectId] = useState<SubjectId | undefined>();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  const send = async (text?: string, subj?: SubjectId) => {
    const value = (text ?? input).trim();
    if (!value || typing) return;
    const nextSubject = subj ?? subjectId;
    setSubjectId(nextSubject);
    setMessages((m) => [...m, { role: 'user', text: value }]);
    setInput('');
    setTyping(true);
    try {
      const res = await socraticApi.ask(value, { sessionId, subjectId: nextSubject });
      setSessionId(res.sessionId);
      setMessages((m) => [...m, { role: 'assistant', text: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: "Oups, je n'ai pas réussi à répondre 😅. Réessaie dans un instant." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const name = user?.name ?? 'toi';

  return (
    <Screen edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Onglets de vue */}
        <View style={styles.tabs}>
          <Txt weight={800} size={11} color={colors.textFaintAlt}>
            VUE
          </Txt>
          {TABS.map((t) => {
            const active = layout === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setLayout(t.key)}
                style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}
              >
                <Txt weight={800} size={12} color={active ? colors.white : colors.textMutedAlt}>
                  {t.label}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        {/* En-tête selon la vue */}
        {layout === 'bulles' ? (
          <View style={styles.bullesHeader}>
            <View>
              <Mascot size={42} />
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Txt family="baloo" weight={800} size={16} color={colors.ink}>
                Lasy · ton assistant IA
              </Txt>
              <Txt weight={700} size={12} color={colors.green}>
                en ligne · répond en direct
              </Txt>
            </View>
          </View>
        ) : null}

        {layout === 'coach' ? (
          <LinearGradient colors={['#FFF3D6', '#FFE7B0']} style={styles.coachHeader}>
            <Mascot size={74} />
            <View style={styles.flex}>
              <Txt family="baloo" weight={800} size={18} color={colors.ink}>
                Salut {name} ! 👋
              </Txt>
              <Txt weight={700} size={13.5} color="#8a7a52" lineHeight={19}>
                Je suis Lasy. Pose-moi une question sur tes cours, je t'aide à trouver la réponse toi-même.
              </Txt>
            </View>
          </LinearGradient>
        ) : null}

        {layout === 'sujets' ? (
          <View style={styles.sujetsHeader}>
            <Txt weight={800} size={13} color={colors.inkBody} style={styles.sujetsTitle}>
              Je veux de l'aide en…
            </Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {SUBJECT_CHIPS.map((c) => (
                <Pressable key={c.label} style={styles.subjectChip} onPress={() => send(c.q, c.id)}>
                  <Txt weight={800} size={13} color={colors.inkBody}>
                    {c.label}
                  </Txt>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Fil de messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m, i) => (
            <MessageRow key={i} message={m} />
          ))}
          {typing ? <TypingBubble /> : null}
        </ScrollView>

        {/* Suggestions */}
        {layout === 'coach' ? (
          <View style={styles.coachSuggestions}>
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <Pressable key={s} style={styles.coachSuggestion} onPress={() => send(s)}>
                <Txt weight={700} size={15} color={colors.amber}>
                  ✦
                </Txt>
                <Txt weight={700} size={13.5} color={colors.ink} numberOfLines={1} style={styles.flex}>
                  {s}
                </Txt>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.suggestBlock}>
            <Txt weight={800} size={11} color={colors.textFaintAlt} style={styles.suggestLabel}>
              SUGGESTIONS
            </Txt>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestRow}>
              {SUGGESTIONS.map((s) => (
                <Pressable key={s} style={styles.suggestChip} onPress={() => send(s)}>
                  <Txt weight={700} size={12.5} color={colors.inkBody} numberOfLines={1}>
                    {s}
                  </Txt>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Barre de saisie */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send()}
            placeholder="Écris ta question à Lasy…"
            placeholderTextColor={colors.textDisabled}
            style={styles.input}
            returnKeyType="send"
          />
          <Pressable style={styles.sendBtn} onPress={() => send()}>
            <SendIcon />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function MessageRow({ message }: { message: ChatMessageDTO }) {
  const isBot = message.role === 'assistant';
  return (
    <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
      {isBot ? <Mascot size={32} style={styles.avatar} /> : null}
      <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
        <Txt weight={isBot ? 600 : 700} size={14.5} color={isBot ? colors.ink : colors.white} lineHeight={21}>
          {message.text}
        </Txt>
      </View>
    </View>
  );
}

function TypingBubble() {
  const dots = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  useEffect(() => {
    const loops = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(d, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [dots]);

  return (
    <View style={[styles.row, styles.rowBot]}>
      <Mascot size={32} style={styles.avatar} />
      <View style={[styles.bubble, styles.bubbleBot, styles.typing]}>
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              { opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerWarm,
  },
  tab: { borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 13 },
  tabActive: { backgroundColor: colors.brand },
  tabIdle: { backgroundColor: '#f3efe9' },
  bullesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerWarm,
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e6c4',
  },
  sujetsHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerWarm,
  },
  sujetsTitle: { marginBottom: 9, paddingLeft: 2 },
  chipRow: { gap: 7, paddingRight: 8 },
  subjectChip: {
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.screen,
  },
  messages: { paddingHorizontal: 14, paddingTop: 16, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  rowBot: { justifyContent: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  avatar: { marginRight: 8 },
  bubble: { maxWidth: '78%', paddingVertical: 11, paddingHorizontal: 15, borderRadius: 18 },
  bubbleBot: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  bubbleUser: { backgroundColor: colors.green, borderTopRightRadius: 6 },
  typing: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#bdb7ad' },
  coachSuggestions: { paddingHorizontal: 14, paddingBottom: 8, gap: 7 },
  coachSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  suggestBlock: { paddingTop: 4 },
  suggestLabel: { paddingHorizontal: 16, marginBottom: 5, letterSpacing: 0.5 },
  suggestRow: { gap: 7, paddingHorizontal: 14, paddingBottom: 8 },
  suggestChip: {
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.screen,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.dividerWarm,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#faf7f2',
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingHorizontal: 18,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14.5,
    color: colors.ink,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.blue,
    borderBottomWidth: 3,
    borderBottomColor: colors.blueShadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
