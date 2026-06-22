import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBoletoBancarioDto } from './boletobancario.controller';
import { BoletoWebService } from './boletoweb.service';

@Injectable()
export class BoletoBancarioService {
  constructor(private PrismaService: PrismaService,
    private readonly boletoWeb: BoletoWebService,
  ) { }


  async createBoletoBancario(createBoletoBancarioDto: CreateBoletoBancarioDto) {
    return await this.PrismaService.boletoBancario.create({
      data: {
        boleto: createBoletoBancarioDto.boletoId ? { connect: { id: createBoletoBancarioDto.boletoId } } : undefined,
        valor: createBoletoBancarioDto.valor, //Valor do boleto
        valorPago: createBoletoBancarioDto.valorPago, //Valor pago no boleto
        dataBoleto: createBoletoBancarioDto.dataBoleto, //Emissao do boleto
        dataVencimento: createBoletoBancarioDto.dataVencimento, //Vencimento do boleto
        dataPagamento: createBoletoBancarioDto.dataPagamento, //Data de pagamento do boleto
        formaPix: createBoletoBancarioDto.formaPix, //Forma de pagamento PIX para recebimento
        codigoBarras: createBoletoBancarioDto.codigoBarras,
        linhaDigitavel: createBoletoBancarioDto.linhaDigitavel,
        nossoNumero: createBoletoBancarioDto.nossoNumero,
        urlBoleto: createBoletoBancarioDto.urlBoleto, //URL para visualização do boleto
        registrado: createBoletoBancarioDto.registrado, //S/N Informa se ocorreu o registro do boleto
        emvPIX: createBoletoBancarioDto.emvPIX, //Código EMV para pagamento via PIX
        metodoPagamento: createBoletoBancarioDto.metodoPagamento, //Método de pagamento utilizado
        status: createBoletoBancarioDto.status, //Status do boleto
        observacao: createBoletoBancarioDto.observacao,

        pagtoParcial: createBoletoBancarioDto.pagtoParcial, //Indica se o alerta está ativo ou não
        qtdeMaxParcial: createBoletoBancarioDto.qtdeMaxParcial, //Quantide de pagamentos parcial 1..99
        formaEnvio: createBoletoBancarioDto.formaEnvio,
        email: createBoletoBancarioDto.email,
        assuntoEmail: createBoletoBancarioDto.assuntoEmail,
        mensagemEmail1: createBoletoBancarioDto.mensagemEmail1,
        mensagemEmail2: createBoletoBancarioDto.mensagemEmail2,
        mensagemEmail3: createBoletoBancarioDto.mensagemEmail3,

        tipoJurosCobCod: createBoletoBancarioDto.tipoJurosCobCod,
        valorJuros: createBoletoBancarioDto.valorJuros,
        percJuros: createBoletoBancarioDto.percJuros,
        diasInicioJuros: createBoletoBancarioDto.diasInicioJuros,

        tipoMultaCobCod: createBoletoBancarioDto.tipoMultaCobCod,
        valorMulta: createBoletoBancarioDto.valorMulta,
        percMulta: createBoletoBancarioDto.percMulta,
        diasInicioMulta: createBoletoBancarioDto.diasInicioMulta,

        tipoDescontoCobCod: createBoletoBancarioDto.tipoDescontoCobCod,
        valorDesconto: createBoletoBancarioDto.valorDesconto,
        percDesconto: createBoletoBancarioDto.percDesconto,
        diasInicioDesconto: createBoletoBancarioDto.diasInicioDesconto,

        tipoAutorizacaoCobCod: createBoletoBancarioDto.tipoAutorizacaoCobCod,
        tipoRecebimentoDiv: createBoletoBancarioDto.tipoRecebimentoDiv,
        valorMinDiverg: createBoletoBancarioDto.valorMinDiverg,
        valorMaxDiverg: createBoletoBancarioDto.valorMaxDiverg,
        percMinDiverg: createBoletoBancarioDto.percMinDiverg,
        percMaxDiverg: createBoletoBancarioDto.percMaxDiverg,

        protestar: createBoletoBancarioDto.protestar,
        qtdeDiasProtesto: createBoletoBancarioDto.qtdeDiasProtesto,
        negativar: createBoletoBancarioDto.negativar,
        qtdeDiasNegativar: createBoletoBancarioDto.qtdeDiasNegativar,

        instrucaoCobCod1: createBoletoBancarioDto.instrucaoCobCod1,
        instrucaoCobCod2: createBoletoBancarioDto.instrucaoCobCod2,
        instrucaoCobCod3: createBoletoBancarioDto.instrucaoCobCod3,

        instrucaoRecCod1: createBoletoBancarioDto.instrucaoRecCod1,
        instrucaoRecCod2: createBoletoBancarioDto.instrucaoRecCod2,
        instrucaoRecCod3: createBoletoBancarioDto.instrucaoRecCod3,
        instrucaoRecCod4: createBoletoBancarioDto.instrucaoRecCod4,

        carteiraCod: createBoletoBancarioDto.carteiraCod,
        especieCod: createBoletoBancarioDto.especieCod,

        contacorrente: createBoletoBancarioDto.contaId ? { connect: { id: createBoletoBancarioDto.contaId } } : undefined,
      },
      include: {
        contacorrente: true,
        boleto: true,
      },
    });
  }

