import { Injectable, NotFoundException } from '@nestjs/common';
import type { ActivityCategory, ActivityDTO } from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ActivityDTO[]> {
    const items = await this.prisma.activity.findMany({ orderBy: { order: 'asc' } });
    return items.map((a) => ({
      id: a.id,
      category: a.category as ActivityCategory,
      title: a.title,
      subjectLabel: a.subjectLabel,
      subtitle: a.subtitle,
      body: a.body,
      progressPct: a.progressPct,
    }));
  }

  async findOne(id: string): Promise<ActivityDTO> {
    const a = await this.prisma.activity.findUnique({ where: { id } });
    if (!a) {
      throw new NotFoundException('Activité introuvable.');
    }
    return {
      id: a.id,
      category: a.category as ActivityCategory,
      title: a.title,
      subjectLabel: a.subjectLabel,
      subtitle: a.subtitle,
      body: a.body,
      progressPct: a.progressPct,
    };
  }
}
