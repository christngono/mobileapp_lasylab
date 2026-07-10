import { SocraticService } from './socratic.service';

function makeService(groqReply: string | null) {
  const messageCreate = jest.fn().mockResolvedValue({});
  const prisma = {
    socraticSession: {
      create: jest.fn().mockResolvedValue({ id: 's1', subjectId: null, userId: 'u1' }),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    socraticMessage: {
      create: messageCreate,
      findMany: jest.fn().mockResolvedValue([{ role: 'USER', text: 'Bonjour' }]),
    },
    user: { findUnique: jest.fn().mockResolvedValue({ classe: '1ère' }) },
    subject: { findUnique: jest.fn() },
  };
  const groq = { chat: jest.fn().mockResolvedValue(groqReply) };
  const service = new SocraticService(prisma as never, groq as never);
  return { service, groq, messageCreate };
}

describe('SocraticService.ask', () => {
  it('utilise la réponse de Groq quand disponible', async () => {
    const { service, groq } = makeService('Et si tu commençais par isoler x ?');
    const res = await service.ask('u1', { message: 'Aide-moi' });
    expect(res.sessionId).toBe('s1');
    expect(res.reply).toContain('isoler x');
    expect(groq.chat).toHaveBeenCalledTimes(1);
  });

  it('bascule sur une relance socratique de secours si Groq est indisponible', async () => {
    const { service, messageCreate } = makeService(null);
    const res = await service.ask('u1', { message: 'Donne-moi la réponse' });
    // La réponse de secours reste socratique (ne donne pas la solution).
    expect(res.reply.toLowerCase()).toContain('toi-même');
    // Message élève + réponse assistant persistés.
    expect(messageCreate).toHaveBeenCalledTimes(2);
  });
});
