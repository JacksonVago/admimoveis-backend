import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseGetPaginatedQueryDto } from '@/common/interfaces/base-search';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Permission } from '@prisma/client';
import { IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateMoradorDto } from './dtos/create-morador.dto';
import { MoradoresService } from './moradores.service';
export class GetMoradoresQueryDto extends BaseGetPaginatedQueryDto { }

export const MORADORES_ROUTES: BaseRoutes = {
  create: {
    name: 'Create Morador',
    route: '/',
    permission: Permission.CREATE_MORADOR,
  },
  findByDocument: {
    name: 'Find Morador by Document',
    route: '/find-by-document/:documento',
    permission: Permission.VIEW_MORADORES,
  },
  get: {
    name: 'Get Morador by ID',
    route: '/:id',
    permission: Permission.VIEW_MORADORES,
  },
  put: {
    name: 'Update Morador',
    route: '/:id',
    permission: Permission.UPDATE_MORADOR,
  },
  vincularLocacao: {
    name: 'Link Morador to Locacao',
    route: '/:id/vincular-locacao/:locacaoId',
    permission: Permission.UPDATE_MORADOR,
  },
  desvincularLocacao: {
    name: 'Unlink Morador from Locacao',
    route: '/:id/desvincular-locacao/:locacaoId',
    permission: Permission.UPDATE_MORADOR,
  },
  delete: {
    name: 'Delete Morador',
    route: '/:id',
    permission: Permission.DELETE_MORADOR,
  },
  search: {
    name: 'Search Moradores',
    route: '/',
    permission: Permission.VIEW_MORADORES,
  },
};

export class FindByDocumentParamsDto {
  @IsString()
  documento: string;
}

@Controller('moradores')
export class MoradoresController {
  constructor(private readonly moradoresService: MoradoresService) { }

  @Post(MORADORES_ROUTES.create.route)
  @Permissions(MORADORES_ROUTES.create.permission)
  @FormDataRequest()
  async create(@Body() data: CreateMoradorDto) {
    return await this.moradoresService.create(data);
  }

  @Get(MORADORES_ROUTES.get.route)
  @Permissions(MORADORES_ROUTES.get.permission)
  async get(@Param('id') id: number) {
    return await this.moradoresService.findMoradorById(id);
  }

  @Get(MORADORES_ROUTES.findByDocument.route)
  @Permissions(MORADORES_ROUTES.findByDocument.permission)
  async findByDocument(@Param() { documento }: FindByDocumentParamsDto) {
    return await this.moradoresService.findByDocumento(documento);
  }

  @Put(MORADORES_ROUTES.put.route)
  @Permissions(MORADORES_ROUTES.put.permission)
  @FormDataRequest()
  //async update(@Param('id') id: number, @Body() data: UpdateProprietarioDto) {
  async update(@Param('id') id: number, @Body() data: CreateMoradorDto) {
    return await this.moradoresService.update(id, data);
  }

  @Put(MORADORES_ROUTES.vincularLocacao.route)
  @Permissions(MORADORES_ROUTES.vincularLocacao.permission)
  @FormDataRequest()
  async vincularLocacao(
    @Param('id') id: number,
    @Param('locacaoId') locacaoId: number,
    @Body() data: CreateMoradorDto
  ) {

    return await this.moradoresService.linkMoradorToLocacao(
      id,
      locacaoId,
      data,
    );
  }

  @Delete(MORADORES_ROUTES.desvincularLocacao.route)
  @Permissions(MORADORES_ROUTES.desvincularLocacao.permission)
  async desvincularLocacao(
    @Param('id') id: number,
    @Param('locacaoId') locacaoId: number,
  ) {
    return await this.moradoresService.unlinkMoradorFromLocacao(
      id,
      locacaoId,
    );
  }

  @Delete(MORADORES_ROUTES.delete.route)
  @Permissions(MORADORES_ROUTES.delete.permission)
  async delete(@Param('id') id: number) {
    await this.moradoresService.delete(id);
  }

  @Get(MORADORES_ROUTES.search.route)
  @Permissions(MORADORES_ROUTES.search.permission)
  async search(@Query() data: GetMoradoresQueryDto) {
    const { search, page, limit } = data;

    const response = await this.moradoresService.findManyBySearch(
      search,
      page,
      limit,
    );


    return response;
  }
}
