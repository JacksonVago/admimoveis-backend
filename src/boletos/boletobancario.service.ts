import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateBoletoBancarioDto } from './boletobancario.controller';
import { BoletoWebService } from './boletoweb';

@Injectable()
export class BoletoBancarioService {
  constructor(private PrismaService: PrismaService) { }


  async createBoletoBancario(createBoletoBancarioDto: CreateBoletoBancarioDto) {
    const { codigo, bancoId } = createBoletoBancarioDto;
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
        assuntoEmail: createBoletoBancarioDto.assuntoEmail,
        mensagemEmail1: createBoletoBancarioDto.mensagemEmail1,
        mensagemEmail2: createBoletoBancarioDto.mensagemEmail2,
        mensagemEmail3: createBoletoBancarioDto.mensagemEmail3,

        tipoJurosCobId: createBoletoBancarioDto.tipoJurosCobId,
        valorJuros: createBoletoBancarioDto.valorJuros,
        percJuros: createBoletoBancarioDto.percJuros,
        diasInicioJuros: createBoletoBancarioDto.diasInicioJuros,

        tipoMultaCobId: createBoletoBancarioDto.tipoMultaCobId,
        valorMulta: createBoletoBancarioDto.valorMulta,
        percMulta: createBoletoBancarioDto.percMulta,
        diasInicioMulta: createBoletoBancarioDto.diasInicioMulta,

        tipoDescontoCobId: createBoletoBancarioDto.tipoDescontoCobId,
        valorDesconto: createBoletoBancarioDto.valorDesconto,
        percDesconto: createBoletoBancarioDto.percDesconto,
        diasInicioDesconto: createBoletoBancarioDto.diasInicioDesconto,

        tipoAutorizacaoCobId: createBoletoBancarioDto.tipoAutorizacaoCobId,
        tipoRecebimentoDiv: createBoletoBancarioDto.tipoRecebimentoDiv,
        valorMinDiverg: createBoletoBancarioDto.valorMinDiverg,
        valorMaxDiverg: createBoletoBancarioDto.valorMaxDiverg,
        percMinDiverg: createBoletoBancarioDto.percMinDiverg,
        percMaxDiverg: createBoletoBancarioDto.percMaxDiverg,

        protestar: createBoletoBancarioDto.protestar,
        qtdeDiasProtesto: createBoletoBancarioDto.qtdeDiasProtesto,
        negativar: createBoletoBancarioDto.negativar,
        qtdeDiasNegativar: createBoletoBancarioDto.qtdeDiasNegativar,

        instrucaoCobId1: createBoletoBancarioDto.instrucaoCobId1,
        instrucaoCobId2: createBoletoBancarioDto.instrucaoCobId2,
        instrucaoCobId3: createBoletoBancarioDto.instrucaoCobId3,

        instrucaoRecId1: createBoletoBancarioDto.instrucaoRecId1,
        instrucaoRecId2: createBoletoBancarioDto.instrucaoRecId2,
        instrucaoRecId3: createBoletoBancarioDto.instrucaoRecId3,
        instrucaoRecId4: createBoletoBancarioDto.instrucaoRecId4,

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
        assuntoEmail: data.assuntoEmail,
        mensagemEmail1: data.mensagemEmail1,
        mensagemEmail2: data.mensagemEmail2,
        mensagemEmail3: data.mensagemEmail3,

        tipoJurosCobId: data.tipoJurosCobId,
        valorJuros: data.valorJuros,
        percJuros: data.percJuros,
        diasInicioJuros: data.diasInicioJuros,

        tipoMultaCobId: data.tipoMultaCobId,
        valorMulta: data.valorMulta,
        percMulta: data.percMulta,
        diasInicioMulta: data.diasInicioMulta,

        tipoDescontoCobId: data.tipoDescontoCobId,
        valorDesconto: data.valorDesconto,
        percDesconto: data.percDesconto,
        diasInicioDesconto: data.diasInicioDesconto,

        tipoAutorizacaoCobId: data.tipoAutorizacaoCobId,
        tipoRecebimentoDiv: data.tipoRecebimentoDiv,
        valorMinDiverg: data.valorMinDiverg,
        valorMaxDiverg: data.valorMaxDiverg,
        percMinDiverg: data.percMinDiverg,
        percMaxDiverg: data.percMaxDiverg,

        protestar: data.protestar,
        qtdeDiasProtesto: data.qtdeDiasProtesto,
        negativar: data.negativar,
        qtdeDiasNegativar: data.qtdeDiasNegativar,

        instrucaoCobId1: data.instrucaoCobId1,
        instrucaoCobId2: data.instrucaoCobId2,
        instrucaoCobId3: data.instrucaoCobId3,

        instrucaoRecId1: data.instrucaoRecId1,
        instrucaoRecId2: data.instrucaoRecId2,
        instrucaoRecId3: data.instrucaoRecId3,
        instrucaoRecId4: data.instrucaoRecId4,

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

  async enviar(boletoBancario: CreateBoletoBancarioDto) {

    const boleto = await this.PrismaService.boleto.findUnique(
      {
        where: {
          id: boletoBancario.boletoId
        },
        include: {
          contaCorrente: true,
        }
      }
    );

    if (boleto) {
      const banco = await this.PrismaService.banco.findUnique(
        {
          where: {
            id: boleto.contaCorrente.bancoId
          }
        });


      //Verificar qual banco 
      const methodRegistra = "RegistraBoleto" + banco.codigo.toString();
      const retornoBanco = BoletoWebService[methodRegistra as keyof BoletoWebService](boletoBancario, boleto.contaCorrente);
      console.log(retornoBanco);
    }
  }
}
