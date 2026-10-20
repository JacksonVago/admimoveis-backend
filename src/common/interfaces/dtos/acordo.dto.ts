import { BoletoStatus } from "@prisma/client";
import { IsOptional } from "class-validator";
import { BaseParamsIdEmpresaDto } from "../base-search";

export class BaseParamsByStatusAcordo extends BaseParamsIdEmpresaDto {
    @IsOptional()
    status: BoletoStatus;
}
