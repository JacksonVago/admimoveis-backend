import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseGetPaginatedQueryDateDto, BaseParamsIdEmpresaDto } from '@/common/interfaces/base-search';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { BoletoBancarioService } from "./boletobancario.service";

export class CreateBoletoBancarioDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  boletoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valor: number; //Valor do boleto

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorPago: number; //Valor pago no boleto

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

  @IsString()
  @IsOptional()
  txid: string;

  @IsString()
  @IsOptional()
  qrcode: string;

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
  email: string;

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

  @IsString()
  @IsOptional()
  tipoJurosCobCod: string;

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

  @IsString()
  @IsOptional()
  tipoMultaCobCod: string;

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

  @IsString()
  @IsOptional()
  tipoDescontoCobCod: string;

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

  @IsString()
  @IsOptional()
  tipoAutorizacaoCobCod: string;

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

  @IsString()
  @IsOptional()
  instrucaoCobCod1: string;

  @IsString()
  @IsOptional()
  instrucaoCobCod2: string;

  @IsString()
  @IsOptional()
  instrucaoCobCod3: string;

  @IsString()
  @IsOptional()
  instrucaoRecCod1: string;

  @IsString()
  @IsOptional()
  instrucaoRecCod2: string;

  @IsString()
  @IsOptional()
  instrucaoRecCod3: string;

  @IsString()
  @IsOptional()
  instrucaoRecCod4: string;

  @IsString()
  @IsOptional()
  carteiraCod: string;

  @IsString()
  @IsOptional()
  especieCod: string;

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
  findManyConta: {
    name: 'findManyConta',
    route: '/conta/:contaId',
    permission: Permission.VIEW_BOLETO_BANCARIO,
  },
  findManyEmpresa: {
    name: 'findManyEmpresa',
    route: '/empresa/:empresaId',
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
  download: {
    name: 'download boleto bancario',
    route: '/download/:id',
    permission: Permission.VIEW_BOLETO_BANCARIO,
  },
  boletoNossoNumero: {
    name: 'consulta boleto bancario nossonumero',
    route: '/nossonumero/:id',
    permission: Permission.UPDATE_BOLETO_BANCARIO,
  },
  baixar: {
    name: 'consulta boleto bancario nossonumero',
    route: '/baixar/:id',
    permission: Permission.DELETE_BOLETO_BANCARIO,
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
  constructor(private readonly boletoBancarioService: BoletoBancarioService) { }

  @Post(BOLETO_BANCARIO_ROUTES.create.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createBoletoBancarioDto: CreateBoletoBancarioDto) {
    return this.boletoBancarioService.createBoletoBancario(createBoletoBancarioDto);
  }

  @Post(BOLETO_BANCARIO_ROUTES.envia.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.envia.permission)
  @FormDataRequest()
  envia(
    @Body() data: CreateBoletoBancarioDto,
  ) {
    return this.boletoBancarioService.EnviaBoletoBanco(data);
  }

  @Put(BOLETO_BANCARIO_ROUTES.update.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateBoletoBancarioDto,
  ) {
    return this.boletoBancarioService.updateBoletoBancario(Number(id), data);
  }


  @Delete(BOLETO_BANCARIO_ROUTES.delete.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.delete.permission)
  async deleteBoletoBancario(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.boletoBancarioService.deleteBoletoBancario(Number(id));
  }

  @Get(BOLETO_BANCARIO_ROUTES.findManyConta.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.findManyConta.permission)
  async getBoletosBancarioConta(@Param() { contaId }: BaseParamsIdContaDto) {
    return await this.boletoBancarioService.getBoletosBancarioConta(contaId);
  }

  @Get(BOLETO_BANCARIO_ROUTES.findManyEmpresa.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.findManyEmpresa.permission)
  async getBoletosBancarioEmpresa(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: BaseGetPaginatedQueryDateDto) {
    const { search, page, limit, tipo, exclude, dataInicial, dataFinal } = data;
    return await this.boletoBancarioService.getBoletosBancarioEmpresa(empresaId, search, page, limit, tipo, exclude, dataInicial, dataFinal);
  }
  @Get(BOLETO_BANCARIO_ROUTES.findById.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.findById.permission)
  async getBoletoBancario(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.boletoBancarioService.getBoletoBancario(Number(id));
  }

  @Get(BOLETO_BANCARIO_ROUTES.download.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.download.permission)
  async getDownloadBancario(@Param() { id }: BaseParamsByStringIdDto) {
    const result = await this.boletoBancarioService.DownloadBoletoBanco(Number(id));
    //console.log('Controller: ', result);
    return result;
    /*this.boletoBancarioService.DownloadBancario(Number(id)).
      then((result) => {
        console.log('Controller: ', result);
        return result;

      });*/
  }

  @Get(BOLETO_BANCARIO_ROUTES.boletoNossoNumero.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.boletoNossoNumero.permission)
  async getBoletoNossoNumero(@Param() { id }: BaseParamsByStringIdDto) {
    const result = await this.boletoBancarioService.ConsultaBoletoBanco(Number(id));
    return result;
  }

  @Patch(BOLETO_BANCARIO_ROUTES.baixar.route)
  @Permissions(BOLETO_BANCARIO_ROUTES.baixar.permission)
  async patchBaixarBoleto(@Param() { id }: BaseParamsByStringIdDto) {
    const result = await this.boletoBancarioService.BaixaBoletoBanco(Number(id));
    return result;
  }

}
