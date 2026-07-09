import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PARCOURS_TOTAL_NODES,
  nodeKind,
  type LessonDTO,
  type NodeKind,
  type ParcoursDTO,
  type ParcoursNodeDTO,
  type SubjectId,
} from '@lasylab/shared';
import { NodeKind as PrismaNodeKind } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Diapositives génériques quand aucune leçon n'est encore rédigée (cf. mock). */
const FALLBACK_SLIDES = [
  { big: 'Leçon', sub: 'Vidéo de moins de 3 min qui défile.' },
  { big: 'Point clé', sub: "On retient l'essentiel." },
  { big: 'Exemple', sub: 'Un exemple concret pour comprendre.' },
  { big: 'Astuce', sub: 'Une astuce pour ne plus oublier.' },
  { big: 'Récap', sub: 'On récapitule avant le quiz.' },
];

function toSharedKind(kind: PrismaNodeKind): NodeKind {
  return kind === 'INTRO' ? 'intro' : kind === 'QUIZ' ? 'quiz' : 'lesson';
}

/** Libellé d'un nœud du parcours, calqué sur le design. */
function nodeLabel(index: number): string {
  const kind = nodeKind(index);
  if (index === 0) return 'Introduction';
  if (kind === 'quiz') return `${Math.ceil(index / 2)}- QUIZ`;
  return `Leçon ${index / 2}`;
}

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Parcours d'une matière : 21 nœuds calculés + statut selon la progression. */
  async getParcours(userId: string, subjectId: string): Promise<ParcoursDTO> {
    const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Matière introuvable.');
    }

    const progress = await this.prisma.progress.findUnique({
      where: { userId_subjectId: { userId, subjectId } },
    });
    const completedNodes = progress?.completedNodes ?? 0;

    // Nœuds pour lesquels un contenu existe réellement.
    const [lessons, quizzes] = await Promise.all([
      this.prisma.lesson.findMany({ where: { subjectId }, select: { nodeIndex: true } }),
      this.prisma.quiz.findMany({ where: { subjectId }, select: { nodeIndex: true } }),
    ]);
    const contentSet = new Set<number>([
      ...lessons.map((l) => l.nodeIndex),
      ...quizzes.map((q) => q.nodeIndex),
    ]);

    const nodes: ParcoursNodeDTO[] = [];
    for (let i = 0; i < PARCOURS_TOTAL_NODES; i++) {
      nodes.push({
        nodeIndex: i,
        kind: nodeKind(i),
        label: nodeLabel(i),
        status: i < completedNodes ? 'done' : i === completedNodes ? 'current' : 'locked',
        hasContent: contentSet.has(i),
      });
    }

    return {
      subject: {
        id: subject.id as SubjectId,
        name: subject.name,
        short: subject.short,
        color: subject.color,
        barColor: subject.barColor,
      },
      total: PARCOURS_TOTAL_NODES,
      completedNodes,
      nodes,
    };
  }

  /** Contenu d'une leçon (ou fallback générique si non rédigée). */
  async getLesson(subjectId: string, nodeIndex: number): Promise<LessonDTO> {
    const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Matière introuvable.');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { subjectId_nodeIndex: { subjectId, nodeIndex } },
      include: { slides: { orderBy: { order: 'asc' } } },
    });

    if (lesson) {
      return {
        id: lesson.id,
        subjectId: lesson.subjectId as SubjectId,
        nodeIndex: lesson.nodeIndex,
        kind: toSharedKind(lesson.kind),
        title: lesson.title,
        slides: lesson.slides.map((s) => ({ big: s.big, sub: s.sub })),
        body: lesson.body,
      };
    }

    // Aucune leçon rédigée : contenu générique pour ne pas bloquer le parcours.
    return {
      id: `${subjectId}-${nodeIndex}-fallback`,
      subjectId: subjectId as SubjectId,
      nodeIndex,
      kind: nodeKind(nodeIndex),
      title: nodeIndex === 0 ? 'Introduction' : `Leçon ${nodeIndex / 2}`,
      slides: FALLBACK_SLIDES,
      body: null,
    };
  }
}
