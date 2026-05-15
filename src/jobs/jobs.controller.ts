import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { JobsStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { JobsService } from './jobs.service';

export class CreateJobDto {
  empresaId: number
  alertaId: number
  str_message: string
  str_start_date: string
  str_end_date: string
  str_start_time: string
  str_end_time: string
  str_cron: string
  int_delay: number
  dtm_created: Date
  dtm_updated: Date
  status: JobsStatus
  userId: string
}

export const CONTA_CORRENTE_ROUTES: BaseRoutes = {
  create: {
    name: 'create conta corrente',
    route: '/',
    permission: Permission.CREATE_CONTA_CORRENTE,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_CONTAS_CORRENTE,
  },
  update: {
    name: 'update Conta Corrente',
    route: ':id',
    permission: Permission.UPDATE_CONTA_CORRENTE,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
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

export class BaseParamsIdEmpresaDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;
}

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post(CONTA_CORRENTE_ROUTES.create.route)
  @Permissions(CONTA_CORRENTE_ROUTES.create.permission)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.createJob(createJobDto);
  }

  @Put(CONTA_CORRENTE_ROUTES.update.route)
  @Permissions(CONTA_CORRENTE_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateJobDto,
  ) {
    return this.jobsService.update(id, data);
  }


  @Delete(CONTA_CORRENTE_ROUTES.delete.route)
  @Permissions(CONTA_CORRENTE_ROUTES.delete.permission)
  async deleteContaCorrente(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.jobsService.delete(id);
  }

  @Get(CONTA_CORRENTE_ROUTES.findMany.route)
  @Permissions(CONTA_CORRENTE_ROUTES.findMany.permission)
  async getContasCorrente(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.jobsService.getJobs(empresaId);
  }

  @Patch(CONTA_CORRENTE_ROUTES.patchAtiva.route)
  @Permissions(CONTA_CORRENTE_ROUTES.patchAtiva.permission)
  async ativaAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.jobsService.ativaJob(id);
  }

  @Patch(CONTA_CORRENTE_ROUTES.patchDesativa.route)
  @Permissions(CONTA_CORRENTE_ROUTES.patchDesativa.permission)
  async desativaAlerta(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.jobsService.desativaJob(id);
  }

}
