/**
 * Palette Lasylab — extraite fidèlement du design de référence
 * (Lasylab App.dc.html). Chaque token correspond à une valeur réellement
 * employée dans le prototype. Ne pas inventer de nouvelles teintes.
 */
export const colors = {
  // Fonds
  appBgTop: '#efeae3', // haut du dégradé radial de fond
  appBgBottom: '#e3ddd5', // bas du dégradé
  screen: '#fbf4ef', // fond des écrans dans le cadre
  surface: '#ffffff', // cartes
  phoneFrame: '#1c1d21', // châssis du téléphone / encoche

  // Vert (action principale, validation) — boutons 3D "Duolingo"
  green: '#5BC406',
  greenShadow: '#4a9c00', // liseré bas des boutons verts
  greenDeep: '#3f9a02',
  greenText: '#3a8a01',
  greenTint: '#E8F8DC',
  greenTintBorder: '#B6E89A',

  // Bleu
  blue: '#39B6E8',
  blueShadow: '#1f93c4',
  blueStory: '#29ABE2',
  blueStoryDeep: '#1e7fb0',
  blueText: '#1693CE',
  blueTint: '#DCEFFB',
  blueTintSoft: '#E3F4FD',
  blueBorder: '#5BC5F2',

  // Orange / marque
  brand: '#E8531E', // orange de marque (onglet Lasy IA actif, accents)
  redOrange: '#E8412B',
  amber: '#F6A623', // orange doux (philosophie, accents)
  amberDeep: '#e08a0c',

  // Jaune
  yellow: '#FFC400',
  yellowShadow: '#E0A800',
  yellowDeep: '#F2A900',
  yellowText: '#FFB300',
  yellowTint: '#FFF6DB',
  yellowTintBorder: '#FFE08A',
  yellowPillShadow: '#d9a600',

  // Violet
  purple: '#7C6FE8',
  purpleShadow: '#5849c4',
  purpleTint: '#EDEAFB',
  purpleTintBorder: '#C8BFF0',

  // Teal
  teal: '#2BA989',

  // Rouge (erreur / mauvaise réponse)
  red: '#FF6B6B',
  redShadow: '#e23b3b',
  redText: '#d63333',
  redTint: '#FDE7E7',

  // Texte
  ink: '#3c3c3c', // texte principal
  inkStrong: '#2f2f2f',
  inkTitle: '#444444',
  inkBody: '#5a5249',
  inkMuted: '#6b6258',
  textMuted: '#8a8378',
  textMutedAlt: '#9b948a',
  textFaint: '#a8a29a',
  textFaintAlt: '#b0a99e',
  textDisabled: '#c2bcb2',

  // Bordures / séparateurs
  border: '#e2ddd4',
  borderSoft: '#e6e3df',
  borderNeutral: '#ececec',
  divider: '#efeae3',
  dividerWarm: '#f0ebe4',
  inputBorder: '#d9d4cb',

  white: '#ffffff',
  black: '#000000',
} as const;

export type ColorToken = keyof typeof colors;
