import { Injectable } from '@nestjs/common';
import type { StoryDTO } from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  /** Liste des stories affichées dans l'écran Status. */
  async list(): Promise<StoryDTO[]> {
    const stories = await this.prisma.story.findMany({ orderBy: { order: 'asc' } });
    return stories.map((s) => ({
      id: s.id,
      bg: s.bg,
      tag: s.tag,
      title: s.title,
      text: s.text,
    }));
  }
}
