import { Injectable, NotFoundException } from '@nestjs/common';
import type { QuizDTO, QuizResultDTO, SubjectId } from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';

interface InternalQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

/** Quiz générique utilisé quand aucun quiz n'est encore rédigé pour le nœud. */
const FALLBACK_QUESTIONS: InternalQuestion[] = [
  { id: 'fb-1', question: 'Réviser régulièrement aide surtout à…', options: ['Mémoriser durablement', 'Perdre du temps', 'Oublier plus vite', 'Rien'], correctIndex: 0 },
  { id: 'fb-2', question: 'Avant un quiz, il vaut mieux…', options: ['Ne rien faire', 'Relire la leçon', 'Dormir en classe', 'Deviner'], correctIndex: 1 },
  { id: 'fb-3', question: 'Une bonne méthode, c’est…', options: ['Tout apprendre par cœur', 'Comprendre puis s’entraîner', 'Copier', 'Abandonner'], correctIndex: 1 },
];

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progress: ProgressService,
  ) {}

  /** Charge les questions d'un nœud (quiz réel ou fallback générique). */
  private async loadQuestions(
    subjectId: string,
    nodeIndex: number,
  ): Promise<{ quizId: string | null; title: string; questions: InternalQuestion[] }> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { subjectId_nodeIndex: { subjectId, nodeIndex } },
      include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (quiz) {
      return {
        quizId: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
        })),
      };
    }
    return { quizId: null, title: 'Quiz', questions: FALLBACK_QUESTIONS };
  }

  /** Renvoie le quiz d'un nœud (avec correctIndex pour le feedback immédiat). */
  async getQuiz(subjectId: string, nodeIndex: number): Promise<QuizDTO> {
    const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Matière introuvable.');
    }
    const { quizId, title, questions } = await this.loadQuestions(subjectId, nodeIndex);
    return {
      id: quizId ?? `${subjectId}-${nodeIndex}-fallback`,
      subjectId: subjectId as SubjectId,
      nodeIndex,
      title,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    };
  }

  /**
   * Corrige un quiz : calcule le score, gagne de l'XP, persiste le résultat
   * (si quiz réel), attribue le badge « 1er quiz », et fait avancer la
   * progression du parcours (le nœud quiz est validé).
   */
  async submit(
    userId: string,
    subjectId: string,
    nodeIndex: number,
    answers: number[],
  ): Promise<QuizResultDTO> {
    const { quizId, questions } = await this.loadQuestions(subjectId, nodeIndex);

    const corrections = questions.map((q, i) => {
      const wasCorrect = answers[i] === q.correctIndex;
      return { questionId: q.id, correctIndex: q.correctIndex, wasCorrect };
    });
    const score = corrections.filter((c) => c.wasCorrect).length;
    const total = questions.length;
    const xpEarned = score * 10;

    // Persistance du résultat (uniquement pour un quiz réel).
    if (quizId) {
      await this.prisma.quizResult.create({
        data: { userId, quizId, score, total, xpEarned, answers },
      });
    }

    // Récompense en XP.
    await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned } },
    });

    // Badge « 1er quiz » si c'est le premier résultat enregistré.
    await this.awardFirstQuizBadge(userId);

    // Avance la progression (le nœud quiz est validé).
    await this.progress.completeNode(userId, subjectId, nodeIndex);

    return { score, total, xpEarned, corrections };
  }

  private async awardFirstQuizBadge(userId: string): Promise<void> {
    const badge = await this.prisma.badge.findUnique({ where: { code: 'first_quiz' } });
    if (!badge) return;
    await this.prisma.userBadge
      .create({ data: { userId, badgeId: badge.id } })
      .catch(() => {
        // Déjà attribué (contrainte unique) : on ignore.
      });
  }
}
