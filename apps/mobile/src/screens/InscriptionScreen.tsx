import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError } from '../api/client';
import { useSession } from '../store/session';
import { Screen, Logo, Button, Txt, TextField, ChevronDown, CheckIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Inscription'>;

const YEARS = Array.from({ length: 14 }, (_, i) => 2016 - i); // 2016 → 2003

export default function InscriptionScreen({ navigation }: Props) {
  const { register } = useSession();
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [school, setSchool] = useState('');
  const [consent, setConsent] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!name.trim() || phone.trim().length < 4 || password.length < 6) {
      setError('Renseigne ton nom, un téléphone et un mot de passe (6+ caractères).');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        firstName: firstName.trim() || undefined,
        phone: phone.trim(),
        password,
        birthYear: birthYear ?? undefined,
        school: school.trim() || undefined,
        role: 'student',
        consent,
      });
      navigation.navigate('ChooseProfile');
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
            <View style={styles.logoRow}>
              <Logo height={34} />
            </View>
            <Txt family="baloo" weight={800} size={25} color={colors.inkTitle} align="center" style={styles.h1}>
              Crée ton compte
            </Txt>

            <View style={styles.row}>
              <TextField
                label="Nom"
                labelColor={colors.blue}
                borderColor={colors.blue}
                placeholder="Ton nom"
                value={name}
                onChangeText={setName}
                containerStyle={styles.col}
              />
              <TextField
                label="Prénom"
                placeholder="Ton prénom"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={styles.col}
              />
            </View>

            <TextField
              label="Téléphone"
              placeholder="+229 ..."
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              containerStyle={styles.field}
            />
            <TextField
              label="Mot de passe"
              placeholder="••••••••"
              password
              value={password}
              onChangeText={setPassword}
              containerStyle={styles.field}
            />

            {/* Date de naissance */}
            <Txt weight={800} size={13} color={colors.textMuted} style={styles.selLabel}>
              Date de naissance
            </Txt>
            <Pressable style={styles.select} onPress={() => setYearOpen(true)}>
              <Txt weight={700} size={14} color={birthYear ? colors.ink : colors.textMuted}>
                {birthYear ? String(birthYear) : 'Sélectionne une année'}
              </Txt>
              <ChevronDown />
            </Pressable>

            <TextField
              label="École"
              placeholder="Nom de ton école"
              value={school}
              onChangeText={setSchool}
              containerStyle={styles.field}
            />

            <Pressable style={styles.consent} onPress={() => setConsent((c) => !c)}>
              <View style={[styles.checkbox, consent ? styles.checkboxOn : styles.checkboxOff]}>
                {consent ? (
                  <Svg width={14} height={14} viewBox="0 0 24 24">
                    <Path d="M5 13l4 4 10-10" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                ) : null}
              </View>
              <Txt weight={700} size={12} color={colors.textMutedAlt} lineHeight={17} style={styles.consentText}>
                J'accepte de recevoir des conseils pédagogiques et des offres promotionnelles de lasylab.
              </Txt>
            </Pressable>

            {error ? (
              <Txt weight={700} size={13} color={colors.redText} align="center" style={styles.error}>
                {error}
              </Txt>
            ) : null}

            <Button label={loading ? '…' : 'Terminer'} onPress={submit} disabled={loading} style={styles.submit} />
            <Txt weight={700} size={10.5} color={colors.textFaintAlt} align="center" lineHeight={15} style={styles.legal}>
              En cliquant sur Terminer, tu acceptes les conditions générales d'utilisation et la politique de
              confidentialité de lasylab.
            </Txt>
          </View>

          <Txt weight={700} size={14} color={colors.textMuted} align="center" style={styles.loginRow}>
            Tu as déjà un compte?{' '}
            <Txt weight={800} size={14} color={colors.ink} onPress={() => navigation.navigate('Connexion')}>
              Connecte-toi
            </Txt>
          </Txt>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sélecteur d'année */}
      <Modal visible={yearOpen} transparent animationType="fade" onRequestClose={() => setYearOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setYearOpen(false)}>
          <View style={styles.modalSheet}>
            <Txt family="baloo" weight={800} size={18} color={colors.ink} align="center" style={styles.modalTitle}>
              Année de naissance
            </Txt>
            <ScrollView>
              {YEARS.map((y) => (
                <Pressable
                  key={y}
                  style={styles.yearItem}
                  onPress={() => {
                    setBirthYear(y);
                    setYearOpen(false);
                  }}
                >
                  <Txt weight={birthYear === y ? 800 : 700} size={16} color={birthYear === y ? colors.blue : colors.ink}>
                    {y}
                  </Txt>
                  {birthYear === y ? <CheckIcon size={18} color={colors.blue} /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 14 },
  card: { backgroundColor: colors.white, borderRadius: radius.cardXl, padding: 22 },
  logoRow: { alignItems: 'center' },
  h1: { marginTop: 8, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 14 },
  col: { flex: 1 },
  field: { marginTop: 14 },
  selLabel: { marginTop: 14, marginBottom: 5, marginLeft: 6 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16, marginHorizontal: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.green, borderWidth: 2, borderColor: colors.green },
  checkboxOff: { backgroundColor: colors.white, borderWidth: 2, borderColor: '#cfcabf' },
  consentText: { flex: 1 },
  error: { marginTop: 14 },
  submit: { marginTop: 20 },
  legal: { marginTop: 12 },
  loginRow: { marginVertical: 14 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.35)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    paddingVertical: 18,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalTitle: { marginBottom: 12 },
  yearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
});
