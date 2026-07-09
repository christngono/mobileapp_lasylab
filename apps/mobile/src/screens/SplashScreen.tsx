import { View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Logo, Button, Txt } from '../components';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/**
 * Placeholder de l'écran de démarrage (étape 4).
 * Les boutons ci-dessous sont des raccourcis de navigation temporaires pour
 * parcourir le squelette ; l'animation de splash réelle arrive à l'étape 5.
 */
export default function SplashScreen({ navigation }: Props) {
  return (
    <Screen variant="plain">
      <View style={styles.center}>
        <Logo height={64} />
        <Txt weight={800} size={12} color={colors.textDisabled} style={styles.tag}>
          FONDATIONS UI · ÉTAPE 4
        </Txt>
        <View style={styles.actions}>
          <Button label="Voir l'onboarding" onPress={() => navigation.navigate('Onboarding')} />
          <Button
            label="Voir l'app (onglets)"
            variant="blue"
            onPress={() => navigation.navigate('Main')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 28 },
  tag: { letterSpacing: 0.6 },
  actions: { alignSelf: 'stretch', gap: 12, marginTop: 24 },
});
