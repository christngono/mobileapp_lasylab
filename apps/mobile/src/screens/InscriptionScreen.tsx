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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SUBJECTS, type SubjectId } from '@lasylab/shared';
import { ApiError } from '../api/client';
import { useSession } from '../store/session';
import { Screen, Logo, Button, Txt, TextField, ChevronDown, CheckIcon } from '../components';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Inscription'>;

const YEARS = Array.from({ length: 14 }, (_, i) => 2016 - i);

const ROLE_LABEL: Record<string, string> = {
  student: 'Élève',
  teacher: 'Enseignant',
  parent: 'Parent',
};

export default function InscriptionScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const { register } = useSession();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  // Élève
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [school, setSchool] = useState('');
  const [consent, setConsent] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
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
        ...(role === 'student' ? { birthYear: birthYear ?? undefined, school: school.trim() || undefined } : {}),
        ...(role === 'teacher'
          ? {
              subjects,
              schools: schoolsText.split(',').map((s) => s.trim()).filter(Boolean),
            }
          : {}),
        ...(role === 'parent' ? { childrenCount: Number(childrenCount) } : {}),
      });

      if (role === 'parent') {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
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
            <TextField label="Téléphone" placeholder="+229 ..." keyboardType="phone-pad" value={phone} onChangeText={setPhone} containerStyle={styles.field} />
            <TextField label="Mot de passe" placeholder="••••••••" password value={password} onChangeText={setPassword} containerStyle={styles.field} />

            {/* --- Champs Élève --- */}
            {role === 'student' && (
              <>
                <Txt weight={800} size={13} color={colors.textMuted} style={styles.selLabel}>
                  Date de naissance
                </Txt>
                <Pressable style={styles.select} onPress={() => setYearOpen(true)}>
                  <Txt weight={700} size={14} color={birthYear ? colors.ink : colors.textMuted}>
                    {birthYear ? String(birthYear) : 'Sélectionne une année'}
                  </Txt>
                  <ChevronDown />
                </Pressable>
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

      {/* Sélecteur d'année (élève) */}
      <Modal visible={yearOpen} transparent animationType="fade" onRequestClose={() => setYearOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setYearOpen(false)}>
          <View style={styles.modalSheet}>
            <Txt family="baloo" weight={800} size={18} color={colors.ink} align="center" style={styles.modalTitle}>
              Année de naissance
            </Txt>
            <ScrollView>
              {YEARS.map((y) => (
                <Pressable key={y} style={styles.yearItem} onPress={() => { setBirthYear(y); setYearOpen(false); }}>
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
