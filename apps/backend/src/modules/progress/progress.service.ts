import { Injectable, NotFoundException } from '@nestjs/common';
import { SUBJECTS, type ProgressDTO, type SubjectId } from '@lasylab/shared';
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
}
