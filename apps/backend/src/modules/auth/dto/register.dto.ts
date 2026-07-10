import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { SUBJECTS, type RegisterDTO, type SubjectId, type UserRole } from '@lasylab/shared';

const SUBJECT_IDS = SUBJECTS.map((s) => s.id);

export class RegisterDto implements RegisterDTO {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsString()
  @MinLength(4)
  phone!: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  password!: string;

  @IsOptional()
  @IsIn(['student', 'parent', 'teacher'])
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  consent?: boolean;

  // Élève
  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsString()
  school?: string;

  // Enseignant
  @IsOptional()
  @IsArray()
  @IsIn(SUBJECT_IDS, { each: true })
  subjects?: SubjectId[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schools?: string[];

  // Parent
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  childrenCount?: number;
}
