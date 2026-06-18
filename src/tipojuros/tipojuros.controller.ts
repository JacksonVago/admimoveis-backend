import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TipoJurosService } from './tipojuros.service';

export class CreateTipoJurosDto {
  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const TIPO_JUROS_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo juros',
    route: '/',
    permission: Permission.CREATE_TIPO_JUROS,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPOS_JUROS,
  },
  update: {
    name: 'update tipo juros',
    route: ':id',
    permission: Permission.UPDATE_TIPO_JUROS,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_INSTRUCOES_COBRANCA,
  },
  delete: {
    name: 'delete tipo juros',
    route: ':id',
    permission: Permission.DELETE_TIPO_JUROS,
  },
  patchAtiva: {
    name: 'Ativa tipo juros',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO_JUROS,
  },
  patchDesativa: {
    name: 'Desativa tipo juros',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO_JUROS,
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

@Controller('tipo-juros')
export class TipoJurosController {
  constructor(private readonly TipoJurosService: TipoJurosService) { }

  @Post(TIPO_JUROS_ROUTES.create.route)
  @Permissions(TIPO_JUROS_ROUTES.create.permission)
  create(@Body() createTipoJurosDto: CreateTipoJurosDto) {
    return this.TipoJurosService.createTipoJuros(createTipoJurosDto);
  }

  @Put(TIPO_JUROS_ROUTES.update.route)
  @Permissions(TIPO_JUROS_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoJurosDto,
  ) {
    return this.TipoJurosService.updateTipoJuros(Number(id), data);
  }


  @Delete(TIPO_JUROS_ROUTES.delete.route)
  @Permissions(TIPO_JUROS_ROUTES.delete.permission)
  async deleteTipoJuros(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoJurosService.deleteTipoJuros(Number(id));
  }

  @Get(TIPO_JUROS_ROUTES.findMany.route)
  @Permissions(TIPO_JUROS_ROUTES.findMany.permission)
  async getTipoJuros(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.TipoJurosService.getTiposJuros(bancoId);
  }


}
