import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsIdEmpresaDto } from '@/common/interfaces/base-search';
import { GetPessoasQueryDto } from '@/pessoas/pessoas.controller';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { FormaEnvio, Permission, PessoaStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { ContaCorrenteService } from './contacorrente.service';

export class CreateCCDto {
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
  cooperativa: string;

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
  urlBoleto: string;

  @IsString()
  @IsOptional()
  urlWebhookPIX: string;

  @IsString()
  @IsOptional()
  urlWebhookBoleto: string;

  @IsEnum(PessoaStatus)
  status: PessoaStatus;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  pagtoParcial: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  qtdeMaxParcial: number;

  @IsEnum(FormaEnvio)
  formaEnvio: FormaEnvio;

  @IsString()
  @IsOptional()
  assuntoEmail: string;

  @IsString()
  @IsOptional()
  mensagemEmail1: string;

  @IsString()
  @IsOptional()
  mensagemEmail2: string;

  @IsString()
  @IsOptional()
  mensagemEmail3: string;

  @IsString()
  @IsOptional()
  convenio: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoJurosCobId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valorJuros: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  percJuros: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  diasInicioJuros: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoMultaCobId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valorMulta: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  percMulta: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  diasInicioMulta: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoDescontoCobId: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valorDesconto: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  percDesconto: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  diasInicioDesconto: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoAutorizacaoCobId: number;

  @IsString()
  @IsOptional()
  tipoRecebimentoDiv: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valorMinDiverg: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valorMaxDiverg: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  percMinDiverg: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  percMaxDiverg: number;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  protestar: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  qtdeDiasProtesto: number;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  negativar: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  qtdeDiasNegativar: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoCobId1: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoCobId2: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoCobId3: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  qtdeDiasAposVencto: number;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  cobrancaDiaUtil: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId1: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId2: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId3: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId4: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  carteiraId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  especieId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  pessoaId: number;

}

export const CONTA_CORRENTE_ROUTES: BaseRoutes = {
  create: {
    name: 'create conta corrente',
    route: '/',
    permission: Permission.CREATE_CONTA_CORRENTE,
  },
  findById: {
    name: 'Get Conta Corrente',
    route: '/findbyid/:id',
    permission: Permission.VIEW_CONTAS_CORRENTE,
  },
  update: {
    name: 'update Conta Corrente',
    route: ':id',
    permission: Permission.UPDATE_CONTA_CORRENTE,
  },
  findEmpresa: {
    name: 'Empresa Conta Corrente',
    route: '/:empresaId',
    permission: Permission.VIEW_CONTAS_CORRENTE,
  },
  findMany: {
    name: 'findMany',
    route: 'findmany/:empresaId',
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

@Controller('contas-corrente')
export class ContaCorrenteController {
  constructor(private readonly contaCorrenteService: ContaCorrenteService) { }

  @Post(CONTA_CORRENTE_ROUTES.create.route)
  @Permissions(CONTA_CORRENTE_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createContaCorrenteDto: CreateCCDto) {
    return this.contaCorrenteService.createContaCorrente(createContaCorrenteDto);
  }

  @Put(CONTA_CORRENTE_ROUTES.update.route)
  @Permissions(CONTA_CORRENTE_ROUTES.update.permission)
  @FormDataRequest()
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateCCDto,
  ) {
    return this.contaCorrenteService.update(Number(id), data);
  }

  @Get(CONTA_CORRENTE_ROUTES.findById.route)
  @Permissions(CONTA_CORRENTE_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.contaCorrenteService.getContaCorrente(Number(id));
  }


  @Delete(CONTA_CORRENTE_ROUTES.delete.route)
  @Permissions(CONTA_CORRENTE_ROUTES.delete.permission)
  async deleteContaCorrente(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.contaCorrenteService.delete(Number(id));
  }

  @Get(CONTA_CORRENTE_ROUTES.findMany.route)
  @Permissions(CONTA_CORRENTE_ROUTES.findMany.permission)
  async search(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: GetPessoasQueryDto) {
    const { search, page, limit, exclude } = data;
    const response = await this.contaCorrenteService.findMany(empresaId, search, page, limit, exclude);
    return response;
  }


  @Get(CONTA_CORRENTE_ROUTES.findEmpresa.route)
  @Permissions(CONTA_CORRENTE_ROUTES.findEmpresa.permission)
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
