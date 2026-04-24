import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto, BaseParamsdiaVenctoDto, BaseParamsIdEmpresaDto, DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
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
import { BoletoStatus, GarantiaLocacaoTypes, LocacaoStatus, LocalDeposito, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import {
  FormDataRequest,
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { LocacaoService } from './locacoes.service';

export enum GarantiaLocacaoTipo {
  'fiador' = 'fiador',
  'titulo-capitalizacao' = 'titulo-capitalizacao',
  'seguro-fianca' = 'seguro-fianca',
  'deposito-calcao' = 'deposito-calcao',
}

export class CreateLocacaoDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicio: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFim: Date;

  @Transform(({ value }) => Number(value))
  @IsInt()
  valorAluguel: number;

  @IsOptional()
  @IsEnum(LocacaoStatus)
  status: LocacaoStatus;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  pessoaId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  diaVencimento: number;

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

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  documentosToDeleteIds?: number[];

  @IsString()
  @IsEnum(GarantiaLocacaoTypes)
  @Transform(({ value }) => {
    if (value === GarantiaLocacaoTipo['fiador']) {
      return GarantiaLocacaoTypes.FIADOR;
    }
    if (value === GarantiaLocacaoTipo['titulo-capitalizacao']) {
      return GarantiaLocacaoTypes.TITULO_CAPITALIZACAO;
    }
    if (value === GarantiaLocacaoTipo['seguro-fianca']) {
      return GarantiaLocacaoTypes.SEGURO_FIANCA;
    }
    if (value === GarantiaLocacaoTipo['deposito-calcao']) {
      return GarantiaLocacaoTypes.DEPOSITO_CALCAO;
    }
    return value;
  })
  garantiaLocacaoTipo: GarantiaLocacaoTypes;

  @IsOptional()
  fiador: number[];

  //start garantia locacao data fields
  @IsOptional()
  @IsString()
  numeroTitulo: string;

  //seguro fianca data fields
  @IsOptional()
  @IsString()
  numeroSeguro: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  valorDeposito: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  quantidadeMeses: number;

  localDeposito: LocalDeposito;

  @IsString()
  numeroApolice: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  vigenciaInicio: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  vigenciaFim: Date;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;
}

export class UpdateLocacaoDto extends PartialType(CreateLocacaoDto) {
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}

export class GetLancamentosDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;
}

export class GetStatusPeriodoDto {
  @IsOptional()
  status?: BoletoStatus | null;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;
}

export class CreatePreLinkLocacaoDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  locatarioId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId: number;
}

export class CreateLocatarioDto {
  @IsInt()
  pessoaId?: number;

  @IsOptional()
  locacao?: CreateLocacaoDto;
}

export class GetLocacoesQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: LocacaoStatus | null;

  @IsOptional()
  exclude?: string;

}

export class UpdateLocatarioDto extends PartialType(CreateLocatarioDto) {
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}

export const LOCACAO_ROUTES: BaseRoutes = {
  create: {
    name: 'create Locacao',
    route: '/',
    permission: Permission.CREATE_LOCACAO,
  },
  findbyid: {
    name: 'find By Id',
    route: '/findbyid/:id',
    permission: Permission.VIEW_LOCACOES,
  },
  findByIdVencimento: {
    name: 'findById vencimento',
    route: 'findbyidVencto/:id',
    permission: Permission.VIEW_LOCACOES,
  },
  update: {
    name: 'update Locacao',
    route: '/:id',
    permission: Permission.UPDATE_LOCACAO,
  },
  findVencimento: {
    name: 'findVencimento',
    route: '/:empresaId/:diaVencimento',
    permission: Permission.VIEW_LOCACOES,
  },
  delete: {
    name: 'delete Locacao',
    route: '/:id',
    permission: Permission.DELETE_LOCACAO,
  },
  search: {
    name: 'Search Locacoes',
    route: '/:empresaId',
    permission: Permission.VIEW_LOCACOES,
  },
  createPreLinkLocacao: {
    name: 'prelinkLocacao',
    route: '/preLinklocacao/create',
    permission: Permission.CREATE_LOCACAO,
  },
  Lancamentos: {
    name: 'locacoes lançamentos',
    route: '/lancamentos/:id',
    permission: Permission.VIEW_LOCACAO_LANCAMENTOS,
  },
  unlinkLocacao: {
    name: 'unlinkLocacao',
    route: '/locacao/:id',
    permission: Permission.DELETE_LOCACAO,
  },
};

@Controller('locacoes')
export class LocacaoController {
  constructor(private readonly locacaoService: LocacaoService) { }

  @Post(LOCACAO_ROUTES.create.route)
  @Permissions(LOCACAO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createLocacaoDto: CreateLocacaoDto) {

    return this.locacaoService.create(createLocacaoDto);
  }

  @Get(LOCACAO_ROUTES.search.route)
  @Permissions(LOCACAO_ROUTES.search.permission)
  async search(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: GetLocacoesQueryDto) {
    const { search, page, limit, status, exclude } = data;
    const response = await this.locacaoService.findMany(Number(empresaId), search, page, limit, status, exclude);
    return response;
  }

  @Get(LOCACAO_ROUTES.findbyid.route)
  @Permissions(LOCACAO_ROUTES.findbyid.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.locacaoService.findById(id);
  }

  @Get(LOCACAO_ROUTES.Lancamentos.route)
  @Permissions(LOCACAO_ROUTES.Lancamentos.permission)
  async lancamentos(@Param() { id }: BaseParamsByIdDto,
    @Query() data: GetLancamentosDto) {
    const { dataInicial, dataFinal } = data;
    const response = await this.locacaoService.findLancamentos(id, dataInicial, dataFinal);
    return response;
  }

  @Get(LOCACAO_ROUTES.findVencimento.route)
  @Permissions(LOCACAO_ROUTES.findVencimento.permission)
  async findVencimento(@Param() { empresaId, diaVencimento }: BaseParamsdiaVenctoDto) {
    const response = await this.locacaoService.findDiaVencimento(Number(empresaId), Number(diaVencimento));
    return response;
  }

  /*@Get(LOCACAO_ROUTES.findByIdVencimento.route)
  @Permissions(LOCACAO_ROUTES.findByIdVencimento.permission)
  async findByIdVencimento(@Param() { id }: BaseParamsByIdDto, @Query() data: GetStatusPeriodoDto) {
    const { status, dataInicial, dataFinal } = data;
    return await this.locacaoService.findByIdVencto(id, status, dataInicial, dataFinal);
  }*/

  @Put(LOCACAO_ROUTES.update.route)
  @Permissions(LOCACAO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLocacaoDto,
  ) {
    return await this.locacaoService.update(id, data);
  }

  @Delete(LOCACAO_ROUTES.delete.route)
  @Permissions(LOCACAO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.locacaoService.deleteLocacao(id);
  }

  //end rent
  @Delete(LOCACAO_ROUTES.unlinkLocacao.route)
  @Permissions(LOCACAO_ROUTES.unlinkLocacao.permission)
  async unlinkLocacao(@Param() { id }: BaseParamsByIdDto) {
    return this.locacaoService.deleteLocatario(id);
  }

}
