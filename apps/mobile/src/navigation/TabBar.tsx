import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Txt, HomeIcon, TasksIcon, ChatIcon, StatusIcon } from '../components';
import { colors } from '../theme';

const LABELS: Record<string, string> = {
  Home: 'Études',
  Epreuves: 'Épreuves-exo',
  Chat: 'Lasy IA',
  Status: 'Status',
};

function TabIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case 'Home':
      return <HomeIcon color={color} />;
    case 'Epreuves':
      return <TasksIcon color={color} />;
    case 'Chat':
      return <ChatIcon color={color} />;
    case 'Status':
      return <StatusIcon color={color} />;
    default:
      return null;
  }
}

/** Barre de navigation basse reprenant le design (actif = orange marque). */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? colors.brand : colors.textDisabled;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} style={styles.tab} onPress={onPress}>
            <TabIcon name={route.name} color={color} />
            <Txt weight={800} size={10} color={color}>
              {LABELS[route.name] ?? route.name}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
});
