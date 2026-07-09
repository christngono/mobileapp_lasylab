/**
 * Référentiel des matières — extrait du design (SUBJECTS dans le mock).
 * Les couleurs correspondent aux tokens de la charte Lasylab.
 */

export type SubjectId =
  | 'maths'
  | 'francais'
  | 'svt'
  | 'philosophie'
  | 'informatique'
  | 'anglais';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  /** Libellé court en majuscules (badges, pastilles de parcours). */
  short: string;
  /** Couleur d'accent de la matière. */
  color: string;
  /** Couleur de la barre de progression. */
  barColor: string;
}

export const SUBJECTS: SubjectMeta[] = [
  { id: 'maths', name: 'Mathématiques', short: 'MATHÉMATIQUES', color: '#E8412B', barColor: '#5BC406' },
  { id: 'francais', name: 'Français', short: 'FRANÇAIS', color: '#39B6E8', barColor: '#39B6E8' },
  { id: 'svt', name: 'SVT', short: 'SVT', color: '#5BC406', barColor: '#5BC406' },
  { id: 'philosophie', name: 'Philosophie', short: 'PHILOSOPHIE', color: '#F6A623', barColor: '#F6A623' },
  { id: 'informatique', name: 'Informatique', short: 'INFORMATIQUE', color: '#7C6FE8', barColor: '#7C6FE8' },
  { id: 'anglais', name: 'Anglais', short: 'ANGLAIS', color: '#2BA989', barColor: '#2BA989' },
];

/** Nombre total de nœuds d'un parcours matière (TOTAL dans le mock). */
export const PARCOURS_TOTAL_NODES = 21;

/** Classes proposées à l'inscription (CLASSES dans le mock). */
export const CLASSES = ['6e', '5e', '4e', '3e', '1ère', '2nde', 'Tle'] as const;
export type Classe = (typeof CLASSES)[number];

/** Objectifs pédagogiques proposés à l'onboarding (OBJECTIFS dans le mock). */
export const OBJECTIFS = [
  'Augmenter mes notes',
  'Réussir mon examen',
  'Comprendre les notions compliquées',
  'Améliorer mon niveau',
] as const;
export type Objectif = (typeof OBJECTIFS)[number];

/** Nature d'un nœud de parcours (introduction, leçon ou quiz). */
export type NodeKind = 'intro' | 'lesson' | 'quiz';

export function nodeKind(index: number): NodeKind {
  if (index === 0) return 'intro';
  return index % 2 === 1 ? 'quiz' : 'lesson';
}
