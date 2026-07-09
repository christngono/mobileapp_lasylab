import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PARCOURS_TOTAL_NODES,
  SUBJECTS,
  type ProgressDTO,
  type SubjectId,
} from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  /** Progression complète d'un élève : nœuds validés par matière + gamification. */
  async getForUser(userId: string): Promise<ProgressDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { progress: true },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    // Initialise toutes les matières à 0, puis applique la progression stockée.
    const bySubject = SUBJECTS.reduce(
      (acc, s) => {
        acc[s.id] = 0;
        return acc;
      },
      {} as Record<SubjectId, number>,
    );
    for (const p of user.progress) {
      bySubject[p.subjectId as SubjectId] = p.completedNodes;
    }

    return {
      bySubject,
      streak: user.streak,
      gems: user.gems,
      xp: user.xp,
    };
  }

  /**
   * Marque un nœud comme terminé : avance la progression de la matière si le
   * nœud atteint le front de progression (comportement du mock : completedNodes
   * passe à min(nodeIndex + 1, TOTAL)). Idempotent.
   */
  async completeNode(
    userId: string,
    subjectId: string,
    nodeIndex: number,
  ): Promise<ProgressDTO> {
    const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Matière introuvable.');
    }

    const existing = await this.prisma.progress.findUnique({
      where: { userId_subjectId: { userId, subjectId } },
    });
    const current = existing?.completedNodes ?? 0;

    if (nodeIndex >= current) {
      const completedNodes = Math.min(nodeIndex + 1, PARCOURS_TOTAL_NODES);
      await this.prisma.progress.upsert({
        where: { userId_subjectId: { userId, subjectId } },
        update: { completedNodes },
        create: { userId, subjectId, completedNodes },
      });
    }

    return this.getForUser(userId);
  }
}
