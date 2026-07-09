import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CLASSES, OBJECTIFS, type Classe, type Objectif } from '@lasylab/shared';

/** Mise à jour du profil élève (notamment pendant l'onboarding). */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsIn(CLASSES as unknown as string[])
  classe?: Classe;

  @IsOptional()
  @IsIn(OBJECTIFS as unknown as string[])
  objectif?: Objectif;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsString()
  school?: string;
}
