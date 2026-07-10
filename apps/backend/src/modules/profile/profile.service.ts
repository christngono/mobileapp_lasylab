import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PARCOURS_TOTAL_NODES,
  SUBJECTS,
  type BadgeDTO,
  type ProfileDTO,
  type ProfileSubjectProgressDTO,
} from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toUserDTO } from '../../common/user.mapper';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /** Tableau de bord Profil : profil, gamification, badges, progression. */
  async get(userId: string): Promise<ProfileDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: true,
        badges: { include: { badge: true } },
      },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    // Badges : tous les badges du catalogue avec l'indicateur "obtenu".
    const allBadges = await this.prisma.badge.findMany({ orderBy: { order: 'asc' } });
    const earned = new Set(user.badges.map((ub) => ub.badgeId));
    const badges: BadgeDTO[] = allBadges.map((b) => ({
      id: b.id,
      label: b.label,
      icon: b.icon,
      earned: earned.has(b.id),
    }));

    // Progression par matière (pourcentage).
    const progressBySubject = new Map<string, number>(
      user.progress.map((p) => [p.subjectId, p.completedNodes] as [string, number]),
    );
    const progression: ProfileSubjectProgressDTO[] = SUBJECTS.map((s) => ({
      subjectId: s.id,
      name: s.name,
      color: s.color,
      pct: Math.round(((progressBySubject.get(s.id) ?? 0) / PARCOURS_TOTAL_NODES) * 100),
    }));

    return {
      user: toUserDTO(user),
      streak: user.streak,
      gems: user.gems,
      xp: user.xp,
      badges,
      progression,
    };
  }
}
