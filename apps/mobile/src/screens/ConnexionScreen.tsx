import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError } from '../api/client';
import { useSession } from '../store/session';
import { Screen, Logo, Button, Txt, TextField, BackIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Connexion'>;

export default function ConnexionScreen({ navigation }: Props) {
  const { login } = useSession();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (phone.trim().length < 4 || !password) {
      setError('Renseigne ton téléphone et ton mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await login({ phone: phone.trim(), password });
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Pressable style={styles.back} onPress={() => navigation.navigate('Onboarding')} hitSlop={8}>
              <BackIcon />
            </Pressable>
            <View style={styles.logoRow}>
              <Logo height={34} />
            </View>
            <Txt family="baloo" weight={800} size={30} color="#3f3f3f" align="center" style={styles.h1}>
              Connecte-toi
            </Txt>

            <TextField
              label="Téléphone"
              labelColor={colors.textFaint}
              borderColor={colors.inputBorder}
              placeholder="+229 ..."
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <View style={styles.pwdLabelRow}>
              <Txt weight={800} size={14} color={colors.textFaint}>
                Mot de passe
              </Txt>
              <Txt weight={700} size={14} color={colors.ink}>
                je l'ai oublié 😅
              </Txt>
            </View>
            <TextField
              borderColor={colors.inputBorder}
              placeholder="••••••••"
              password
              value={password}
              onChangeText={setPassword}
            />

            {error ? (
              <Txt weight={700} size={13} color={colors.redText} align="center" style={styles.error}>
                {error}
              </Txt>
            ) : null}

            <Button
              label={loading ? '…' : 'Je me connecte'}
              variant="blue"
              pill
              onPress={submit}
              disabled={loading}
              style={styles.submit}
            />
          </View>

          <Txt weight={700} size={15} color={colors.textMuted} align="center" style={styles.signup}>
            Tu n'as pas de compte?{' '}
            <Txt weight={800} size={15} color={colors.ink} onPress={() => navigation.navigate('Inscription')}>
              Inscris-toi ici !
            </Txt>
          </Txt>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 14 },
  card: { backgroundColor: colors.white, borderRadius: radius.cardXl, padding: 24, paddingBottom: 34 },
  back: { position: 'absolute', left: 22, top: 22, zIndex: 2 },
  logoRow: { alignItems: 'center', paddingTop: 2 },
  h1: { marginTop: 14, marginBottom: 46 },
  pwdLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  error: { marginTop: 14 },
  submit: { width: '88%', alignSelf: 'center', marginTop: 28 },
  signup: { marginVertical: 16 },
});
