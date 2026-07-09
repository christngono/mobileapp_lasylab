import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserDTO } from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toUserDTO } from '../../common/user.mapper';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
        ...(dto.objectif !== undefined ? { objectif: dto.objectif } : {}),
        ...(dto.birthYear !== undefined ? { birthYear: dto.birthYear } : {}),
        ...(dto.school !== undefined ? { school: dto.school } : {}),
      },
    });
    return toUserDTO(user);
  }
}
