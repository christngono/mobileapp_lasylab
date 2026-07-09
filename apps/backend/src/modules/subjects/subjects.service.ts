import { Injectable, NotFoundException } from '@nestjs/common';
import type { SubjectMeta } from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SubjectMeta[]> {
    const subjects = await this.prisma.subject.findMany({
      orderBy: { order: 'asc' },
    });
    return subjects.map(this.toMeta);
  }

  async findOne(id: string): Promise<SubjectMeta> {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      throw new NotFoundException('Matière introuvable.');
    }
    return this.toMeta(subject);
  }

  private toMeta(s: {
    id: string;
    name: string;
    short: string;
    color: string;
    barColor: string;
  }): SubjectMeta {
    return {
      id: s.id as SubjectMeta['id'],
      name: s.name,
      short: s.short,
      color: s.color,
      barColor: s.barColor,
    };
  }
}
