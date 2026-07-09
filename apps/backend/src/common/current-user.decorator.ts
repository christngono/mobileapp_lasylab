import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Identité extraite du JWT et attachée à la requête par le JwtAuthGuard. */
export interface AuthUser {
  id: string;
  role: 'STUDENT' | 'PARENT';
}

/** Injecte l'utilisateur authentifié courant dans un handler de contrôleur. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
