import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TipoAutorizacaoService } from './tipoautorizacao.service';

export class CreateTipoAutorizacaoDto {
  @IsString()
  codigo: string;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const TIPO_AUTORIZACAO_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo Autorizacao',
    route: '/',
    permission: Permission.CREATE_TIPO_AUTORIZACAO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPO_AUTORIZACAO,
  },
  update: {
    name: 'update tipo Autorizacao',
    route: ':id',
    permission: Permission.UPDATE_TIPO_AUTORIZACAO,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_INSTRUCOES_COBRANCA,
  },
  delete: {
    name: 'delete tipo Autorizacao',
    route: ':id',
    permission: Permission.DELETE_TIPO_AUTORIZACAO,
  },
  patchAtiva: {
    name: 'Ativa tipo Autorizacao',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO_AUTORIZACAO,
  },
  patchDesativa: {
    name: 'Desativa tipo Autorizacao',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO_AUTORIZACAO,
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

@Controller('tipo-autorizacao')
export class TipoAutorizacaoController {
  constructor(private readonly TipoAutorizacaoService: TipoAutorizacaoService) { }

  @Post(TIPO_AUTORIZACAO_ROUTES.create.route)
  @Permissions(TIPO_AUTORIZACAO_ROUTES.create.permission)
  create(@Body() createTipoAutorizacaoDto: CreateTipoAutorizacaoDto) {
    return this.TipoAutorizacaoService.createTipoAutorizacao(createTipoAutorizacaoDto);
  }

  @Put(TIPO_AUTORIZACAO_ROUTES.update.route)
  @Permissions(TIPO_AUTORIZACAO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoAutorizacaoDto,
  ) {
    return this.TipoAutorizacaoService.updateTipoAutorizacao(Number(id), data);
  }


  @Delete(TIPO_AUTORIZACAO_ROUTES.delete.route)
  @Permissions(TIPO_AUTORIZACAO_ROUTES.delete.permission)
  async deleteTipoAutorizacao(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoAutorizacaoService.deleteTipoAutorizacao(Number(id));
  }

  @Get(TIPO_AUTORIZACAO_ROUTES.findMany.route)
  @Permissions(TIPO_AUTORIZACAO_ROUTES.findMany.permission)
  async getTipoAutorizacao(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.TipoAutorizacaoService.getTiposAutorizacaos(bancoId);
  }


}
