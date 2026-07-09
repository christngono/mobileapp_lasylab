import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OBJECTIFS, type Objectif } from '@lasylab/shared';
import { useSession } from '../store/session';
import { Screen, Mascot, Button, Txt, ProgressBar } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseObjectif'>;

export default function ChooseObjectifScreen({ navigation }: Props) {
  const { updateProfile } = useSession();
  const [objectif, setObjectif] = useState<Objectif>('Augmenter mes notes');
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    setLoading(true);
    try {
      await updateProfile({ objectif });
    } catch {
      // Continue même si l'enregistrement échoue.
    } finally {
      setLoading(false);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  return (
    <Screen padded>
      <View style={styles.progress}>
        <ProgressBar value={0.62} height={8} />
      </View>
      <Mascot size={118} style={styles.mascot} />
      <Txt family="baloo" weight={800} size={23} color="#4a4a4a" align="center" lineHeight={29} style={styles.h1}>
        Quel est ton objectif{'\n'}cette année scolaire ?
      </Txt>

      <View style={styles.options}>
        {OBJECTIFS.map((o) => {
          const selected = objectif === o;
          return (
            <Pressable
              key={o}
              onPress={() => setObjectif(o)}
              style={[styles.option, selected ? styles.optionOn : styles.optionOff]}
            >
              <Txt weight={700} size={15.5} align="center" color={selected ? colors.blueText : colors.textMuted}>
                {o}
              </Txt>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.spacer} />
      <Button label={loading ? '…' : 'Continuer'} disabled={loading} onPress={finish} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { marginTop: 8, marginBottom: 22 },
  mascot: { alignSelf: 'center', marginBottom: 4 },
  h1: { marginTop: 8, marginBottom: 24 },
  options: { gap: 13 },
  option: { padding: 16, borderRadius: radius.button, borderWidth: 2, borderBottomWidth: 4 },
  optionOn: { borderColor: '#9DD9F5', backgroundColor: colors.blueTintSoft },
  optionOff: { borderColor: colors.borderNeutral, backgroundColor: colors.white },
  spacer: { flex: 1, minHeight: 14 },
  cta: { marginBottom: 18 },
});
