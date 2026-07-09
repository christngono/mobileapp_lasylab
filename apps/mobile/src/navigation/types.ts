import type { NavigatorScreenParams } from '@react-navigation/native';
import type { SubjectId } from '@lasylab/shared';

/** Onglets principaux (barre de navigation basse). */
export type MainTabsParamList = {
  Home: undefined; // Études
  Epreuves: undefined; // Épreuves-exo
  Chat: undefined; // Lasy IA
  Status: undefined;
};

/** Pile racine : onboarding, auth, onglets, et écrans empilés. */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Inscription: undefined;
  Connexion: undefined;
  ChooseProfile: undefined;
  ChooseClasse: undefined;
  ChooseObjectif: undefined;
  Main: NavigatorScreenParams<MainTabsParamList> | undefined;
  Parcours: { subjectId: SubjectId };
  Cours: { subjectId: SubjectId; nodeIndex: number };
  Lesson: { subjectId: SubjectId; nodeIndex: number };
  Quiz: { subjectId: SubjectId; nodeIndex: number };
  EpreuveDetail: { activityId: string };
  Profile: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
