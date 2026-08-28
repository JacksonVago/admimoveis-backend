import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsIdEmpresaDto } from '@/common/interfaces/base-search';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission, PessoaStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { GrupoFluxoCaixaService } from './grupofluxocaixa.service';

export class CreateGrupoFluxoCaixaDto {
  @IsString()
  descricao: string;

  @IsString()
  cor: string;

  @IsOptional()
  @IsEnum(PessoaStatus)
  status: PessoaStatus;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

}

export const GRUPO_FLUXO_CAIXA_ROUTES: BaseRoutes = {
  create: {
    name: 'create grupo fluxo caixa',
    route: '/',
    permission: Permission.CREATE_GRUPO_FLUXO_CAIXA,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_GRUPO_FLUXO_CAIXA,
  },
  update: {
    name: 'update Grupo Fluxo Caixa',
    route: ':id',
    permission: Permission.UPDATE_GRUPO_FLUXO_CAIXA,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_GRUPO_FLUXO_CAIXA,
  },
  delete: {
    name: 'delete Grupo Fluxo Caixa',
    route: ':id',
    permission: Permission.DELETE_GRUPO_FLUXO_CAIXA,
  },
  patchAtiva: {
    name: 'Ativa Grupo Fluxo Caixa',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_GRUPO_FLUXO_CAIXA,
  },
  patchDesativa: {
    name: 'Desativa Grupo Fluxo Caixa',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_GRUPO_FLUXO_CAIXA,
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

@Controller('grupo-fluxo-caixa')
export class GrupoFluxoCaixaController {
  constructor(private readonly GrupoFluxoCaixaService: GrupoFluxoCaixaService) { }

  @Post(GRUPO_FLUXO_CAIXA_ROUTES.create.route)
  @Permissions(GRUPO_FLUXO_CAIXA_ROUTES.create.permission)
  create(@Body() createGrupoFluxoCaixaDto: CreateGrupoFluxoCaixaDto) {
    return this.GrupoFluxoCaixaService.create(createGrupoFluxoCaixaDto);
  }

  @Put(GRUPO_FLUXO_CAIXA_ROUTES.update.route)
  @Permissions(GRUPO_FLUXO_CAIXA_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateGrupoFluxoCaixaDto,
  ) {
    return this.GrupoFluxoCaixaService.update(Number(id), data);
  }


  @Delete(GRUPO_FLUXO_CAIXA_ROUTES.delete.route)
  @Permissions(GRUPO_FLUXO_CAIXA_ROUTES.delete.permission)
  async deleteGrupoFluxoCaixa(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.GrupoFluxoCaixaService.delete(Number(id));
  }

  @Get(GRUPO_FLUXO_CAIXA_ROUTES.findMany.route)
  @Permissions(GRUPO_FLUXO_CAIXA_ROUTES.findMany.permission)
  async getGrupoFluxoCaixa(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.GrupoFluxoCaixaService.get(empresaId);
  }


}
