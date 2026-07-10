import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Mascot, Button, Txt } from '../components';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Congratulations'>;

export default function CongratulationsScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const subtitle =
    role === 'teacher'
      ? 'Ton compte est créé. Choisis maintenant les classes que tu enseignes.'
      : 'Ton compte est créé. Choisis maintenant ta classe actuelle.';

  return (
    <Screen>
      <View style={styles.center}>
        <Mascot size={170} />
        <Txt family="baloo" weight={800} size={30} color={colors.green} align="center" style={styles.title}>
          Félicitations ! 🎉
        </Txt>
        <Txt weight={700} size={16} color={colors.inkBody} align="center" lineHeight={23} style={styles.sub}>
          {subtitle}
        </Txt>
      </View>
      <Button label="Continuer" onPress={() => navigation.navigate('ChooseClasse', { role })} style={styles.cta} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  title: { marginTop: 18, marginBottom: 10 },
  sub: { maxWidth: 300 },
  cta: { margin: 22 },
});
