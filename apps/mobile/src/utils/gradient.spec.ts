import { parseGradient } from './gradient';

describe('parseGradient', () => {
  it('extrait les deux couleurs hex du dégradé', () => {
    expect(parseGradient('linear-gradient(165deg,#29ABE2,#1E8FC4)')).toEqual(['#29ABE2', '#1E8FC4']);
  });

  it('retourne un dégradé par défaut si le format est invalide', () => {
    expect(parseGradient('rgba(0,0,0,1)')).toEqual(['#29ABE2', '#1E8FC4']);
  });
});
