import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  role: 'STUDENT' | 'PARENT' | 'TEACHER';
}

/**
 * Garde d'authentification : vérifie le JWT "Bearer" et attache
 * { id, role } à la requête. Implémentation autonome (sans passport)
 * pour limiter les dépendances.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Jeton manquant');
    }
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('jwt.secret'),
      });
      (request as Request & { user: unknown }).user = {
        id: payload.sub,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Jeton invalide ou expiré');
    }
  }

  private extractToken(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header) return undefined;
    const [type, value] = header.split(' ');
    return type === 'Bearer' ? value : undefined;
  }
}
