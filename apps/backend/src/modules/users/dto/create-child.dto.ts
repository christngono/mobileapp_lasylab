import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { CLASSES, type Classe, type CreateChildDTO } from '@lasylab/shared';

const CLASSE_VALUES = CLASSES as unknown as string[];

export class CreateChildDto implements CreateChildDTO {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsIn(CLASSE_VALUES)
  classe?: Classe;
}
