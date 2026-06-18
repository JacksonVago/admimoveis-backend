import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TipoMultaService } from './tipomulta.service';

export class CreateTipoMultaDto {
  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const TIPO_MULTA_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo multa',
    route: '/',
    permission: Permission.CREATE_TIPO_MULTA,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPOS_MULTA,
  },
  update: {
    name: 'update tipo multa',
    route: ':id',
    permission: Permission.UPDATE_TIPO_MULTA,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_TIPOS_MULTA,
  },
  delete: {
    name: 'delete tipo multa',
    route: ':id',
    permission: Permission.DELETE_TIPO_MULTA,
  },
  patchAtiva: {
    name: 'Ativa Instrucao Cobranca',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO_MULTA,
  },
  patchDesativa: {
    name: 'Desativa Instrucao Cobranca',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO_MULTA,
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

@Controller('tipo-multas')
export class TipoMultaController {
  constructor(private readonly TipoMultaService: TipoMultaService) { }

  @Post(TIPO_MULTA_ROUTES.create.route)
  @Permissions(TIPO_MULTA_ROUTES.create.permission)
  create(@Body() createTipoMultaDto: CreateTipoMultaDto) {
    return this.TipoMultaService.createTipoMulta(createTipoMultaDto);
  }

  @Put(TIPO_MULTA_ROUTES.update.route)
  @Permissions(TIPO_MULTA_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoMultaDto,
  ) {
    return this.TipoMultaService.updateTipoMulta(Number(id), data);
  }


  @Delete(TIPO_MULTA_ROUTES.delete.route)
  @Permissions(TIPO_MULTA_ROUTES.delete.permission)
  async deleteTipoMulta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoMultaService.deleteTipoMulta(Number(id));
  }

  @Get(TIPO_MULTA_ROUTES.findMany.route)
  @Permissions(TIPO_MULTA_ROUTES.findMany.permission)
  async getTipoMulta(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.TipoMultaService.getTiposMultas(bancoId);
  }


}
