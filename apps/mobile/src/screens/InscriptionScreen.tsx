import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SUBJECTS, type SubjectId } from '@lasylab/shared';
import { ApiError } from '../api/client';
import { useSession } from '../store/session';
import { Screen, Logo, Button, Txt, TextField, PickerField, CheckIcon } from '../components';
import type { PickerOption } from '../components/PickerField';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Inscription'>;

const ROLE_LABEL: Record<string, string> = {
  student: 'Élève',
  teacher: 'Enseignant',
  parent: 'Parent',
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const DAY_OPTIONS: PickerOption[] = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: pad2(i + 1) }));
const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTH_OPTIONS: PickerOption[] = MONTH_NAMES.map((label, i) => ({ label, value: pad2(i + 1) }));
const YEAR_OPTIONS: PickerOption[] = Array.from({ length: 25 }, (_, i) => {
  const y = new Date().getFullYear() - 4 - i; // à partir d'il y a ~4 ans
  return { label: String(y), value: String(y) };
});

export default function InscriptionScreen({ navigation, route }: Props) {
  const role = route.params?.role ?? 'student';
  const { register } = useSession();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  // Élève — date de naissance (jour / mois / année)
  const [day, setDay] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [school, setSchool] = useState('');
  const [consent, setConsent] = useState(false);
  // Enseignant
  const [subjects, setSubjects] = useState<SubjectId[]>([]);
  const [schoolsText, setSchoolsText] = useState('');
  // Parent
  const [childrenCount, setChildrenCount] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSubject = (id: SubjectId) =>
    setSubjects((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = async () => {
    setError(null);
    if (!name.trim() || phone.trim().length < 4 || password.length < 6) {
      setError('Renseigne ton nom, un téléphone et un mot de passe (6+ caractères).');
      return;
    }
    if (role === 'teacher' && subjects.length === 0) {
      setError('Choisis au moins une matière que tu enseignes.');
      return;
    }
    if (role === 'parent' && (!childrenCount || Number(childrenCount) < 1)) {
      setError("Indique le nombre d'enfants qui utiliseront Lasylab.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        phone: phone.trim(),
        password,
        role,
        consent,
        ...(role === 'student'
          ? {
              birthDate: day && month && year ? `${year}-${month}-${day}` : undefined,
              school: school.trim() || undefined,
            }
          : {}),
        ...(role === 'teacher'
          ? {
              subjects,
              schools: schoolsText.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : {}),
        ...(role === 'parent' ? { childrenCount: Number(childrenCount) } : {}),
      });

      if (role === 'parent') {
        navigation.reset({ index: 0, routes: [{ name: 'ParentHome' }] });
      } else {
        navigation.navigate('Congratulations', { role });
      }
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
            <View style={styles.rolePill}>
              <Txt weight={800} size={12} color={colors.blueText}>
                {ROLE_LABEL[role]}
              </Txt>
            </View>

            <TextField label="Nom" labelColor={colors.blue} borderColor={colors.blue} placeholder="Ton nom" value={name} onChangeText={setName} containerStyle={styles.field} />
            <TextField label="Téléphone" placeholder="Ex. 694 74 42 42" keyboardType="phone-pad" value={phone} onChangeText={setPhone} containerStyle={styles.field} />
            <TextField label="Mot de passe" placeholder="••••••••" password value={password} onChangeText={setPassword} containerStyle={styles.field} />

            {/* --- Champs Élève --- */}
            {role === 'student' && (
              <>
                <Txt weight={800} size={13} color={colors.textMuted} style={styles.selLabel}>
                  Date de naissance
                </Txt>
                <View style={styles.dateRow}>
                  <PickerField placeholder="Jour" title="Jour" value={day} options={DAY_OPTIONS} onSelect={setDay} containerStyle={styles.dateCol} />
                  <PickerField placeholder="Mois" title="Mois" value={month} options={MONTH_OPTIONS} onSelect={setMonth} containerStyle={styles.dateColWide} />
                  <PickerField placeholder="Année" title="Année" value={year} options={YEAR_OPTIONS} onSelect={setYear} containerStyle={styles.dateCol} />
                </View>
                <TextField label="École" placeholder="Nom de ton école" value={school} onChangeText={setSchool} containerStyle={styles.field} />
              </>
            )}

            {/* --- Champs Enseignant --- */}
            {role === 'teacher' && (
              <>
                <Txt weight={800} size={13} color={colors.textMuted} style={styles.selLabel}>
                  Matière(s) enseignée(s)
                </Txt>
                <View style={styles.chips}>
                  {SUBJECTS.map((s) => {
                    const on = subjects.includes(s.id);
                    return (
                      <Pressable
                        key={s.id}
                        onPress={() => toggleSubject(s.id)}
                        style={[styles.chip, on ? styles.chipOn : styles.chipOff]}
                      >
                        <Txt weight={800} size={13} color={on ? colors.white : colors.inkBody}>
                          {s.name}
                        </Txt>
                      </Pressable>
                    );
                  })}
                </View>
                <TextField
                  label="École(s) — facultatif"
                  placeholder="Séparées par des virgules"
                  value={schoolsText}
                  onChangeText={setSchoolsText}
                  containerStyle={styles.field}
                />
              </>
            )}

            {/* --- Champs Parent --- */}
            {role === 'parent' && (
              <TextField
                label="Nombre d'enfants"
                placeholder="Ex. 2"
                keyboardType="number-pad"
                value={childrenCount}
                onChangeText={setChildrenCount}
                containerStyle={styles.field}
              />
            )}

            {/* Consentement (élève) */}
            {role === 'student' && (
              <Pressable style={styles.consent} onPress={() => setConsent((c) => !c)}>
                <View style={[styles.checkbox, consent ? styles.checkboxOn : styles.checkboxOff]}>
                  {consent ? <CheckIcon size={14} color={colors.white} /> : null}
                </View>
                <Txt weight={700} size={12} color={colors.textMutedAlt} lineHeight={17} style={styles.consentText}>
                  J'accepte de recevoir des conseils pédagogiques et des offres de lasylab.
                </Txt>
              </Pressable>
            )}

            {error ? (
              <Txt weight={700} size={13} color={colors.redText} align="center" style={styles.error}>
                {error}
              </Txt>
            ) : null}

            <Button label={loading ? '…' : 'Terminer'} onPress={submit} disabled={loading} style={styles.submit} />
          </View>

          <Txt weight={700} size={14} color={colors.textMuted} align="center" style={styles.loginRow}>
            Tu as déjà un compte?{' '}
            <Txt weight={800} size={14} color={colors.ink} onPress={() => navigation.navigate('Connexion')}>
              Connecte-toi
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
  card: { backgroundColor: colors.white, borderRadius: radius.cardXl, padding: 22 },
  logoRow: { alignItems: 'center' },
  h1: { marginTop: 8, marginBottom: 8 },
  rolePill: {
    alignSelf: 'center',
    backgroundColor: colors.blueTintSoft,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    marginBottom: 8,
  },
  field: { marginTop: 14 },
  selLabel: { marginTop: 14, marginBottom: 5, marginLeft: 6 },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateCol: { flex: 1 },
  dateColWide: { flex: 1.4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1.5 },
  chipOn: { backgroundColor: colors.blue, borderColor: colors.blue },
  chipOff: { backgroundColor: colors.white, borderColor: colors.border },
  consent: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16, marginHorizontal: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: colors.green, borderWidth: 2, borderColor: colors.green },
  checkboxOff: { backgroundColor: colors.white, borderWidth: 2, borderColor: '#cfcabf' },
  consentText: { flex: 1 },
  error: { marginTop: 14 },
  submit: { marginTop: 20 },
  loginRow: { marginVertical: 14 },
});
