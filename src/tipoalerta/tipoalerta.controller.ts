import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Permission, PessoaStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TipoAlertaService } from './tipoalerta.service';

export class CreateTipoAlertaDto {
  @IsString()
  descricao: string;

  @IsString()
  status: PessoaStatus;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

}

export const TIPO_ALERTA_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo alerta',
    route: '/',
    permission: Permission.CREATE_TIPO_ALERTA,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPOS_ALERTA,
  },
  update: {
    name: 'update Tipo Alerta',
    route: ':id',
    permission: Permission.UPDATE_TIPO_ALERTA,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_ALERTAS,
  },
  delete: {
    name: 'delete Tipo Alerta',
    route: ':id',
    permission: Permission.DELETE_TIPO_ALERTA,
  },
  patchAtiva: {
    name: 'Ativa Tipo',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO_ALERTA,
  },
  patchDesativa: {
    name: 'Desativa Tipo',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO_ALERTA,
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

@Controller('tipoalerta')
export class TipoAlertaController {
  constructor(private readonly TipoAlertaService: TipoAlertaService) { }

  @Post(TIPO_ALERTA_ROUTES.create.route)
  @Permissions(TIPO_ALERTA_ROUTES.create.permission)
  create(@Body() createTipoDto: CreateTipoAlertaDto) {
    return this.TipoAlertaService.createTipo(createTipoDto);
  }

  @Put(TIPO_ALERTA_ROUTES.update.route)
  @Permissions(TIPO_ALERTA_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoAlertaDto,
  ) {
    return this.TipoAlertaService.updateTipo(Number(id), data);
  }


  @Delete(TIPO_ALERTA_ROUTES.delete.route)
  @Permissions(TIPO_ALERTA_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoAlertaService.deleteTipo(Number(id));
  }

  @Get(TIPO_ALERTA_ROUTES.findMany.route)
  @Permissions(TIPO_ALERTA_ROUTES.findMany.permission)
  async getTipo(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.TipoAlertaService.getTipos(empresaId);
  }

  @Patch(TIPO_ALERTA_ROUTES.patchAtiva.route)
  @Permissions(TIPO_ALERTA_ROUTES.patchAtiva.permission)
  async ativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoAlertaService.ativaTipo(Number(id));
  }

  @Patch(TIPO_ALERTA_ROUTES.patchDesativa.route)
  @Permissions(TIPO_ALERTA_ROUTES.patchDesativa.permission)
  async desativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoAlertaService.desativaTipo(Number(id));
  }

}
