import { IsInt, IsString, Min } from 'class-validator';
import type { CompleteNodeDTO } from '@lasylab/shared';

export class CompleteNodeDto implements CompleteNodeDTO {
  @IsString()
  subjectId!: CompleteNodeDTO['subjectId'];

  @IsInt()
  @Min(0)
  nodeIndex!: number;
}
