import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CLASSES, type ChildDTO, type Classe } from '@lasylab/shared';
import { childrenApi } from '../api/children';
import { useAsync } from '../hooks/useAsync';
import { useSession } from '../store/session';
import { ApiError } from '../api/client';
import {
  Screen,
  Logo,
  Txt,
  Button,
  TextField,
  Pill,
  CheckIcon,
  LoadingView,
  ErrorView,
} from '../components';
import { colors, radius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ParentHome'>;

const GRADIENTS: [string, string][] = [
  ['#FFC400', '#E8531E'],
  ['#39B6E8', '#2BA989'],
  ['#7C6FE8', '#5849c4'],
  ['#5BC406', '#3f9a02'],
  ['#F6A623', '#e08a0c'],
];

export default function ParentHomeScreen({ navigation }: Props) {
  const { account, logout, enterAsChild } = useSession();
  const { data, loading, error, reload } = useAsync(() => childrenApi.list(), []);
  useFocusEffect(useCallback(() => reload(), [reload]));

  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [entering, setEntering] = useState(false);

  const onEnter = async (child: ChildDTO) => {
    if (editing || entering) return;
    setEntering(true);
    try {
      await enterAsChild(child.id);
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch {
      setEntering(false);
    }
  };

  const onLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Logo height={26} />
        <Pressable onPress={onLogout} hitSlop={8}>
          <Txt weight={800} size={13} color={colors.textMutedAlt}>
            Déconnexion
          </Txt>
        </Pressable>
      </View>

      <Txt family="baloo" weight={800} size={26} color={colors.inkTitle} align="center" style={styles.title}>
        Qui apprend aujourd'hui ?
      </Txt>
      <Txt weight={700} size={14} color={colors.textMuted} align="center" style={styles.sub}>
        {account?.name ? `Espace de ${account.name}` : 'Choisis un profil'}
      </Txt>

      {loading && !data ? (
        <LoadingView />
      ) : error && !data ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {data?.map((child, i) => (
            <View key={child.id} style={styles.tileWrap}>
              <Pressable style={styles.tile} onPress={() => onEnter(child)}>
                <LinearGradient colors={GRADIENTS[i % GRADIENTS.length]} style={styles.avatar}>
                  <Txt family="baloo" weight={800} size={34} color={colors.white}>
                    {child.name.charAt(0).toUpperCase()}
                  </Txt>
                </LinearGradient>
                <Txt family="baloo" weight={800} size={15} color={colors.ink}>
                  {child.name}
                </Txt>
                {child.classe ? (
                  <Txt weight={700} size={12} color={colors.textMuted}>
                    {child.classe}
                  </Txt>
                ) : null}
              </Pressable>
              {editing ? (
                <Pressable style={styles.deleteBadge} onPress={() => confirmDelete(child, reload)}>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
                  </Svg>
                </Pressable>
              ) : null}
            </View>
          ))}

          {/* Ajouter un profil */}
          <Pressable style={styles.tileWrap} onPress={() => setAddOpen(true)}>
            <View style={styles.tile}>
              <View style={[styles.avatar, styles.addAvatar]}>
                <Svg width={40} height={40} viewBox="0 0 24 24">
                  <Path d="M12 5v14M5 12h14" stroke={colors.textDisabled} strokeWidth={2.6} strokeLinecap="round" />
                </Svg>
              </View>
              <Txt family="baloo" weight={800} size={15} color={colors.textMutedAlt}>
                Ajouter
              </Txt>
            </View>
          </Pressable>
        </ScrollView>
      )}

      <Pressable style={styles.editBtn} onPress={() => setEditing((e) => !e)}>
        <Txt weight={800} size={15} color={colors.textMuted}>
          {editing ? 'Terminé' : 'Gérer les profils'}
        </Txt>
      </Pressable>

      <AddChildModal visible={addOpen} onClose={() => setAddOpen(false)} onCreated={reload} />
    </Screen>
  );
}

async function confirmDelete(child: ChildDTO, reload: () => void) {
  // Suppression directe (la confirmation native serait ajoutée avec Alert).
  try {
    await childrenApi.remove(child.id);
    reload();
  } catch {
    // ignore
  }
}

function AddChildModal({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [classe, setClasse] = useState<Classe | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const create = async () => {
    if (!name.trim()) {
      setErr('Indique le prénom de l\'enfant.');
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await childrenApi.create(name.trim(), classe ?? undefined);
      setName('');
      setClasse(null);
      onCreated();
      onClose();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Erreur.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Txt family="baloo" weight={800} size={20} color={colors.inkTitle} align="center" style={styles.sheetTitle}>
            Nouveau profil enfant
          </Txt>
          <TextField label="Prénom" placeholder="Ex. Tatiane" value={name} onChangeText={setName} />
          <Txt weight={800} size={13} color={colors.textMuted} style={styles.classeLabel}>
            Classe (facultatif)
          </Txt>
          <View style={styles.classeGrid}>
            {CLASSES.map((c) => (
              <Pill key={c} label={c} selected={classe === c} onPress={() => setClasse(classe === c ? null : c)} />
            ))}
          </View>
          {err ? (
            <Txt weight={700} size={13} color={colors.redText} align="center" style={styles.err}>
              {err}
            </Txt>
          ) : null}
          <Button label={saving ? '…' : 'Créer le profil'} disabled={saving} onPress={create} style={styles.createBtn} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const TILE = '30%';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  title: { marginTop: 24, marginBottom: 4 },
  sub: { marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tileWrap: { width: TILE, alignItems: 'center' },
  tile: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  addAvatar: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  deleteBadge: {
    position: 'absolute',
    top: -4,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.redShadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: { alignItems: 'center', paddingVertical: 18 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    padding: 22,
    paddingBottom: 34,
  },
  sheetTitle: { marginBottom: 16 },
  classeLabel: { marginTop: 16, marginBottom: 8, marginLeft: 6 },
  classeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  err: { marginTop: 12 },
  createBtn: { marginTop: 20 },
});
