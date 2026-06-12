import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { InstrucaoCobrancaService } from './instrucaocobranca.service';

export class CreateInstrucaoCobrancaDto {
  @IsString()
  codigo: number;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const INTRUCAO_COBRANCA_ROUTES: BaseRoutes = {
  create: {
    name: 'create instrucao cobranca',
    route: '/',
    permission: Permission.CREATE_INSTRUCAO_COBRANCA,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_INSTRUCOES_COBRANCA,
  },
  update: {
    name: 'update Instrucao Cobranca',
    route: ':id',
    permission: Permission.UPDATE_INSTRUCAO_COBRANCA,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_INSTRUCOES_COBRANCA,
  },
  delete: {
    name: 'delete Instrucao Cobranca',
    route: ':id',
    permission: Permission.DELETE_INSTRUCAO_COBRANCA,
  },
  patchAtiva: {
    name: 'Ativa Instrucao Cobranca',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_INSTRUCAO_COBRANCA,
  },
  patchDesativa: {
    name: 'Desativa Instrucao Cobranca',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_INSTRUCAO_COBRANCA,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

export class BaseParamsIdBancoDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;
}

@Controller('instrucao-cobranca')
export class InstrucaoCobrancaController {
  constructor(private readonly InstrucaoCobrancaService: InstrucaoCobrancaService) { }

  @Post(INTRUCAO_COBRANCA_ROUTES.create.route)
  @Permissions(INTRUCAO_COBRANCA_ROUTES.create.permission)
  create(@Body() createInstrucaoCobrancaDto: CreateInstrucaoCobrancaDto) {
    return this.InstrucaoCobrancaService.createInstrucaoCobranca(createInstrucaoCobrancaDto);
  }

  @Put(INTRUCAO_COBRANCA_ROUTES.update.route)
  @Permissions(INTRUCAO_COBRANCA_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateInstrucaoCobrancaDto,
  ) {
    return this.InstrucaoCobrancaService.updateInstrucaoCobranca(Number(id), data);
  }


  @Delete(INTRUCAO_COBRANCA_ROUTES.delete.route)
  @Permissions(INTRUCAO_COBRANCA_ROUTES.delete.permission)
  async deleteInstrucaoCobranca(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.InstrucaoCobrancaService.deleteInstrucaoCobranca(Number(id));
  }

  @Get(INTRUCAO_COBRANCA_ROUTES.findMany.route)
  @Permissions(INTRUCAO_COBRANCA_ROUTES.findMany.permission)
  async getInstrucaoCobranca(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.InstrucaoCobrancaService.getInstrucoesCobranca(bancoId);
  }


}
