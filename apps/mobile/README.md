# Lasylab — Mobile (Expo + React Native)

Application mobile Lasylab. Le design de référence (`Lasylab App.dc.html`) est
reproduit fidèlement via un thème de tokens et une bibliothèque de composants.

## Prérequis

- Node ≥ 20
- Expo Go (iOS/Android) ou un simulateur

## Mise en route

```bash
# depuis la racine du monorepo
npm install
npm run shared:build

cd apps/mobile
# Réconcilie les versions natives avec la SDK Expo installée :
npx expo install
npm run start        # puis 'i' (iOS), 'a' (Android)
```

> Les versions des dépendances natives (`react-native-svg`, `react-native-screens`,
> `react-native-safe-area-context`, `expo-linear-gradient`…) doivent correspondre à
> la SDK Expo : lancer `npx expo install` après le premier `npm install` pour les
> aligner automatiquement.

## Architecture

```
src/
├── theme/        # design tokens extraits du HTML (couleurs, typo, layout) + polices
├── components/   # bibliothèque UI : Txt, Screen, Button, Card, ProgressBar,
│                 # ProgressRing, Pill, Logo/Mascot, icônes SVG
├── navigation/   # RootNavigator (stack) + MainTabs (onglets) + TabBar
└── screens/      # un fichier par écran (placeholders remplis aux étapes 5-10)
```

### Thème

- **Couleurs** : `src/theme/colors.ts` — palette exacte du design.
- **Typographie** : Baloo 2 (titres/boutons) + Nunito (corps), chargées via
  `@expo-google-fonts/*` et le hook `useAppFonts`.
- **Composant `Txt`** : applique la bonne police selon `family` + `weight`.

### Navigation

- Pile racine : `Splash → Onboarding → Auth → Main (onglets)` + écrans empilés
  (Parcours, Cours, Leçon, Quiz, Épreuve, Profil).
- Onglets : Études · Épreuves-exo · Lasy IA · Status, avec une `TabBar`
  personnalisée (actif = orange marque `#E8531E`).