  async updateBoletoBancario(id: number, data: CreateBoletoBancarioDto) {
    return await this.PrismaService.boletoBancario.update({
      where: {
        id,
      },
      data: {
        boleto: data.boletoId ? { connect: { id: data.boletoId } } : undefined,
        valor: data.valor, //Valor do boleto
        valorPago: data.valorPago, //Valor pago no boleto
        dataBoleto: data.dataBoleto, //Emissao do boleto
        dataVencimento: data.dataVencimento, //Vencimento do boleto
        dataPagamento: data.dataPagamento, //Data de pagamento do boleto
        formaPix: data.formaPix, //Forma de pagamento PIX para recebimento
        codigoBarras: data.codigoBarras,
        linhaDigitavel: data.linhaDigitavel,
        nossoNumero: data.nossoNumero,
        urlBoleto: data.urlBoleto, //URL para visualização do boleto
        registrado: data.registrado, //S/N Informa se ocorreu o registro do boleto
        emvPIX: data.emvPIX, //Código EMV para pagamento via PIX
        metodoPagamento: data.metodoPagamento, //Método de pagamento utilizado
        status: data.status, //Status do boleto
        observacao: data.observacao,

        pagtoParcial: data.pagtoParcial, //Indica se o alerta está ativo ou não
        qtdeMaxParcial: data.qtdeMaxParcial, //Quantide de pagamentos parcial 1..99
        formaEnvio: data.formaEnvio,
        email: data.email,
        assuntoEmail: data.assuntoEmail,
        mensagemEmail1: data.mensagemEmail1,
        mensagemEmail2: data.mensagemEmail2,
        mensagemEmail3: data.mensagemEmail3,

        tipoJurosCobCod: data.tipoJurosCobCod,
        valorJuros: data.valorJuros,
        percJuros: data.percJuros,
        diasInicioJuros: data.diasInicioJuros,

        tipoMultaCobCod: data.tipoMultaCobCod,
        valorMulta: data.valorMulta,
        percMulta: data.percMulta,
        diasInicioMulta: data.diasInicioMulta,

        tipoDescontoCobCod: data.tipoDescontoCobCod,
        valorDesconto: data.valorDesconto,
        percDesconto: data.percDesconto,
        diasInicioDesconto: data.diasInicioDesconto,

        tipoAutorizacaoCobCod: data.tipoAutorizacaoCobCod,
        tipoRecebimentoDiv: data.tipoRecebimentoDiv,
        valorMinDiverg: data.valorMinDiverg,
        valorMaxDiverg: data.valorMaxDiverg,
        percMinDiverg: data.percMinDiverg,
        percMaxDiverg: data.percMaxDiverg,

        protestar: data.protestar,
        qtdeDiasProtesto: data.qtdeDiasProtesto,
        negativar: data.negativar,
        qtdeDiasNegativar: data.qtdeDiasNegativar,

        instrucaoCobCod1: data.instrucaoCobCod1,
        instrucaoCobCod2: data.instrucaoCobCod2,
        instrucaoCobCod3: data.instrucaoCobCod3,

        instrucaoRecCod1: data.instrucaoRecCod1,
        instrucaoRecCod2: data.instrucaoRecCod2,
        instrucaoRecCod3: data.instrucaoRecCod3,
        instrucaoRecCod4: data.instrucaoRecCod4,

        carteiraCod: data.carteiraCod,
        especieCod: data.especieCod,
        contacorrente: data.contaId ? { connect: { id: data.contaId } } : undefined,
      },
      include: {
        contacorrente: true,
        boleto: true,
      },
    });
  }

  async getBoletoBancario(id: number) {
    return await this.PrismaService.boletoBancario.findUnique({
      where: {
        id,
      },
      include: {
        contacorrente: true,
        boleto: true,
      },
    });
  }

