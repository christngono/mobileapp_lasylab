import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { activitiesApi } from '../api/content';
import { useAsync } from '../hooks/useAsync';
import { Screen, Txt, Button, CloseIcon, LoadingView, ErrorView } from '../components';
import { colors, radius, shadows } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EpreuveDetail'>;

export default function EpreuveDetailScreen({ navigation, route }: Props) {
  const { activityId } = route.params;
  const { data, loading, error, reload } = useAsync(() => activitiesApi.get(activityId), [activityId]);

  const paragraphs = (data?.body ?? 'Contenu à venir.').split('\n');

  return (
    <Screen>
      <View style={styles.head}>
        <Pressable style={styles.close} onPress={() => navigation.goBack()} hitSlop={8}>
          <CloseIcon size={26} color={colors.ink} />
        </Pressable>
        <Txt family="baloo" weight={800} size={18} color={colors.inkStrong}>
          {data?.title ?? 'Activité'}
        </Txt>
      </View>

      {loading && !data ? (
        <LoadingView />
      ) : error && !data ? (
        <ErrorView message={error} onRetry={reload} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              {paragraphs.map((line, idx) => {
                if (line.length === 0) return <View key={idx} style={styles.gap} />;
                // Première ligne = titre principal.
                const isHeading = idx === 0;
                return (
                  <Txt
                    key={idx}
                    weight={isHeading ? 700 : 600}
                    size={isHeading ? 17 : 15}
                    color={isHeading ? '#29ABE2' : colors.ink}
                    align={isHeading ? 'center' : 'left'}
                    lineHeight={isHeading ? 22 : 22}
                    style={styles.line}
                  >
                    {line}
                  </Txt>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Passez le quiz"
              pill
              onPress={() => navigation.navigate('Quiz', { subjectId: 'philosophie', nodeIndex: 1 })}
            />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  close: { position: 'absolute', left: 16 },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 22, ...shadows.card },
  line: { marginBottom: 6 },
  gap: { height: 10 },
  footer: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 20, backgroundColor: colors.screen },
});
