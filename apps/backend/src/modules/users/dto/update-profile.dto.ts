import { IsArray, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CLASSES, SUBJECTS, type Classe, type SubjectId } from '@lasylab/shared';

const CLASSE_VALUES = CLASSES as unknown as string[];
const SUBJECT_IDS = SUBJECTS.map((s) => s.id);

/** Mise à jour du profil (onboarding et édition ultérieure). */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  // Élève : classe unique
  @IsOptional()
  @IsIn(CLASSE_VALUES)
  classe?: Classe;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsString()
  school?: string;

  // Objectifs (multi)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  objectifs?: string[];

  // Enseignant : classes / matières / écoles (multi)
  @IsOptional()
  @IsArray()
  @IsIn(CLASSE_VALUES, { each: true })
  classes?: string[];

  @IsOptional()
  @IsArray()
  @IsIn(SUBJECT_IDS, { each: true })
  subjects?: SubjectId[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schools?: string[];
}
