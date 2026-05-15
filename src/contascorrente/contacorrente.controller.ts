import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Permission, PessoaStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContaCorrenteService } from './contacorrente.service';

export class CreateCCDto {
  @IsString()
  banco: string;

  @IsString()
  agencia: string;

  @IsString()
  conta: string;

  @IsString()
  digito: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsString()
  @IsOptional()
  usuarioBancoAPI: string;

  @IsString()
  @IsOptional()
  senhaBancoAPI: string;

  @IsString()
  @IsOptional()
  chaveAppAPI: string;

  @IsString()
  @IsOptional()
  urlPIX: string;

  @IsString()
  @IsOptional()
  urlWebhookPIX: string;

  @IsEnum(PessoaStatus)
  status: PessoaStatus;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  pessoaId: number;

}

export const CONTA_CORRENTE_ROUTES: BaseRoutes = {
  create: {
    name: 'create conta corrente',
    route: '/',
    permission: Permission.CREATE_CONTA_CORRENTE,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_CONTAS_CORRENTE,
  },
  update: {
    name: 'update Conta Corrente',
    route: ':id',
    permission: Permission.UPDATE_CONTA_CORRENTE,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_CONTAS_CORRENTE,
  },
  delete: {
    name: 'delete Conta Corrente',
    route: ':id',
    permission: Permission.DELETE_CONTA_CORRENTE,
  },
  patchAtiva: {
    name: 'Ativa Conta Corrente',
    route: '/ativa/:id',
    permission: Permission.UPDATE_CONTA_CORRENTE,
  },
  patchDesativa: {
    name: 'Desativa Conta Corrente',
    route: '/desativa/:id',
    permission: Permission.UPDATE_CONTA_CORRENTE,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

export class BaseParamsIdEmpresaDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;
}

@Controller('contas-corrente')
export class ContaCorrenteController {
  constructor(private readonly contaCorrenteService: ContaCorrenteService) { }

  @Post(CONTA_CORRENTE_ROUTES.create.route)
  @Permissions(CONTA_CORRENTE_ROUTES.create.permission)
  create(@Body() createContaCorrenteDto: CreateCCDto) {
    return this.contaCorrenteService.createContaCorrente(createContaCorrenteDto);
  }

  @Put(CONTA_CORRENTE_ROUTES.update.route)
  @Permissions(CONTA_CORRENTE_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateCCDto,
  ) {
    return this.contaCorrenteService.update(Number(id), data);
  }


  @Delete(CONTA_CORRENTE_ROUTES.delete.route)
  @Permissions(CONTA_CORRENTE_ROUTES.delete.permission)
  async deleteContaCorrente(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.contaCorrenteService.delete(Number(id));
  }

  @Get(CONTA_CORRENTE_ROUTES.findMany.route)
  @Permissions(CONTA_CORRENTE_ROUTES.findMany.permission)
  async getContasCorrente(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.contaCorrenteService.getContasCorrente(empresaId);
  }

  @Patch(CONTA_CORRENTE_ROUTES.patchAtiva.route)
  @Permissions(CONTA_CORRENTE_ROUTES.patchAtiva.permission)
  async ativaAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.contaCorrenteService.ativaConta(Number(id));
  }

  @Patch(CONTA_CORRENTE_ROUTES.patchDesativa.route)
  @Permissions(CONTA_CORRENTE_ROUTES.patchDesativa.permission)
  async desativaAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.contaCorrenteService.desativaConta(Number(id));
  }

}
