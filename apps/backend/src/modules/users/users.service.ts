import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthResponseDTO, ChildDTO, UserDTO } from '@lasylab/shared';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { toUserDTO } from '../../common/user.mapper';
import type { JwtPayload } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateChildDto } from './dto/create-child.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async getProfile(userId: string): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    return toUserDTO(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDTO> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.classe !== undefined ? { classe: dto.classe } : {}),
        ...(dto.birthDate !== undefined ? { birthDate: new Date(dto.birthDate) } : {}),
        ...(dto.school !== undefined ? { school: dto.school } : {}),
        ...(dto.objectifs !== undefined ? { objectifs: dto.objectifs } : {}),
        ...(dto.classes !== undefined ? { classes: dto.classes } : {}),
        ...(dto.subjects !== undefined ? { subjects: dto.subjects } : {}),
        ...(dto.schools !== undefined ? { schools: dto.schools } : {}),
      },
    });
    return toUserDTO(user);
  }

  /* --------------------------- Comptes enfants --------------------------- */

  private async assertParent(userId: string) {
    const parent = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!parent) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    if (parent.role !== UserRole.PARENT) {
      throw new ForbiddenException('Seul un compte parent peut gérer des enfants.');
    }
    return parent;
  }

  async listChildren(parentId: string): Promise<ChildDTO[]> {
    await this.assertParent(parentId);
    const children = await this.prisma.user.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
    });
    return children.map(this.toChildDTO);
  }

  async createChild(parentId: string, dto: CreateChildDto): Promise<ChildDTO> {
    await this.assertParent(parentId);
    const child = await this.prisma.user.create({
      data: {
        role: UserRole.STUDENT,
        name: dto.name,
        classe: dto.classe ?? null,
        parentId,
      },
    });
    return this.toChildDTO(child);
  }

  async deleteChild(parentId: string, childId: string): Promise<void> {
    await this.assertParent(parentId);
    const child = await this.prisma.user.findUnique({ where: { id: childId } });
    if (!child || child.parentId !== parentId) {
      throw new NotFoundException('Enfant introuvable.');
    }
    await this.prisma.user.delete({ where: { id: childId } });
  }

  /** Émet un jeton pour un enfant (le parent « entre » dans l'app à sa place). */
  async childToken(parentId: string, childId: string): Promise<AuthResponseDTO> {
    await this.assertParent(parentId);
    const child = await this.prisma.user.findUnique({ where: { id: childId } });
    if (!child || child.parentId !== parentId) {
      throw new NotFoundException('Enfant introuvable.');
    }
    const payload: JwtPayload = { sub: child.id, role: child.role };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken, user: toUserDTO(child as User) };
  }

  private toChildDTO(child: {
    id: string;
    name: string;
    classe: string | null;
    createdAt: Date;
  }): ChildDTO {
    return {
      id: child.id,
      name: child.name,
      classe: (child.classe as ChildDTO['classe']) ?? null,
      createdAt: child.createdAt.toISOString(),
    };
  }
}
