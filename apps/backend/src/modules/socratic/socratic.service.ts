import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  ChatMessageDTO,
  SocraticReplyDTO,
  SocraticSessionDTO,
} from '@lasylab/shared';
import { ChatRole, type SocraticMessage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { GroqService, type ChatMessage } from './groq.service';
import { buildSystemPrompt } from './socratic.prompt';

/** Nombre de messages d'historique conservés dans le contexte envoyé au modèle. */
const HISTORY_LIMIT = 20;

@Injectable()
export class SocraticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groq: GroqService,
  ) {}

  /** Envoie un message et obtient une relance socratique (jamais la réponse directe). */
  async ask(
    userId: string,
    dto: { sessionId?: string; subjectId?: string; message: string },
  ): Promise<SocraticReplyDTO> {
    const session = await this.getOrCreateSession(userId, dto.sessionId, dto.subjectId);

    // Persiste le message de l'élève.
    await this.prisma.socraticMessage.create({
      data: { sessionId: session.id, role: ChatRole.USER, text: dto.message },
    });

    // Contexte : matière + classe de l'élève.
    const [user, subject] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      session.subjectId
        ? this.prisma.subject.findUnique({ where: { id: session.subjectId } })
        : Promise.resolve(null),
    ]);

    const history = await this.prisma.socraticMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: HISTORY_LIMIT,
    });

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: buildSystemPrompt({
          subjectName: subject?.name,
          classe: user?.classe ?? undefined,
        }),
      },
      ...history.map((m) => ({
        role: (m.role === ChatRole.USER ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      })),
    ];

    const reply =
      (await this.groq.chat(messages)) ?? this.fallbackReply(dto.message);

    await this.prisma.socraticMessage.create({
      data: { sessionId: session.id, role: ChatRole.ASSISTANT, text: reply },
    });

    return { sessionId: session.id, reply };
  }

  /** Récupère une session avec son historique. */
  async getSession(userId: string, sessionId: string): Promise<SocraticSessionDTO> {
    const session = await this.prisma.socraticSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) {
      throw new NotFoundException('Session introuvable.');
    }
    if (session.userId !== userId) {
      throw new ForbiddenException('Accès refusé à cette session.');
    }
    return this.toSessionDTO(session, session.messages);
  }

  /** Liste les sessions récentes de l'élève. */
  async listSessions(userId: string): Promise<SocraticSessionDTO[]> {
    const sessions = await this.prisma.socraticSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    return sessions.map((s) => this.toSessionDTO(s, s.messages));
  }

  private async getOrCreateSession(
    userId: string,
    sessionId: string | undefined,
    subjectId: string | undefined,
  ) {
    if (sessionId) {
      const existing = await this.prisma.socraticSession.findUnique({
        where: { id: sessionId },
      });
      if (!existing) {
        throw new NotFoundException('Session introuvable.');
      }
      if (existing.userId !== userId) {
        throw new ForbiddenException('Accès refusé à cette session.');
      }
      // Touche la session pour la remonter dans la liste.
      return this.prisma.socraticSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });
    }
    return this.prisma.socraticSession.create({
      data: { userId, subjectId: subjectId ?? null },
    });
  }

  /** Relance de secours (mode dégradé, sans clé Groq) : reste socratique. */
  private fallbackReply(_message: string): string {
    return (
      "Bonne question ! Je préfère t'aider à trouver par toi-même 🙂. " +
      'Dis-moi d\'abord : qu\'est-ce que tu sais déjà sur ce sujet, et par quelle idée penses-tu qu\'on pourrait commencer ?'
    );
  }

  private toSessionDTO(
    session: { id: string; subjectId: string | null; createdAt: Date },
    messages: SocraticMessage[],
  ): SocraticSessionDTO {
    const dtoMessages: ChatMessageDTO[] = messages.map((m) => ({
      role: m.role === ChatRole.USER ? 'user' : 'assistant',
      text: m.text,
    }));
    return {
      id: session.id,
      subjectId: (session.subjectId as SocraticSessionDTO['subjectId']) ?? null,
      messages: dtoMessages,
      createdAt: session.createdAt.toISOString(),
    };
  }
}
