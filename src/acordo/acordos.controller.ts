import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto, BaseParamsIdEmpresaDto, DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
import { BaseParamsByStatusAcordo } from '@/common/interfaces/dtos/acordo.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { BoletoStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import {
  FormDataRequest,
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile
} from 'nestjs-form-data';
import { AcordosService } from './acordos.service';

export class CreateAcordoDto {

  @IsString()
  @IsOptional()
  observacao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorOriginal: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  juros: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  multa: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  desconto: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorLiquido: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  qtdParcelas: number;

  @IsString()
  tipoGeracaoBoleto: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataEmissao: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataVencimento: Date;

  @IsOptional()
  @IsEnum(BoletoStatus)
  status: BoletoStatus;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  pessoaId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  locacaoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  imovelId: number;

  @IsFiles()
  @IsOptional()
  //Limiting to 50 for supabase free tier limit
  @MaxFileSize(50 * 1024 * 1024, { each: true })
  @HasMimeType(
    [
      'application/pdf', // PDF
      'image/jpeg', // Imagem JPEG
      'image/png', // Imagem PNG
      'application/msword', // Documento Word (.doc)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    {
      each: true,
    },
  )
  documentos?: MemoryStoredFile[];

}

export class UpdateAcordoDto extends PartialType(CreateAcordoDto) {
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
  //documentosToDeleteIds?: { id: number, file: string }[];
}

export class GetAcordosQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: BoletoStatus | null;

  @IsOptional()
  exclude?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;

}

export const ACORDO_ROUTES: BaseRoutes = {
  create: {
    name: 'create Acordo',
    route: '/',
    permission: Permission.CREATE_ACORDO,
  },
  findById: {
    name: 'findById',
    route: 'findbyid/:id',
    permission: Permission.VIEW_ACORDOS,
  },
  update: {
    name: 'update Acordo',
    route: ':id',
    permission: Permission.UPDATE_ACORDO,
  },
  delete: {
    name: 'delete Acordo',
    route: ':id',
    permission: Permission.DELETE_ACORDO,
  },
  search: {
    name: 'Search Acordos',
    route: '/:empresaId',
    permission: Permission.VIEW_ACORDOS,
  },
  AcordosStatus: {
    name: 'Acordos status',
    route: '/:empresaId/:status',
    permission: Permission.VIEW_ACORDOS,
  },
  statusAcordo: {
    name: 'Status Acordo',
    route: 'statusAcordo/:id',
    permission: Permission.UPDATE_ACORDO,
  },
};

@Controller('acordos')
export class AcordoController {
  constructor(private readonly AcordoService: AcordosService) { }

  @Post(ACORDO_ROUTES.create.route)
  @Permissions(ACORDO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createAcordoDto: CreateAcordoDto) {

    return this.AcordoService.create(createAcordoDto);
  }

  @Get(ACORDO_ROUTES.search.route)
  @Permissions(ACORDO_ROUTES.search.permission)
  async search(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: GetAcordosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.AcordoService.findManyAcordo(empresaId, search, page, limit, status, exclude, dataInicial, dataFinal);
    return response;
  }

  @Get(ACORDO_ROUTES.findById.route)
  @Permissions(ACORDO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.AcordoService.findById(id);
  }

  @Get(ACORDO_ROUTES.AcordosStatus.route)
  @Permissions(ACORDO_ROUTES.AcordosStatus.permission)
  async AcordosStatus(@Param() { empresaId, status }: BaseParamsByStatusAcordo) {
    const response = await this.AcordoService.AcordosStatus(empresaId, status);
    return response;
  }

  @Put(ACORDO_ROUTES.update.route)
  @Permissions(ACORDO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: UpdateAcordoDto,
  ) {
    return await this.AcordoService.update(id, data);
  }

  @Put(ACORDO_ROUTES.statusAcordo.route)
  @Permissions(ACORDO_ROUTES.statusAcordo.permission)
  async statusPagamento(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateAcordoDto) {
    return this.AcordoService.updateStatus(id, data);
  }

  @Delete(ACORDO_ROUTES.delete.route)
  @Permissions(ACORDO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.AcordoService.delete(id);
  }

}
