import type { User } from '@prisma/client';
import { toPrismaRole, toUserDTO } from './user.mapper';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
    role: 'STUDENT',
    name: 'Sara',
    firstName: null,
    phone: '+22900000000',
    passwordHash: 'hash',
    birthYear: 2008,
    school: null,
    classe: '1ère',
    objectif: 'Augmenter mes notes',
    consent: true,
    streak: 5,
    gems: 12,
    xp: 340,
    parentId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  } as User;
}

describe('user.mapper', () => {
  it('mappe le rôle Prisma vers le DTO en minuscules', () => {
    expect(toUserDTO(makeUser({ role: 'STUDENT' })).role).toBe('student');
    expect(toUserDTO(makeUser({ role: 'PARENT' })).role).toBe('parent');
  });

  it("n'expose jamais le hash du mot de passe", () => {
    const dto = toUserDTO(makeUser());
    expect((dto as Record<string, unknown>).passwordHash).toBeUndefined();
  });

  it('sérialise la date de création en ISO', () => {
    expect(toUserDTO(makeUser()).createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('convertit le rôle du DTO vers l’enum Prisma', () => {
    expect(toPrismaRole('parent')).toBe('PARENT');
    expect(toPrismaRole('student')).toBe('STUDENT');
    expect(toPrismaRole(undefined)).toBe('STUDENT');
  });
});
