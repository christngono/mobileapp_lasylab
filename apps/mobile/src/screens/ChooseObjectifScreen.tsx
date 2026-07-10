import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OBJECTIFS, TEACHER_OBJECTIFS } from '@lasylab/shared';
import { useSession } from '../store/session';
import { Screen, Mascot, Button, Txt, ProgressBar, CheckIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseObjectif'>;

export default function ChooseObjectifScreen({ navigation, route }: Props) {
  const role = route.params?.role ?? 'student';
  const options: readonly string[] = role === 'teacher' ? TEACHER_OBJECTIFS : OBJECTIFS;
  const { updateProfile } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (o: string) =>
    setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  const finish = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await updateProfile({ objectifs: selected });
    } catch {
      // Continue même si l'enregistrement échoue.
    } finally {
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  const title =
    role === 'teacher' ? 'Que veux-tu faire\navec Lasylab ?' : 'Quel est ton objectif\ncette année scolaire ?';

  return (
    <Screen padded>
      <View style={styles.progress}>
        <ProgressBar value={0.75} height={8} />
      </View>
      <Mascot size={110} style={styles.mascot} />
      <Txt family="baloo" weight={800} size={23} color="#4a4a4a" align="center" lineHeight={29} style={styles.h1}>
        {title}
      </Txt>
      <Txt weight={700} size={13} color={colors.textFaint} align="center" style={styles.hint}>
        Tu peux en choisir plusieurs
      </Txt>

      <View style={styles.options}>
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <Pressable key={o} onPress={() => toggle(o)} style={[styles.option, on ? styles.optionOn : styles.optionOff]}>
              <Txt weight={700} size={15.5} color={on ? colors.blueText : colors.textMuted} style={styles.optionText}>
                {o}
              </Txt>
              {on ? <CheckIcon size={18} color={colors.blue} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />
      <Button label={loading ? '…' : 'Continuer'} disabled={loading || selected.length === 0} onPress={finish} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { marginTop: 8, marginBottom: 18 },
  mascot: { alignSelf: 'center', marginBottom: 4 },
  h1: { marginTop: 6, marginBottom: 4 },
  hint: { marginBottom: 18 },
  options: { gap: 13 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: radius.button,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  optionOn: { borderColor: '#9DD9F5', backgroundColor: colors.blueTintSoft },
  optionOff: { borderColor: colors.borderNeutral, backgroundColor: colors.white },
  optionText: { flex: 1 },
  spacer: { flex: 1, minHeight: 14 },
  cta: { marginBottom: 18 },
});
