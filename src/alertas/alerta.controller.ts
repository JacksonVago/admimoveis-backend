import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsIdEmpresaDto } from '@/common/interfaces/base-search';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { FrequenciaEnvio, Permission, TipoAgendamento, TipoIntervaloEnvio } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { AlertaService } from './alerta.service';

export class CreateAlertaDto {
  @IsString()
  descricao: string;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  ativo: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  alertaId: number;

  @IsString()
  @IsOptional()
  textoAlerta: string;

  @IsEnum(TipoAgendamento)
  @IsOptional()
  tipoAgendamento: TipoAgendamento;

  @IsEnum(FrequenciaEnvio)
  @IsOptional()
  frequenciaEnvio: FrequenciaEnvio;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dataInicio: Date;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  ocorreAcada: number;

  @IsString()
  @IsOptional()
  grupoEnvio: string;

  @IsString()
  @IsOptional()
  horarioEnvio: string;

  @IsEnum(TipoIntervaloEnvio)
  @IsOptional()
  tipoIntervaloEnvio: TipoIntervaloEnvio;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  intervaloEnvio: number;

  @IsString()
  @IsOptional()
  horarioInicial: string;

  @IsString()
  @IsOptional()
  horarioFinal: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dataInicioEnvio: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dataFinalEnvio: Date;

}

export const ALERTA_ROUTES: BaseRoutes = {
  create: {
    name: 'create alerta',
    route: '/',
    permission: Permission.CREATE_ALERTA,
  },
  findById: {
    name: 'findById',
    route: '/findbyid/:id',
    permission: Permission.VIEW_ALERTAS,
  },
  update: {
    name: 'update Alerta',
    route: ':id',
    permission: Permission.UPDATE_ALERTA,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_ALERTAS,
  },
  delete: {
    name: 'delete Alerta',
    route: ':id',
    permission: Permission.DELETE_ALERTA,
  },
  patchAtiva: {
    name: 'Ativa Tipo',
    route: '/ativa/:id',
    permission: Permission.UPDATE_TIPO,
  },
  patchDesativa: {
    name: 'Desativa Tipo',
    route: '/desativa/:id',
    permission: Permission.UPDATE_TIPO,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

@Controller('alertas')
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) { }

  @Post(ALERTA_ROUTES.create.route)
  @Permissions(ALERTA_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createAlertaDto: CreateAlertaDto) {
    return this.alertaService.createAlerta(createAlertaDto);
  }

  @Put(ALERTA_ROUTES.update.route)
  @Permissions(ALERTA_ROUTES.update.permission)
  @FormDataRequest()
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateAlertaDto,
  ) {
    return this.alertaService.updateAlerta(Number(id), data);
  }


  @Delete(ALERTA_ROUTES.delete.route)
  @Permissions(ALERTA_ROUTES.delete.permission)
  async deleteAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.alertaService.deleteAlerta(Number(id));
  }

  @Get(ALERTA_ROUTES.findMany.route)
  @Permissions(ALERTA_ROUTES.findMany.permission)
  async getAlertas(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.alertaService.getAlertas(empresaId);
  }

  @Get(ALERTA_ROUTES.findById.route)
  @Permissions(ALERTA_ROUTES.findById.permission)
  async getAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.alertaService.getAlerta(Number(id));
  }

  @Patch(ALERTA_ROUTES.patchAtiva.route)
  @Permissions(ALERTA_ROUTES.patchAtiva.permission)
  async ativaAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.alertaService.ativaAlerta(Number(id));
  }

  @Patch(ALERTA_ROUTES.patchDesativa.route)
  @Permissions(ALERTA_ROUTES.patchDesativa.permission)
  async desativaAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.alertaService.desativaAlerta(Number(id));
  }

}
