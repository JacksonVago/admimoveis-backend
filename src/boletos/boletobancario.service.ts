import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BoletoBancario, Prisma } from '@prisma/client';
import { CreateBoletoBancarioDto } from './boletobancario.controller';
import { BoletoWebService } from './boletoweb.service';

@Injectable()
export class BoletoBancarioService {
  constructor(private prismaService: PrismaService,
    private readonly boletoWeb: BoletoWebService,
  ) { }


  async createBoletoBancario(createBoletoBancarioDto: CreateBoletoBancarioDto) {
    return await this.prismaService.boletoBancario.create({
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
        txid: createBoletoBancarioDto.txid,
        qrcode: createBoletoBancarioDto.qrcode,

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
    return await this.prismaService.boletoBancario.update({
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
        txid: data.txid,
        qrcode: data.qrcode,

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
    return await this.prismaService.boletoBancario.findUnique({
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
    return await this.prismaService.boletoBancario.findMany({
      where: {
        contaId,
      },
      include: {
        contacorrente: true,
        boleto: true,
      },
    });
  }

  async getBoletosBancarioEmpresa(
    empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    tipoImovel: number | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<BoletoBancario>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    let dataFim: Date = dataFinal;
    dataFim.setDate(dataFinal.getDate() + 1);

    console.log("Data ", dataInicial);
    const where: Prisma.BoletoBancarioWhereInput = {
      OR: [
        {
          linhaDigitavel: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          codigoBarras: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          nossoNumero: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          status: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          boleto: {
            imovel: {
              proprietarios: {
                some: {
                  pessoa: {
                    nome: {
                      contains: search,
                      mode: 'insensitive'
                    }
                  }
                }
              }
            },
            locacao: {
              locatarios: {
                some: {
                  pessoa: {
                    nome: {
                      contains: search,
                      mode: 'insensitive',
                    }
                  }
                }
              },
            }
          },
        },
      ],
      //Quando quiser excluir id´s
      AND: [
        (exclude === null ? {} : { id: { notIn: arr_id } }),
        empresaId ? { boleto: { empresaId: empresaId } } : {},
        {
          dataVencimento: {
            gte: dataInicial,
            lte: dataFim
          }
        }
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.boletoBancario.findMany({
        where,
        include: {
          boleto: {
            include: {
              imovel: {
                include: {
                  proprietarios: {
                    include: {
                      pessoa: true,
                    }
                  },
                  endereco: true,
                  condominio: true
                }
              },
              locacao: {
                include: {
                  locatarios: {
                    include: {
                      pessoa: true,
                    }
                  },
                  imovel: {
                    include: {
                      endereco: true,
                    }
                  }
                }
              }

            }
          },
          contacorrente: {
            include: {
              banco: true,
            }
          }
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.boletoBancario.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data?.length, //current position in the list e.g. 10 of 100
      totalPages,
    };
  }


  async deleteBoletoBancario(id: number) {
    return await this.prismaService.boletoBancario.delete({
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
    const conta = await this.prismaService.contaCorrente.findUnique({
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

    //Atualiza dados do boleto original
    const boletoUpdate = await this.prismaService.boleto.update({
      data: {
        //status: BoletoStatus.CONFIRMADO,
        contaCorrente: { connect: { id: conta.id } },
      },
      where: {
        id: boleto.boletoId,
      },
    })

    if (boletoUpdate) {
      const bolBancario = await this.prismaService.boletoBancario.create(
        {
          data: {
            boleto: { connect: { id: boletoUpdate.id } },
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
            observacao: boleto.observacao,
            pagtoParcial: conta.pagtoParcial ? conta.pagtoParcial : false,
            qtdeMaxParcial: conta.qtdeMaxParcial ? conta.qtdeMaxParcial : 0,
            formaEnvio: conta.formaEnvio ? conta.formaEnvio : '',
            assuntoEmail: conta.assuntoEmail ? conta.assuntoEmail : '',
            mensagemEmail1: conta.mensagemEmail1 ? conta.mensagemEmail1 : '',
            mensagemEmail2: conta.mensagemEmail2 ? conta.mensagemEmail2 : '',
            mensagemEmail3: conta.mensagemEmail3 ? conta.mensagemEmail3 : '',
            tipoJurosCobCod: conta.tipoJurosCob.codigo ? conta.tipoJurosCob.codigo : '',
            valorJuros: conta.valorJuros ? conta.valorJuros : 0,
            percJuros: conta.percJuros ? conta.percJuros : 0,
            diasInicioJuros: conta.diasInicioJuros ? conta.diasInicioJuros : 0,
            tipoMultaCobCod: conta.tipoMultaCob ? conta.tipoMultaCob.codigo : '',
            valorMulta: conta.valorMulta ? conta.valorMulta : 0,
            percMulta: conta.percMulta ? conta.percMulta : 0,
            diasInicioMulta: conta.diasInicioMulta ? conta.diasInicioMulta : 0,
            tipoDescontoCobCod: conta.tipoDescontoCob ? conta.tipoDescontoCob.codigo : '',
            valorDesconto: conta.valorDesconto ? conta.valorDesconto : 0,
            percDesconto: conta.percDesconto ? conta.percDesconto : 0,
            diasInicioDesconto: conta.diasInicioDesconto ? conta.diasInicioDesconto : 0,
            tipoAutorizacaoCobCod: conta.tipoAutorizacaoCob ? conta.tipoAutorizacaoCob.codigo : '',
            tipoRecebimentoDiv: conta.tipoRecebimentoDiv ? conta.tipoRecebimentoDiv : '',
            valorMinDiverg: conta.valorMinDiverg ? conta.valorMinDiverg : 0,
            valorMaxDiverg: conta.valorMaxDiverg ? conta.valorMaxDiverg : 0,
            percMinDiverg: conta.percMinDiverg ? conta.percMinDiverg : 0,
            percMaxDiverg: conta.percMaxDiverg ? conta.percMaxDiverg : 0,
            protestar: conta.protestar ? conta.protestar : false,
            qtdeDiasProtesto: conta.qtdeDiasProtesto ? conta.qtdeDiasProtesto : 0,
            negativar: conta.negativar ? conta.negativar : false,
            qtdeDiasNegativar: conta.qtdeDiasNegativar ? conta.qtdeDiasNegativar : 0,
            instrucaoCobCod1: conta.instrucaoCob1 ? conta.instrucaoCob1.codigo.toString() : undefined,
            instrucaoCobCod2: conta.instrucaoCob2 ? conta.instrucaoCob2.codigo.toString() : undefined,
            instrucaoCobCod3: conta.instrucaoCob3 ? conta.instrucaoCob3.codigo.toString() : undefined,
            instrucaoRecCod1: conta.instrucaoRec1 ? conta.instrucaoRec1.codigo.toString() : undefined,
            instrucaoRecCod2: conta.instrucaoRec2 ? conta.instrucaoRec2.codigo.toString() : undefined,
            instrucaoRecCod3: conta.instrucaoRec3 ? conta.instrucaoRec3.codigo.toString() : undefined,
            instrucaoRecCod4: conta.instrucaoRec4 ? conta.instrucaoRec4.codigo.toString() : undefined,
            carteiraCod: conta.carteira ? conta.carteira.carteira.toString() : undefined,
            especieCod: conta.especie ? conta.especie.sigla.toString() : undefined,
            contacorrente: { connect: { id: conta.id } },
          }

        }
      );

      //Envia dados ao banco
      const banco = "RegistraBoleto" + conta.banco.codigo;
      const msg = this.boletoWeb[banco as keyof typeof BoletoWebService](bolBancario.id);
      console.log('retorno: ', msg)
    }
    else {
      throw new BadRequestException('Problemas na atualiza do boleo.');
    }


  }

  async DownloadBoletoBanco(boletoId: number) {
    const boleto = await this.prismaService.boletoBancario.findUnique({
      where: {
        id: boletoId
      },
      include: {
        contacorrente: true,
      }
    });

    if (!boleto) {
      throw new BadRequestException('Boleto not found');
    }

    //Envia boleto ao banco
    const conta = await this.prismaService.contaCorrente.findUnique({
      where: {
        id: boleto.contaId
      },
      include: {
        banco: true,
      }
    })

    if (!conta) {
      throw new BadRequestException('Conta not found');
    }

    if (boleto) {
      //Solicita download do boleto
      const banco = "DownloadBoleto" + conta.banco.codigo;
      const msg = await this.boletoWeb[banco as keyof typeof BoletoWebService](boletoId);
      //console.log('retorno: ', msg)
      return msg;
    }

  }

  async BaixaBoletoBanco(boletoId: number) {
    const boleto = await this.prismaService.boletoBancario.findUnique({
      where: {
        id: boletoId
      },
      include: {
        contacorrente: true,
      }
    });

    if (!boleto) {
      throw new BadRequestException('Boleto not found');
    }

    //Envia boleto ao banco
    const conta = await this.prismaService.contaCorrente.findUnique({
      where: {
        id: boleto.contaId
      },
      include: {
        banco: true,
      }
    })

    if (!conta) {
      throw new BadRequestException('Conta not found');
    }

    if (boleto) {
      //Solicita download do boleto
      const banco = "BaixaBoleto" + conta.banco.codigo;
      const msg = await this.boletoWeb[banco as keyof typeof BoletoWebService](boletoId);
      //console.log('retorno: ', msg)
      return msg;
    }

  }
  async ConsultaBoletoBanco(boletoId: number) {
    const boleto = await this.prismaService.boletoBancario.findUnique({
      where: {
        id: boletoId
      },
      include: {
        contacorrente: true,
      }
    });

    if (!boleto) {
      throw new BadRequestException('Boleto not found');
    }

    //Envia boleto ao banco
    const conta = await this.prismaService.contaCorrente.findUnique({
      where: {
        id: boleto.contaId
      },
      include: {
        banco: true,
      }
    })

    if (!conta) {
      throw new BadRequestException('Conta not found');
    }

    if (boleto) {
      //Solicita download do boleto
      const banco = "ConsultaBoleto" + conta.banco.codigo;
      const msg = await this.boletoWeb[banco as keyof typeof BoletoWebService](boletoId);
      //console.log('retorno: ', msg)
      return msg;
    }

  }
}
