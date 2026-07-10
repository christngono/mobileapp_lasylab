import { optionState } from './quiz';

describe('optionState', () => {
  it('avant vérification : sélectionnée ou neutre', () => {
    expect(optionState(1, 1, false, 2)).toBe('selected');
    expect(optionState(0, 1, false, 2)).toBe('idle');
  });

  it('après vérification : bonne réponse en vert', () => {
    expect(optionState(2, 1, true, 2)).toBe('correct');
  });

  it('après vérification : mauvaise réponse choisie en rouge', () => {
    expect(optionState(1, 1, true, 2)).toBe('wrong');
  });

  it('après vérification : autres options grisées', () => {
    expect(optionState(0, 1, true, 2)).toBe('muted');
  });
});
