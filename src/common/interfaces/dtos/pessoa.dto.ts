import { PessoaStatus } from "@prisma/client";
import { IsOptional } from "class-validator";
import { BaseParamsIdEmpresaDto } from "../base-search";

export class BaseParamsByStatusPessoa extends BaseParamsIdEmpresaDto {
    @IsOptional()
    pessoaStatus: PessoaStatus;
}

