import type { Classe, NodeKind, Objectif, SubjectId, SubjectMeta } from './subjects';

/** Rôle d'un compte : élève ou parent. */
export type UserRole = 'student' | 'parent';

export interface UserDTO {
  id: string;
  role: UserRole;
  name: string;
  firstName?: string | null;
  phone: string;
  birthYear?: number | null;
  school?: string | null;
  classe?: Classe | null;
  objectif?: Objectif | null;
  createdAt: string;
}

/* ------------------------------- Auth ------------------------------- */

export interface RegisterDTO {
  name: string;
  firstName?: string;
  phone: string;
  password: string;
  birthYear?: number;
  school?: string;
  role?: UserRole;
  consent?: boolean;
}

export interface LoginDTO {
  phone: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  user: UserDTO;
}

/* ------------------------------ Contenu ----------------------------- */

/** Une diapositive de leçon (mode "stories"). */
export interface LessonSlideDTO {
  big: string;
  sub: string;
}

export interface LessonDTO {
  id: string;
  subjectId: SubjectId;
  /** Position du nœud dans le parcours (0..PARCOURS_TOTAL_NODES-1). */
  nodeIndex: number;
  kind: NodeKind;
  title: string;
  slides: LessonSlideDTO[];
  /** Contenu long optionnel affiché dans l'écran Cours. */
  body?: string | null;
}

export interface QuizQuestionDTO {
  id: string;
  question: string;
  options: string[];
  /** Index de la bonne réponse (côté serveur uniquement lors de la correction). */
  correctIndex?: number;
}

export interface QuizDTO {
  id: string;
  subjectId: SubjectId;
  nodeIndex: number;
  title: string;
  questions: QuizQuestionDTO[];
}

/** Soumission d'un quiz : matière, nœud et index choisis par question. */
export interface QuizSubmissionDTO {
  subjectId: SubjectId;
  nodeIndex: number;
  answers: number[];
}

export interface QuizResultDTO {
  score: number;
  total: number;
  xpEarned: number;
  /** Détail par question : bonne réponse attendue. */
  corrections: { questionId: string; correctIndex: number; wasCorrect: boolean }[];
}

/* --------------------- Activités / Épreuves-exo --------------------- */

export type ActivityCategory = 'METHODE' | 'DEFINITION' | 'EPREUVE' | 'EXERCICE';

export interface ActivityDTO {
  id: string;
  category: ActivityCategory;
  title: string;
  subjectLabel: string;
  subtitle?: string | null;
  body?: string | null;
  progressPct?: number | null;
}

/* ------------------------------ Parcours ---------------------------- */

export type NodeStatus = 'done' | 'current' | 'locked';

export interface ParcoursNodeDTO {
  nodeIndex: number;
  kind: NodeKind;
  label: string;
  status: NodeStatus;
  /** Vrai si une leçon/un quiz existe réellement pour ce nœud. */
  hasContent: boolean;
}

export interface ParcoursDTO {
  subject: SubjectMeta;
  total: number;
  completedNodes: number;
  nodes: ParcoursNodeDTO[];
}

/** Marque un nœud comme terminé (progression). */
export interface CompleteNodeDTO {
  subjectId: SubjectId;
  nodeIndex: number;
}

/* ---------------------------- Progression --------------------------- */

export interface ProgressDTO {
  /** Progression (nombre de nœuds validés) par matière. */
  bySubject: Record<SubjectId, number>;
  streak: number;
  gems: number;
  xp: number;
}

export interface BadgeDTO {
  id: string;
  label: string;
  /** Emoji ou identifiant d'icône. */
  icon: string;
  earned: boolean;
}

/* ------------------------------ Status ------------------------------ */

export interface StoryDTO {
  id: string;
  bg: string;
  tag: string;
  title: string;
  text: string;
}

/* ------------------------------ Profil ------------------------------ */

export interface ProfileSubjectProgressDTO {
  subjectId: SubjectId;
  name: string;
  color: string;
  /** Pourcentage de progression (0-100). */
  pct: number;
}

/** Données agrégées du tableau de bord Profil élève. */
export interface ProfileDTO {
  user: UserDTO;
  streak: number;
  gems: number;
  xp: number;
  badges: BadgeDTO[];
  progression: ProfileSubjectProgressDTO[];
}

/* ------------------------- Chat socratique -------------------------- */

export type ChatRole = 'user' | 'assistant';

export interface ChatMessageDTO {
  role: ChatRole;
  text: string;
}

export interface SocraticSessionDTO {
  id: string;
  subjectId?: SubjectId | null;
  messages: ChatMessageDTO[];
  createdAt: string;
}

/** Requête envoyée au module socratique. */
export interface SocraticAskDTO {
  sessionId?: string;
  subjectId?: SubjectId;
  message: string;
}

/** Réponse du module socratique (jamais la solution directe : une relance). */
export interface SocraticReplyDTO {
  sessionId: string;
  reply: string;
}
