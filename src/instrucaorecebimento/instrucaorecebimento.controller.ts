import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { InstrucaoRecebimentosService } from './instrucaorecebimento.service';

export class CreateInstrucaoRecebimentosDto {
  @IsString()
  codigo: number;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const INTRUCAO_Recebimentos_ROUTES: BaseRoutes = {
  create: {
    name: 'create instrucao Recebimentos',
    route: '/',
    permission: Permission.CREATE_INSTRUCAO_RECEBIMENTO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_INSTRUCOES_RECEBIMENTO,
  },
  update: {
    name: 'update Instrucao Recebimentos',
    route: ':id',
    permission: Permission.UPDATE_INSTRUCAO_RECEBIMENTO,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_INSTRUCOES_RECEBIMENTO,
  },
  delete: {
    name: 'delete Instrucao Recebimentos',
    route: ':id',
    permission: Permission.DELETE_INSTRUCAO_RECEBIMENTO,
  },
  patchAtiva: {
    name: 'Ativa Instrucao Recebimentos',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_INSTRUCAO_RECEBIMENTO,
  },
  patchDesativa: {
    name: 'Desativa Instrucao Recebimentos',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_INSTRUCAO_RECEBIMENTO,
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

@Controller('instrucao-recebimentos')
export class InstrucaoRecebimentosController {
  constructor(private readonly InstrucaoRecebimentosService: InstrucaoRecebimentosService) { }

  @Post(INTRUCAO_Recebimentos_ROUTES.create.route)
  @Permissions(INTRUCAO_Recebimentos_ROUTES.create.permission)
  create(@Body() createInstrucaoRecebimentosDto: CreateInstrucaoRecebimentosDto) {
    return this.InstrucaoRecebimentosService.createInstrucaoRecebimentos(createInstrucaoRecebimentosDto);
  }

  @Put(INTRUCAO_Recebimentos_ROUTES.update.route)
  @Permissions(INTRUCAO_Recebimentos_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateInstrucaoRecebimentosDto,
  ) {
    return this.InstrucaoRecebimentosService.updateInstrucaoRecebimentos(Number(id), data);
  }


  @Delete(INTRUCAO_Recebimentos_ROUTES.delete.route)
  @Permissions(INTRUCAO_Recebimentos_ROUTES.delete.permission)
  async deleteInstrucaoRecebimentos(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.InstrucaoRecebimentosService.deleteInstrucaoRecebimentos(Number(id));
  }

  @Get(INTRUCAO_Recebimentos_ROUTES.findMany.route)
  @Permissions(INTRUCAO_Recebimentos_ROUTES.findMany.permission)
  async getInstrucaoRecebimentos(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.InstrucaoRecebimentosService.getInstrucoesRecebimentos(bancoId);
  }


}
