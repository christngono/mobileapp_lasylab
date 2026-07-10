import type { User } from '@prisma/client';
import type { Classe, SubjectId, UserDTO, UserRole } from '@lasylab/shared';

/** Convertit une entité Prisma User en DTO exposé au client. */
export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    role: fromPrismaRole(user.role),
    name: user.name,
    firstName: user.firstName,
    phone: user.phone,
    birthYear: user.birthYear,
    school: user.school,
    classe: (user.classe as Classe | null) ?? null,
    objectifs: user.objectifs,
    subjects: user.subjects as SubjectId[],
    schools: user.schools,
    classes: user.classes,
    childrenCount: user.childrenCount,
    isChild: user.parentId != null,
    createdAt: user.createdAt.toISOString(),
  };
}

export function fromPrismaRole(role: 'STUDENT' | 'PARENT' | 'TEACHER'): UserRole {
  if (role === 'PARENT') return 'parent';
  if (role === 'TEACHER') return 'teacher';
  return 'student';
}

/** Map le rôle du DTO (minuscules) vers l'enum Prisma. */
export function toPrismaRole(role?: UserRole): 'STUDENT' | 'PARENT' | 'TEACHER' {
  if (role === 'parent') return 'PARENT';
  if (role === 'teacher') return 'TEACHER';
  return 'STUDENT';
}
