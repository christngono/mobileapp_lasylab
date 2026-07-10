import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useSession } from '../store/session';
import { MainTabs } from './MainTabs';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import InscriptionScreen from '../screens/InscriptionScreen';
import ConnexionScreen from '../screens/ConnexionScreen';
import ChooseProfileScreen from '../screens/ChooseProfileScreen';
import CongratulationsScreen from '../screens/CongratulationsScreen';
import ChooseClasseScreen from '../screens/ChooseClasseScreen';
import ChooseObjectifScreen from '../screens/ChooseObjectifScreen';
import ParcoursScreen from '../screens/ParcoursScreen';
import CoursScreen from '../screens/CoursScreen';
import LessonScreen from '../screens/LessonScreen';
import QuizScreen from '../screens/QuizScreen';
import EpreuveDetailScreen from '../screens/EpreuveDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Pile racine de l'application. Enchaînement onboarding → auth → onglets,
 * plus les écrans empilés (parcours, cours, leçon, quiz, profil…).
 * Le flux d'authentification réel (garde selon l'état connecté) sera branché
 * à l'étape 5.
 */
export function RootNavigator() {
  const { isAuthenticated } = useSession();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Main' : 'Splash'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ChooseProfile" component={ChooseProfileScreen} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} />
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
        <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
        <Stack.Screen name="ChooseClasse" component={ChooseClasseScreen} />
        <Stack.Screen name="ChooseObjectif" component={ChooseObjectifScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Parcours" component={ParcoursScreen} />
        <Stack.Screen name="Cours" component={CoursScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="EpreuveDetail" component={EpreuveDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