  async getBoletosBancarioConta(contaId: number) {
    return await this.PrismaService.boletoBancario.findMany({
      where: {
        contaId,
      },
      include: {
        contacorrente: true,
        boleto: true,
      },
    });
  }


  async deleteBoletoBancario(id: number) {
    return await this.PrismaService.boletoBancario.delete({
      where: {
        id,
      }
    });
  }

  async EnviaBoletoBanco(boleto: CreateBoletoBancarioDto) {
    /*const boleto = await this.PrismaService.boleto.findUnique({
      where: {
        id: boletoId
      }
    });

    if (!boleto) {
      throw new BadRequestException('Boleto not found');
    }*/

    //Envia boleto ao banco
    const conta = await this.PrismaService.contaCorrente.findUnique({
      where: {
        id: boleto.contaId
      },
      include: {
        banco: true,
        tipoAutorizacaoCob: true,
        tipoDescontoCob: true,
        tipoJurosCob: true,
        tipoMultaCob: true,
        instrucaoCob1: true,
        instrucaoCob2: true,
        instrucaoCob3: true,
        instrucaoRec1: true,
        instrucaoRec2: true,
        instrucaoRec3: true,
        instrucaoRec4: true,
        carteira: true,
        especie: true,
      }
    })

    if (!conta) {
      throw new BadRequestException('Conta not found');
    }

    const bolBancario = await this.PrismaService.boletoBancario.create(
      {
        data: {
          boleto: { connect: { id: boleto.boletoId } },
          valor: boleto.valor,
          valorPago: 0,
          dataBoleto: new Date(),
          dataVencimento: boleto.dataVencimento, //Vencimento do boleto
          dataPagamento: boleto.dataPagamento,
          formaPix: '',
          codigoBarras: '',
          linhaDigitavel: '',
          nossoNumero: boleto.boletoId.toString(),
          urlBoleto: '',
          registrado: 'N',
          emvPIX: '',
          metodoPagamento: '',
          status: '',
          observacao: '',
          pagtoParcial: conta.pagtoParcial,
          qtdeMaxParcial: conta.qtdeMaxParcial,
          formaEnvio: conta.formaEnvio,
          assuntoEmail: conta.assuntoEmail,
          mensagemEmail1: conta.mensagemEmail1,
          mensagemEmail2: conta.mensagemEmail2,
          mensagemEmail3: conta.mensagemEmail3,
          tipoJurosCobCod: conta.tipoJurosCob.codigo,
          valorJuros: conta.valorJuros,
          percJuros: conta.percJuros,
          diasInicioJuros: conta.diasInicioJuros,
          tipoMultaCobCod: conta.tipoMultaCob.codigo,
          valorMulta: conta.valorMulta,
          percMulta: conta.percMulta,
          diasInicioMulta: conta.diasInicioMulta,
          tipoDescontoCobCod: conta.tipoDescontoCob.codigo,
          valorDesconto: conta.valorDesconto,
          percDesconto: conta.percDesconto,
          diasInicioDesconto: conta.diasInicioDesconto,
          tipoAutorizacaoCobCod: conta.tipoAutorizacaoCob.codigo,
          tipoRecebimentoDiv: conta.tipoRecebimentoDiv,
          valorMinDiverg: conta.valorMinDiverg,
          valorMaxDiverg: conta.valorMaxDiverg,
          percMinDiverg: conta.percMinDiverg,
          percMaxDiverg: conta.percMaxDiverg,
          protestar: conta.protestar,
          qtdeDiasProtesto: conta.qtdeDiasProtesto,
          negativar: conta.negativar,
          qtdeDiasNegativar: conta.qtdeDiasNegativar,
          instrucaoCobCod1: conta.instrucaoCob1.codigo.toString(),
          instrucaoCobCod2: conta.instrucaoCob2.codigo.toString(),
          instrucaoCobCod3: conta.instrucaoCob3.codigo.toString(),
          instrucaoRecCod1: conta.instrucaoRec1.codigo.toString(),
          instrucaoRecCod2: conta.instrucaoRec2.codigo.toString(),
          instrucaoRecCod3: conta.instrucaoRec3.codigo.toString(),
          instrucaoRecCod4: conta.instrucaoRec4.codigo.toString(),
          carteiraCod: conta.carteira.carteira.toString(),
          especieCod: conta.especie.codigo.toString(),
          contacorrente: { connect: { id: conta.id } },
        }

      }
    );

    //Envia dados ao banco
    const banco = "RegistraBoleto" + conta.banco.codigo;
    const msg = this.boletoWeb[banco as keyof typeof BoletoWebService](bolBancario);
    console.log('retorno: ', msg)


  }

}
