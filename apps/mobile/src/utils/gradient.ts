/** Extrait les deux couleurs d'un dégradé CSS `linear-gradient(...,#aaa,#bbb)`. */
export function parseGradient(bg: string): [string, string] {
  const hex = bg.match(/#[0-9A-Fa-f]{6}/g);
  if (hex && hex.length >= 2) return [hex[0], hex[1]];
  return ['#29ABE2', '#1E8FC4'];
}
