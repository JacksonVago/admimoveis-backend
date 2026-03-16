import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { CreateMoradorDto } from './create-morador.dto';

export class UpdateMoradorDto extends PartialType(CreateMoradorDto) {
  desvincularImoveisIds?: number[];

  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}
