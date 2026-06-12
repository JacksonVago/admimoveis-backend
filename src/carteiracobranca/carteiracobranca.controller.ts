import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { CarteiraCobrancaService } from './carteiracobranca.service';

export class CreateCarteiraCobrancaDto {
  @IsString()
  carteira: number;

  @IsString()
  descricao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  vencimentoMinimo: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  vencimentoMaximo: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

}

export const CARTEIRA_COBRANCA_ROUTES: BaseRoutes = {
  create: {
    name: 'create carteira cobranca',
    route: '/',
    permission: Permission.CREATE_CARTEIRA_COBRANCA,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_CARTEIRAS_COBRANCA,
  },
  update: {
    name: 'update Carteira Cobranca',
    route: ':id',
    permission: Permission.UPDATE_CARTEIRA_COBRANCA,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_CARTEIRAS_COBRANCA,
  },
  delete: {
    name: 'delete Carteira Cobranca',
    route: ':id',
    permission: Permission.DELETE_CARTEIRA_COBRANCA,
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

@Controller('carteira-cobranca')
export class CarteiraCobrancaController {
  constructor(private readonly CarteiraCobrancaService: CarteiraCobrancaService) { }

  @Post(CARTEIRA_COBRANCA_ROUTES.create.route)
  @Permissions(CARTEIRA_COBRANCA_ROUTES.create.permission)
  create(@Body() createCarteiraCobrancaDto: CreateCarteiraCobrancaDto) {
    return this.CarteiraCobrancaService.createCarteiraCobranca(createCarteiraCobrancaDto);
  }

  @Put(CARTEIRA_COBRANCA_ROUTES.update.route)
  @Permissions(CARTEIRA_COBRANCA_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateCarteiraCobrancaDto,
  ) {
    return this.CarteiraCobrancaService.updateCarteiraCobranca(Number(id), data);
  }


  @Delete(CARTEIRA_COBRANCA_ROUTES.delete.route)
  @Permissions(CARTEIRA_COBRANCA_ROUTES.delete.permission)
  async deleteCarteiraCobranca(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.CarteiraCobrancaService.deleteCarteiraCobranca(Number(id));
  }

  @Get(CARTEIRA_COBRANCA_ROUTES.findMany.route)
  @Permissions(CARTEIRA_COBRANCA_ROUTES.findMany.permission)
  async getCarteiraCobranca(@Param() { bancoId }: BaseParamsIdBancoDto) {
    return await this.CarteiraCobrancaService.getCarteiraCobranca(bancoId);
  }


}
