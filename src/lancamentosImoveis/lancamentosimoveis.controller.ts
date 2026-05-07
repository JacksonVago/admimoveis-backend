import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto, BaseParamsIdEmpresaDto, DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
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
import { lancamentoStatus, LancamentoTipo, Permission, Proprietario } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import {
  FormDataRequest
} from 'nestjs-form-data';
import { LancamentosImoveisService } from './lancamentosimoveis.service';

export class LancamentoDto {
  id: number;
  lancamentotipo: LancamentoTipo;
  parcela: number;
  tipoId: number;
  valorLancamento: number;
  dataLancamento: Date;
  vencimentoLancamento: Date;
  observacao: string;
  status: lancamentoStatus;
  imovelId: number;
}

export class gerarBoletoDto {
  empresaId: number;
  imovelId: number;
  dataVencimento: Date;
  lancamentos: LancamentoDto[];
  proprietarios: Proprietario[]
}

export class CreateLancamentoDto {

  @Transform(({ value }) => Number(value))
  @IsInt()
  parcela: number

  @Transform(({ value }) => Number(value))
  @IsInt()
  tipoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorLancamento: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataLancamento: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  vencimentoLancamento: Date;

  @IsOptional()
  @IsString()
  linhaDigitavel: string; //Linha digitável do boleto gerado para esse lançamento

  //start garantia locacao data fields
  @IsOptional()
  @IsString()
  observacao: string;

  @IsOptional()
  @IsEnum(lancamentoStatus)
  status: lancamentoStatus;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId: number;

}

export class GetLancamentosQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: lancamentoStatus | null;

  @IsOptional()
  exclude?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;

}

export const LANCAMENTO_ROUTES: BaseRoutes = {
  create: {
    name: 'create Lancamento',
    route: '/',
    permission: Permission.CREATE_LOCACAO_LANCAMENTO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_LOCACAO_LANCAMENTOS,
  },
  update: {
    name: 'update Lancamento',
    route: ':id',
    permission: Permission.UPDATE_LOCACAO_LANCAMENTO,
  },
  delete: {
    name: 'delete Lancamento',
    route: ':id',
    permission: Permission.DELETE_LOCACAO_LANCAMENTO,
  },
  search: {
    name: 'Search Lancamentos',
    route: '/:empresaId',
    permission: Permission.VIEW_LOCACAO_LANCAMENTOS,
  },
  statusLancamento: {
    name: 'Status Lancamento',
    route: 'statuslancamento/:id',
    permission: Permission.UPDATE_LOCACAO_LANCAMENTO,
  },
  gerarBoleto: {
    name: 'Gerar Boleto',
    route: 'gerar-boleto/',
    permission: Permission.CREATE_PAGAMENTO,
  },
};

@Controller('lancamentosimoveis')
export class LancamentoImovelController {
  constructor(private readonly lancamentoService: LancamentosImoveisService) { }

  @Post(LANCAMENTO_ROUTES.create.route)
  @Permissions(LANCAMENTO_ROUTES.create.permission)
  @FormDataRequest()
  createPagamento(@Body() createLancamentoDto: CreateLancamentoDto) {

    return this.lancamentoService.create(createLancamentoDto);
  }

  @Post(LANCAMENTO_ROUTES.gerarBoleto.route)
  @Permissions(LANCAMENTO_ROUTES.gerarBoleto.permission)
  create(@Body() gerarBoletoDto: gerarBoletoDto) {

    return this.lancamentoService.createPagamento(gerarBoletoDto);
  }

  /*  @Get(LANCAMENTO_ROUTES.search.route)
  @Permissions(LANCAMENTO_ROUTES.search.permission)
  async search(@Query() data: GetLancamentosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.lancamentoService.findMany(search, page, limit, status, exclude);
    return response;
  }
 */

  @Get(LANCAMENTO_ROUTES.search.route)
  @Permissions(LANCAMENTO_ROUTES.search.permission)
  async search(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: GetLancamentosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.lancamentoService.findManyImovel(Number(empresaId), search, page, limit, status, exclude, dataInicial, dataFinal);
    return response;
  }

  @Get(LANCAMENTO_ROUTES.findById.route)
  @Permissions(LANCAMENTO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.lancamentoService.findById(id);
  }

  @Put(LANCAMENTO_ROUTES.update.route)
  @Permissions(LANCAMENTO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLancamentoDto,
  ) {
    return await this.lancamentoService.update(id, data);
  }

  @Put(LANCAMENTO_ROUTES.statusLancamento.route)
  @Permissions(LANCAMENTO_ROUTES.statusLancamento.permission)
  async statusLancamento(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLancamentoDto) {
    return this.lancamentoService.updateStatus(id, data);
  }

  @Delete(LANCAMENTO_ROUTES.delete.route)
  @Permissions(LANCAMENTO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.lancamentoService.delete(id);
  }

}
