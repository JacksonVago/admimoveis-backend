import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { BoletoBancarioService } from './BoletoBancario.service';

export class CreateBoletoBancarioDto {
  @IsString()
  codigo: number;

  @IsString()
  descricao: string;

  @IsString()
  sigla: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  bancoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  boletoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valor: number; //Valor do boleto

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorPago: number; //Valor pago no boleto

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataBoleto: Date; //Emissao do boleto

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataVencimento: Date; //Vencimento do boleto

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dataPagamento: Date //Data de pagamento do boleto

  @IsString()
  @IsOptional()
  formaPix: string; //Forma de pagamento PIX para recebimento

  @IsString()
  @IsOptional()
  codigoBarras: string;

  @IsString()
  @IsOptional()
  linhaDigitavel: string;

  @IsString()
  @IsOptional()
  nossoNumero: string;

  @IsString()
  @IsOptional()
  urlBoleto: string; //URL para visualização do boleto

  @IsString()
  @IsOptional()
  registrado: string; //S/N Informa se ocorreu o registro do boleto

  @IsString()
  @IsOptional()
  emvPIX: string; //Código EMV para pagamento via PIX

  @IsString()
  @IsOptional()
  metodoPagamento: string; //Método de pagamento utilizado

  @IsString()
  @IsOptional()
  status: string; //Status do boleto

  @IsString()
  @IsOptional()
  observacao: string;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  pagtoParcial: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  qtdeMaxParcial: number; //Quantide de pagamentos parcial 1..99

  @IsString()
  @IsOptional()
  formaEnvio: string;

  @IsString()
  @IsOptional()
  assuntoEmail: string;

  @IsString()
  @IsOptional()
  mensagemEmail1: string;

  @IsString()
  @IsOptional()
  mensagemEmail2: string;

  @IsString()
  @IsOptional()
  mensagemEmail3: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoJurosCobId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorJuros: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  percJuros: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  diasInicioJuros: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoMultaCobId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorMulta: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  percMulta: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  diasInicioMulta: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoDescontoCobId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorDesconto: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  percDesconto: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  diasInicioDesconto: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  tipoAutorizacaoCobId: number;

  @IsString()
  @IsOptional()
  tipoRecebimentoDiv: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorMinDiverg: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorMaxDiverg: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  percMinDiverg: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  percMaxDiverg: number;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  protestar: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  qtdeDiasProtesto: number;

  @Transform(({ value }) => {
    if (String(value).toLowerCase() === 'true') return true;
    if (String(value).toLowerCase() === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  negativar: boolean;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  qtdeDiasNegativar: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoCobId1: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoCobId2: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoCobId3: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId1: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId2: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId3: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  instrucaoRecId4: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  contaId: number;


}

export const BOLETO_BANCARIO_ROUTES: BaseRoutes = {
  create: {
    name: 'create boleto bancario',
    route: '/',
    permission: Permission.CREATE_BOLETO_BANCARIO,
  },
  findById: {
    name: 'findById',
    route: '/findbyid/:id',
    permission: Permission.VIEW_BOLETO_BANCARIO,
  },
  update: {
    name: 'update boleto bancario',
    route: ':id',
    permission: Permission.UPDATE_BOLETO_BANCARIO,
  },
  findMany: {
    name: 'findMany',
    route: '/:bancoId',
    permission: Permission.VIEW_BOLETO_BANCARIO,
  },
  delete: {
    name: 'delete boleto bancario',
    route: ':id',
    permission: Permission.DELETE_BOLETO_BANCARIO,
  },
  envia: {
    name: 'envia boleto bancario',
    route: '/enviar/',
    permission: Permission.CREATE_BOLETO_BANCARIO,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

export class BaseParamsIdContaDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  contaId: number;
}

@Controller('boleto-bancario')
export class BoletoBancarioController {
  constructor(private readonly BoletoBancarioService: BoletoBancarioService) { }

  @Post(BOLETO_BANCARIO_ROUTES.create.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createBoletoBancarioDto: CreateBoletoBancarioDto) {
    return this.BoletoBancarioService.createBoletoBancario(createBoletoBancarioDto);
  }

  @Post(BOLETO_BANCARIO_ROUTES.envia.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.envia.permission)
  @FormDataRequest()
  envia(
    @Body() data: CreateBoletoBancarioDto,
  ) {
    return this.BoletoBancarioService.enviar(data);
  }

  @Put(BOLETO_BANCARIO_ROUTES.update.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateBoletoBancarioDto,
  ) {
    return this.BoletoBancarioService.updateBoletoBancario(Number(id), data);
  }


  @Delete(BOLETO_BANCARIO_ROUTES.delete.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.delete.permission)
  async deleteBoletoBancario(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.BoletoBancarioService.deleteBoletoBancario(Number(id));
  }

  @Get(BOLETO_BANCARIO_ROUTES.findMany.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.findMany.permission)
  async getBoletosBancarioConta(@Param() { contaId }: BaseParamsIdContaDto) {
    return await this.BoletoBancarioService.getBoletosBancarioConta(contaId);
  }

  @Get(BOLETO_BANCARIO_ROUTES.findById.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.findById.permission)
  async getBoletoBancario(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.BoletoBancarioService.getBoletoBancario(Number(id));
  }


}
