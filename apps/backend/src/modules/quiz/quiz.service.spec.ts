import { QuizService } from './quiz.service';

const QUESTIONS = [
  { id: 'q1', order: 0, question: 'Q1', options: ['a', 'b', 'c', 'd'], correctIndex: 0 },
  { id: 'q2', order: 1, question: 'Q2', options: ['a', 'b', 'c', 'd'], correctIndex: 2 },
  { id: 'q3', order: 2, question: 'Q3', options: ['a', 'b', 'c', 'd'], correctIndex: 1 },
];

function makeService() {
  const quizResultCreate = jest.fn().mockResolvedValue({});
  const userUpdate = jest.fn().mockResolvedValue({});
  const completeNode = jest.fn().mockResolvedValue({});
  const prisma = {
    subject: { findUnique: jest.fn().mockResolvedValue({ id: 'maths' }) },
    quiz: {
      findUnique: jest.fn().mockResolvedValue({ id: 'quiz1', title: 'Quiz', questions: QUESTIONS }),
    },
    quizResult: { create: quizResultCreate },
    user: { update: userUpdate },
    badge: { findUnique: jest.fn().mockResolvedValue(null) },
    userBadge: { create: jest.fn().mockResolvedValue({}) },
  };
  const progress = { completeNode };
  const service = new QuizService(prisma as never, progress as never);
  return { service, quizResultCreate, userUpdate, completeNode };
}

describe('QuizService', () => {
  it('renvoie le quiz avec correctIndex pour le feedback immédiat', async () => {
    const { service } = makeService();
    const quiz = await service.getQuiz('maths', 1);
    expect(quiz.questions).toHaveLength(3);
    expect(quiz.questions[1].correctIndex).toBe(2);
  });

  it('corrige le quiz : score, XP et détail des corrections', async () => {
    const { service, quizResultCreate, userUpdate, completeNode } = makeService();
    // Réponses : bonne, mauvaise, bonne → 2/3
    const result = await service.submit('u1', 'maths', 1, [0, 1, 1]);

    expect(result.score).toBe(2);
    expect(result.total).toBe(3);
    expect(result.xpEarned).toBe(20);
    expect(result.corrections.map((c) => c.wasCorrect)).toEqual([true, false, true]);

    // Persistance + XP + avance de progression.
    expect(quizResultCreate).toHaveBeenCalled();
    expect(userUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { xp: { increment: 20 } } }),
    );
    expect(completeNode).toHaveBeenCalledWith('u1', 'maths', 1);
  });

  it('score nul si toutes les réponses sont fausses', async () => {
    const { service } = makeService();
    const result = await service.submit('u1', 'maths', 1, [1, 0, 0]);
    expect(result.score).toBe(0);
    expect(result.xpEarned).toBe(0);
  });
});
