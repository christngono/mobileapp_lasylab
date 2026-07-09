import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabsParamList } from './types';
import { TabBar } from './TabBar';
import HomeScreen from '../screens/HomeScreen';
import EpreuvesScreen from '../screens/EpreuvesScreen';
import ChatScreen from '../screens/ChatScreen';
import StatusScreen from '../screens/StatusScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

/** Onglets principaux : Études, Épreuves-exo, Lasy IA, Status. */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Epreuves" component={EpreuvesScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
    </Tab.Navigator>
  );
}
