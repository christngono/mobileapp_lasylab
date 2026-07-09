import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CLASSES, type Classe } from '@lasylab/shared';
import { useSession } from '../store/session';
import { Screen, Logo, Button, Txt, Pill, BackIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseClasse'>;

export default function ChooseClasseScreen({ navigation }: Props) {
  const { updateProfile } = useSession();
  const [classe, setClasse] = useState<Classe>('1ère');
  const [loading, setLoading] = useState(false);

  const next = async () => {
    setLoading(true);
    try {
      await updateProfile({ classe });
    } catch {
      // On continue le parcours même si l'enregistrement échoue (réseau).
    } finally {
      setLoading(false);
      navigation.navigate('ChooseObjectif');
    }
  };

  return (
    <Screen>
      <View style={styles.card}>
        <View style={styles.head}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
            <BackIcon size={22} />
          </Pressable>
          <Logo height={34} />
        </View>
        <Txt family="baloo" weight={800} size={26} color={colors.inkTitle} align="center" style={styles.h1}>
          Crée ton compte
        </Txt>
        <Txt weight={800} size={16} color={colors.inkMuted} align="center" lineHeight={22} style={styles.sub}>
          En quelle classe es-tu{'\n'}[2021-2022]
        </Txt>

        <View style={styles.grid}>
          {CLASSES.map((c) => (
            <Pill key={c} label={c} selected={classe === c} onPress={() => setClasse(c)} />
          ))}
        </View>

        <View style={styles.spacer} />
        <Button label={loading ? '…' : 'Continuer'} disabled={loading} onPress={next} style={styles.cta} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 14, backgroundColor: colors.white, borderRadius: radius.cardXl, padding: 26 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  back: { position: 'absolute', left: 0 },
  h1: { marginTop: 6, marginBottom: 2 },
  sub: { marginBottom: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 13, justifyContent: 'center' },
  spacer: { flex: 1, minHeight: 14 },
  cta: { width: '78%', alignSelf: 'center', marginTop: 14 },
});
