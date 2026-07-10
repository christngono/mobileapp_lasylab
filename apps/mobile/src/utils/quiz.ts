export type OptState = 'idle' | 'selected' | 'correct' | 'wrong' | 'muted';

/**
 * Détermine l'état visuel d'une option de quiz.
 * Avant vérification : sélectionnée ou neutre. Après : bonne réponse (verte),
 * mauvaise réponse choisie (rouge), ou grisée.
 */
export function optionState(
  idx: number,
  selected: number | null,
  checked: boolean,
  correct: number,
): OptState {
  if (!checked) return idx === selected ? 'selected' : 'idle';
  if (idx === correct) return 'correct';
  if (idx === selected) return 'wrong';
  return 'muted';
}
