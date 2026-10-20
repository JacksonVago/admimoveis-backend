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
import { lancamentoStatus, LocacaoStatus, Locatario, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import {
  FormDataRequest
} from 'nestjs-form-data';
import { LancamentosAcordosService } from './lancamentosAcordo.service';

export class LancamentoDto {
  id: number;
  descricao: string;
  valorOriginal: number;
  juros: number;
  multa: number;
  desconto: number;
  dataLancamento: Date;
  dataEmissao: Date;
  dataVencimento: Date;

  status: lancamentoStatus;
  acordoId: number;
  boletobancarioId: number;
}

export class gerarBoletoDto {
  id: number;
  dataInicio: Date;
  dataFim: Date;
  valorAluguel: number;
  status: LocacaoStatus;
  imovelId: number;
  diaVencimento: number;
  lancamentos: LancamentoDto[];
  locatarios: Locatario[];
  empresaId: number;
}

export class CreateLancamentoDto {


  @IsOptional()
  @IsString()
  descricao: string;

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

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataLancamento: Date;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  boletobancarioId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  acordoId: number;

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

export const LANCAMENTO_ACORDO_ROUTES: BaseRoutes = {
  create: {
    name: 'create Lancamento',
    route: '/',
    permission: Permission.CREATE_LANCAMENTO_ACORDO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_LANCAMENTOS_ACORDOS,
  },
  update: {
    name: 'update Lancamento',
    route: ':id',
    permission: Permission.UPDATE_LANCAMENTO_ACORDO,
  },
  delete: {
    name: 'delete Lancamento',
    route: ':id',
    permission: Permission.DELETE_LANCAMENTO_ACORDO,
  },
  search: {
    name: 'Search Lancamentos',
    route: '/:empresaId',
    permission: Permission.VIEW_LANCAMENTOS_ACORDOS,
  },
  statusLancamento: {
    name: 'Status Lancamento',
    route: 'statuslancamento/:id',
    permission: Permission.UPDATE_LANCAMENTO_ACORDO,
  },
  gerarBoleto: {
    name: 'Gerar Boleto',
    route: 'gerar-boleto/',
    permission: Permission.CREATE_PAGAMENTO,
  },
};

@Controller('acordo/lancamentos')
export class LancamentoAcordoController {
  constructor(private readonly lancamentoService: LancamentosAcordosService) { }

  @Post(LANCAMENTO_ACORDO_ROUTES.create.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.create.permission)
  @FormDataRequest()
  createPagamento(@Body() createLancamentoDto: CreateLancamentoDto) {

    return this.lancamentoService.create(createLancamentoDto);
  }

  /*@Post(LANCAMENTO_ACORDO_ROUTES.gerarBoleto.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.gerarBoleto.permission)
  create(@Body() gerarBoletoDto: gerarBoletoDto) {

    return this.lancamentoService.createPagamento(gerarBoletoDto);
  }

  @Get(LANCAMENTO_ACORDO_ROUTES.search.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.search.permission)
  async search(@Query() data: GetLancamentosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.lancamentoService.findMany(search, page, limit, status, exclude);
    return response;
  }
 */

  @Get(LANCAMENTO_ACORDO_ROUTES.search.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.search.permission)
  async search(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: GetLancamentosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.lancamentoService.findManyLocacao(Number(empresaId), search, page, limit, status, exclude, dataInicial, dataFinal);
    return response;
  }

  @Get(LANCAMENTO_ACORDO_ROUTES.findById.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.lancamentoService.findById(id);
  }

  @Put(LANCAMENTO_ACORDO_ROUTES.update.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLancamentoDto,
  ) {
    return await this.lancamentoService.update(id, data);
  }

  /*@Put(LANCAMENTO_ACORDO_ROUTES.statusLancamento.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.statusLancamento.permission)
  async statusLancamento(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLancamentoDto) {
    return this.lancamentoService.updateStatus(id, data);
  }*/

  @Delete(LANCAMENTO_ACORDO_ROUTES.delete.route)
  @Permissions(LANCAMENTO_ACORDO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.lancamentoService.delete(id);
  }

}
