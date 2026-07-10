import { buildSystemPrompt } from './socratic.prompt';

describe('buildSystemPrompt', () => {
  it('impose de ne jamais donner la réponse directement', () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain('JAMAIS');
    expect(prompt.toLowerCase()).toContain('socratique');
    expect(prompt).toContain('une SEULE question à la fois');
  });

  it('injecte le contexte matière et classe quand fournis', () => {
    const prompt = buildSystemPrompt({ subjectName: 'Mathématiques', classe: '1ère' });
    expect(prompt).toContain('Mathématiques');
    expect(prompt).toContain('1ère');
  });

  it('reste valide sans contexte', () => {
    expect(buildSystemPrompt()).not.toContain('undefined');
  });
});
