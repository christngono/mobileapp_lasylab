import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import type { RegisterDTO, UserRole } from '@lasylab/shared';

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
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  birthYear?: number;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsIn(['student', 'parent'])
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  consent?: boolean;
}
