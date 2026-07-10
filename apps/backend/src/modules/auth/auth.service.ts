import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import type { AuthResponseDTO } from '@lasylab/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toPrismaRole, toUserDTO } from '../../common/user.mapper';
import { normalizePhone } from '../../common/phone';
import type { JwtPayload } from './jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDTO> {
    const phone = normalizePhone(dto.phone);
    if (phone.length < 6) {
      throw new ConflictException('Numéro de téléphone invalide.');
    }
    const existing = await this.prisma.user.findUnique({ where: { phone } });
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec ce numéro.');
    }

    const role = toPrismaRole(dto.role);
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        firstName: dto.firstName ?? null,
        phone,
        passwordHash,
        role,
        consent: dto.consent ?? false,
        // Élève
        birthYear: role === 'STUDENT' ? (dto.birthYear ?? null) : null,
        school: role === 'STUDENT' ? (dto.school ?? null) : null,
        // Enseignant
        subjects: role === 'TEACHER' ? (dto.subjects ?? []) : [],
        schools: role === 'TEACHER' ? (dto.schools ?? []) : [],
        // Parent
        childrenCount: role === 'PARENT' ? (dto.childrenCount ?? null) : null,
      },
    });

    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: { phone: normalizePhone(dto.phone) },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Numéro ou mot de passe incorrect.');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Numéro ou mot de passe incorrect.');
    }
    return this.buildResponse(user);
  }

  /** Émet un jeton pour un compte (utilisé par le parent pour « entrer » comme un enfant). */
  async buildResponse(user: User): Promise<AuthResponseDTO> {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken, user: toUserDTO(user) };
  }
}
