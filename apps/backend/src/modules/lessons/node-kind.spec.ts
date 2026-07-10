import { nodeKind, PARCOURS_TOTAL_NODES } from '@lasylab/shared';

describe('nodeKind (logique de parcours partagée)', () => {
  it('le premier nœud est une introduction', () => {
    expect(nodeKind(0)).toBe('intro');
  });

  it('alterne quiz (impairs) et leçons (pairs)', () => {
    expect(nodeKind(1)).toBe('quiz');
    expect(nodeKind(2)).toBe('lesson');
    expect(nodeKind(3)).toBe('quiz');
    expect(nodeKind(4)).toBe('lesson');
  });

  it('définit un total de 21 nœuds', () => {
    expect(PARCOURS_TOTAL_NODES).toBe(21);
  });
});
