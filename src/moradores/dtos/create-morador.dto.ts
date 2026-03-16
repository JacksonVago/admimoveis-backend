import { Transform } from 'class-transformer';
import {
  IsInt
} from 'class-validator';

export class CreateMoradorDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  pessoaId?: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  locacaoId?: number;

  /*  @IsArray()
    @IsOptional()
    @Transform(({ value }) => value.map(Number))
    vincularImoveisIds?: number[];*/

}
