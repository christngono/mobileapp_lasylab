import { PARCOURS_TOTAL_NODES } from '@lasylab/shared';
import { ProgressService } from './progress.service';

function makePrismaMock(current: number) {
  const upsert = jest.fn().mockResolvedValue({});
  return {
    upsert,
    prisma: {
      subject: { findUnique: jest.fn().mockResolvedValue({ id: 'maths' }) },
      progress: {
        findUnique: jest.fn().mockResolvedValue({ completedNodes: current }),
        upsert,
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({
          streak: 5,
          gems: 12,
          xp: 340,
          progress: [{ subjectId: 'maths', completedNodes: current }],
        }),
      },
    },
  };
}

describe('ProgressService.completeNode', () => {
  it('avance la progression quand le nœud atteint le front', async () => {
    const { prisma, upsert } = makePrismaMock(2);
    const service = new ProgressService(prisma as never);

    await service.completeNode('u1', 'maths', 2);

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { completedNodes: 3 },
        create: { userId: 'u1', subjectId: 'maths', completedNodes: 3 },
      }),
    );
  });

  it("n'avance pas si le nœud est déjà validé (idempotent)", async () => {
    const { prisma, upsert } = makePrismaMock(5);
    const service = new ProgressService(prisma as never);

    await service.completeNode('u1', 'maths', 2);

    expect(upsert).not.toHaveBeenCalled();
  });

  it('plafonne la progression au nombre total de nœuds', async () => {
    const { prisma, upsert } = makePrismaMock(PARCOURS_TOTAL_NODES - 1);
    const service = new ProgressService(prisma as never);

    await service.completeNode('u1', 'maths', 999);

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: { completedNodes: PARCOURS_TOTAL_NODES } }),
    );
  });
});
