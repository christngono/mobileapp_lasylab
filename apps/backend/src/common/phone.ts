/**
 * Normalise un numéro de téléphone : on ne conserve que les chiffres
 * (espaces, tirets, parenthèses et « + » sont retirés). Aucun indicatif pays
 * n'est ajouté — l'utilisateur saisit son numéro local (ex. « 694 74 42 42 92 »).
 */
export function normalizePhone(phone: string): string {
  return (phone ?? '').replace(/\D/g, '');
}
