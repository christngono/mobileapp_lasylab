import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { SocraticAskDTO } from '@lasylab/shared';

export class AskDto implements SocraticAskDTO {
  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  subjectId?: SocraticAskDTO['subjectId'];

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;
}
