import { IsString, MinLength } from 'class-validator';
import type { LoginDTO } from '@lasylab/shared';

export class LoginDto implements LoginDTO {
  @IsString()
  @MinLength(4)
  phone!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
