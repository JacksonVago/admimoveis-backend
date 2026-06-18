import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TipoDescontoService } from './tipodesconto.service';

export class CreateTipoDescontoDto {
  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const TIPO_DESCONTOS_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo desconto',
    route: '/',
    permission: Permission.CREATE_TIPO_DESCONTOS,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPOS_DESCONTOS,
  },
  update: {
    name: 'update tipo desconto',
    route: ':id',
    permission: Permission.UPDATE_TIPO_DESCONTOS,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_INSTRUCOES_COBRANCA,
  },
  delete: {
    name: 'delete tipo desconto',
    route: ':id',
    permission: Permission.DELETE_TIPO_DESCONTOS,
  },
  patchAtiva: {
    name: 'Ativa tipo desconto',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO_DESCONTOS,
  },
  patchDesativa: {
    name: 'Desativa tipo desconto',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO_DESCONTOS,
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

@Controller('tipo-descontos')
export class TipoDescontoController {
  constructor(private readonly TipoDescontoService: TipoDescontoService) { }

  @Post(TIPO_DESCONTOS_ROUTES.create.route)
  @Permissions(TIPO_DESCONTOS_ROUTES.create.permission)
  create(@Body() createTipoDescontoDto: CreateTipoDescontoDto) {
    return this.TipoDescontoService.createTipoDesconto(createTipoDescontoDto);
  }

  @Put(TIPO_DESCONTOS_ROUTES.update.route)
  @Permissions(TIPO_DESCONTOS_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoDescontoDto,
  ) {
    return this.TipoDescontoService.updateTipoDesconto(Number(id), data);
  }


  @Delete(TIPO_DESCONTOS_ROUTES.delete.route)
  @Permissions(TIPO_DESCONTOS_ROUTES.delete.permission)
  async deleteTipoDesconto(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoDescontoService.deleteTipoDesconto(Number(id));
  }

  @Get(TIPO_DESCONTOS_ROUTES.findMany.route)
  @Permissions(TIPO_DESCONTOS_ROUTES.findMany.permission)
  async getTipoDesconto(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.TipoDescontoService.getTiposDescontos(bancoId);
  }


}
