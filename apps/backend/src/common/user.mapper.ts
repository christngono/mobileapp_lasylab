import type { User } from '@prisma/client';
import type { Classe, Objectif, UserDTO, UserRole } from '@lasylab/shared';

/** Convertit une entité Prisma User en DTO exposé au client. */
export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    role: user.role === 'PARENT' ? 'parent' : 'student',
    name: user.name,
    firstName: user.firstName,
    phone: user.phone,
    birthYear: user.birthYear,
    school: user.school,
    classe: (user.classe as Classe | null) ?? null,
    objectif: (user.objectif as Objectif | null) ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

/** Map le rôle du DTO (minuscules) vers l'enum Prisma. */
export function toPrismaRole(role?: UserRole): 'STUDENT' | 'PARENT' {
  return role === 'parent' ? 'PARENT' : 'STUDENT';
}
