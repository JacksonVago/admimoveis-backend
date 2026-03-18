import { lancamentoStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class PeriodoDto {
    @IsOptional()
    status?: lancamentoStatus | null;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    dataInicial: Date;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    dataFinal: Date;

}
