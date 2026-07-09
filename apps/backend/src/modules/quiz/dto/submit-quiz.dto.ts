import { ArrayNotEmpty, IsArray, IsInt, IsString, Min } from 'class-validator';
import type { QuizSubmissionDTO } from '@lasylab/shared';

export class SubmitQuizDto implements QuizSubmissionDTO {
  @IsString()
  subjectId!: QuizSubmissionDTO['subjectId'];

  @IsInt()
  @Min(0)
  nodeIndex!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  answers!: number[];
}
