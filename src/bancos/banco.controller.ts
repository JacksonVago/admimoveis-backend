import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { BancoService } from './banco.service';

export class CreateBancoDto {
  @IsString()
  codigo: number;

  @IsString()
  nome: string;

}

export const BANCO_ROUTES: BaseRoutes = {
  create: {
    name: 'create banco',
    route: '/',
    permission: Permission.CREATE_BANCO,
  },
  findById: {
    name: 'findById',
    route: 'findbyid/:id',
    permission: Permission.VIEW_BANCOS,
  },
  update: {
    name: 'update banco',
    route: ':id',
    permission: Permission.UPDATE_BANCO,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_BANCOS,
  },
  delete: {
    name: 'delete banco',
    route: ':id',
    permission: Permission.DELETE_BANCO,
  },
  patchAtiva: {
    name: 'Ativa banco',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_BANCO,
  },
  patchDesativa: {
    name: 'Desativa banco',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_BANCO,
  },

};

export class BaseParamsByIdDto {
  @IsNumber()
  id: number;
}

export class BaseParamsIdBancoDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;
}

@Controller('bancos')
export class BancoController {
  constructor(private readonly bancoService: BancoService) { }

  @Post(BANCO_ROUTES.create.route)
  @Permissions(BANCO_ROUTES.create.permission)
  create(@Body() createBancoDto: CreateBancoDto) {
    return this.bancoService.createBanco(createBancoDto);
  }

  @Put(BANCO_ROUTES.update.route)
  @Permissions(BANCO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateBancoDto,
  ) {
    return this.bancoService.updateBanco(id, data);
  }


  @Delete(BANCO_ROUTES.delete.route)
  @Permissions(BANCO_ROUTES.delete.permission)
  async deleteBanco(@Param() { id }: BaseParamsByIdDto) {
    return await this.bancoService.deleteBanco(id);
  }

  @Get(BANCO_ROUTES.findMany.route)
  @Permissions(BANCO_ROUTES.findMany.permission)
  async getBancos(@Param() { bancoId }: BaseParamsIdBancoDto) {
    console.log(bancoId);
    return await this.bancoService.getBancos(bancoId);
  }


}
