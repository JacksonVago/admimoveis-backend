import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { EspecieCobrancaService } from './especiecobranca.service';

export class CreateEspecieCobrancaDto {
  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  @IsString()
  sigla: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const ESPECIE_COBRANCA_ROUTES: BaseRoutes = {
  create: {
    name: 'create especie cobranca',
    route: '/',
    permission: Permission.CREATE_ESPECIE_COBRANCA,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_ESPECIES_COBRANCA,
  },
  update: {
    name: 'update Especie Cobranca',
    route: ':id',
    permission: Permission.UPDATE_ESPECIE_COBRANCA,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_ESPECIES_COBRANCA,
  },
  delete: {
    name: 'delete Especie Cobranca',
    route: ':id',
    permission: Permission.DELETE_ESPECIE_COBRANCA,
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

@Controller('especie-cobranca')
export class EspecieCobrancaController {
  constructor(private readonly especieCobrancaService: EspecieCobrancaService) { }

  @Post(ESPECIE_COBRANCA_ROUTES.create.route)
  @Permissions(ESPECIE_COBRANCA_ROUTES.create.permission)
  create(@Body() createEspecieCobrancaDto: CreateEspecieCobrancaDto) {
    return this.especieCobrancaService.createEspecieCobranca(createEspecieCobrancaDto);
  }

  @Put(ESPECIE_COBRANCA_ROUTES.update.route)
  @Permissions(ESPECIE_COBRANCA_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateEspecieCobrancaDto,
  ) {
    return this.especieCobrancaService.updateEspecieCobranca(Number(id), data);
  }


  @Delete(ESPECIE_COBRANCA_ROUTES.delete.route)
  @Permissions(ESPECIE_COBRANCA_ROUTES.delete.permission)
  async deleteEspecieCobranca(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.especieCobrancaService.deleteEspecieCobranca(Number(id));
  }

  @Get(ESPECIE_COBRANCA_ROUTES.findMany.route)
  @Permissions(ESPECIE_COBRANCA_ROUTES.findMany.permission)
  async getEspecieCobranca(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.especieCobrancaService.getEspecieCobranca(bancoId);
  }


}
