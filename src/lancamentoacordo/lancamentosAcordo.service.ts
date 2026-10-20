import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { LancamentoAcordo, lancamentoStatus, Locacao, LocacaoStatus, Prisma } from '@prisma/client';
import { CreateLancamentoDto } from './lancamentosAcordo.controller';

@Injectable()
export class LancamentosAcordosService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createLancamentoDto: CreateLancamentoDto) {

    if (createLancamentoDto.boletobancarioId) {
      const boletobancario = await this.prismaService.boletoBancario.findUnique({
        where: {
          id: createLancamentoDto.boletobancarioId,
          status: LocacaoStatus.ATIVA,
        },
      });

      if (!boletobancario) {
        throw new BadRequestException('Boleto bancário não encontrado');
      }
    }

    const result = await this.prismaService.lancamentoAcordo.create({
      data: {
        descricao: createLancamentoDto.descricao,
        valorOriginal: createLancamentoDto.valorOriginal,
        juros: createLancamentoDto.juros,
        multa: createLancamentoDto.multa,
        desconto: createLancamentoDto.desconto,
        dataLancamento: createLancamentoDto.dataLancamento,
        acordo: { connect: { id: createLancamentoDto.acordoId } },
        boletoBancario: (createLancamentoDto.boletobancarioId ? { connect: { id: createLancamentoDto.boletobancarioId } } : undefined),

      },
      include: {
        boletoBancario: true,
      },
    });

    return result;
  }

  /*async createPagamento(gerarPagamentoDto: gerarBoletoDto) {

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let dataVencimento = currentYear + '-' + (currentMonth + 1).toString().padStart(2, '0') + '-' + gerarPagamentoDto.diaVencimento.toString().padStart(2, '0');

    const locacao = await this.prismaService.locacao.findUnique({
      where: {
        id: gerarPagamentoDto.id,
        status: LocacaoStatus.ATIVA,
      },
    });

    if (!locacao) {
      throw new BadRequestException('Locacao not found');
    }

    //Monta dados do pagamento/boleto
    const resultPag = await this.prismaService.boleto.create({
      data: {
        status: BoletoStatus.PENDENTE,
        valorOriginal: gerarPagamentoDto.lancamentos.reduce((sum, lancamento) => sum + lancamento.valorLancamento, 0) + gerarPagamentoDto.valorAluguel,
        valorPago: null,
        dataEmissao: new Date(),
        dataVencimento: (gerarPagamentoDto.lancamentos && gerarPagamentoDto.lancamentos.length > 0) ? gerarPagamentoDto.lancamentos[0].vencimentoLancamento : new Date(dataVencimento),
        dataPagamento: null,
        observacao: gerarPagamentoDto.lancamentos && gerarPagamentoDto.lancamentos.length > 0 ? gerarPagamentoDto.lancamentos.map(lancamento => lancamento.observacao).join('; ') : '',
        locacao: { connect: { id: gerarPagamentoDto.id } },
        empresa: { connect: { id: gerarPagamentoDto.empresaId } },
        locatario: {
          connect: { id: gerarPagamentoDto.locatarios[0].id },
        },
        lanctoLocacao: {
          connect: gerarPagamentoDto.lancamentos.map(lancamento => ({ id: lancamento.id })),
        },
      },
      include: {
        locacao: true,
        locatario: true,
        lanctoLocacao: true,
      },
    });


    //Atualiza os lançamentos vinculando o pagamento
    const result = await this.prismaService.lancamentoLocacao.updateMany({
      where: {
        id: {
          in: gerarPagamentoDto.lancamentos.map(lancamento => lancamento.id),
        },
      },
      data: {
        status: lancamentoStatus.CONFIRMADO,
      },
    });

    //Gera os novos lançamentos automáticos ou se houver parcelas
    gerarPagamentoDto.lancamentos.forEach(async (lancamento) => {
      if (lancamento.parcela < lancamento.lancamentotipo.parcelas || (lancamento.lancamentotipo.automatico === 'S' && lancamento.lancamentotipo.parcelas === 0)) {
        const novaParcela = lancamento.lancamentotipo.parcelas > 0 ? lancamento.parcela + 1 : 1;
        const novaDataLancamento = new Date();
        const novoVencimentoLancamento = new Date(lancamento.vencimentoLancamento);
        novoVencimentoLancamento.setMonth(novoVencimentoLancamento.getMonth() + 1);
        const observacao = lancamento.lancamentotipo.parcelas > 0 ? 'Parcela ' + (lancamento.parcela + 1).toString() + '/' + lancamento.lancamentotipo.parcelas.toString() : "Lançamento automático";

        await this.prismaService.lancamentoLocacao.create({
          data: {
            parcela: novaParcela,
            tipoId: lancamento.tipoId,
            valorLancamento: lancamento.valorLancamento,
            dataLancamento: novaDataLancamento,
            vencimentoLancamento: novoVencimentoLancamento,
            observacao: lancamento.observacao ? lancamento.observacao : observacao,
            status: lancamentoStatus.ABERTO,
            locacaoId: gerarPagamentoDto.id
          },
        });
      }
    });

    return result;
  }*/

  async findById(id: number) {
    return await this.prismaService.lancamentoAcordo.findUnique({
      where: {
        id: id,
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    exclude: string | null,
  ): Promise<BasePaginationData<LancamentoAcordo>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    const where: Prisma.LancamentoAcordoWhereInput = {
      OR: [
        {
          descricao: {
            contains: search,
            mode: 'insensitive'
          },
        },
      ],
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.lancamentoAcordo.findMany({
        where,
        include: {
          boletoBancario: true,
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.lancamentoAcordo.count({ where }),
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

  async findManyLocacao(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    statusLancamento: lancamentoStatus | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<Locacao>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (statusLancamento !== undefined) {
      if (statusLancamento.toString() === 'undefined') {
        statusLancamento = undefined;
      }
    }

    let dataFim: Date = dataFinal;
    dataFim.setDate(dataFinal.getDate() + 1);

    const where: Prisma.LocacaoWhereInput = {
      OR: [
        {
          lancamentos: {
            some: {
              observacao: {
                contains: search,
                mode: 'insensitive'
              },
            }
          }
        },
        {
          imovel: {
            description: {
              contains: search,
              mode: 'insensitive'
            },
          },
        },
        {
          imovel: {
            endereco: {
              logradouro: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
        },
        {
          imovel: {
            endereco: {
              complemento: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
        },
        {
          locatarios: {
            some: {
              pessoa: {
                nome: {
                  contains: search,
                  mode: 'insensitive',
                },
              }

            }
          },
        },
        {
          locatarios: {
            some: {
              pessoa: {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              }

            }
          },
        }
      ],
      AND: [
        {
          status: {
            equals: LocacaoStatus.ATIVA
          }
        },
        /*{
          lancamentos:
          {
            every: {
              dataLancamento: {
                gte: dataInicial,
                lte: dataFim
              }
            },
          }
        },
        {
          lancamentos:
          {
            none: {
              dataLancamento: {
                gte: dataInicial,
                lte: dataFim
              }
            },
          }
        }*/
        empresaId ? { empresaId: empresaId } : {},
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.locacao.findMany({
        where,
        include: {
          locatarios: {
            include: {
              pessoa: {
                include: {
                  endereco: true
                }
              }
            }
          },
          imovel: {
            include: {
              endereco: true,
            }
          },
          lancamentos: {
            where: {
              vencimentoLancamento: {
                gte: dataInicial,
                lte: dataFim
              }
            },
            include: {
              lancamentotipo: true
            }
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.locacao.count({ where }),
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

  async findLocacoesByLocatarioId(id: number) {
    return this.prismaService.locatario.findUnique({
      where: {
        id: id,
      },
      include: {
        locacoes: {
          include: {
            imovel: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return await this.prismaService.lancamentoAcordo.delete({
      where: {
        id: id,
      }
    });
  }

  async findManyLocacoes(
    locatarioId: number,
    search: string,
    page: number,
    pageSize: number,
  ) {
    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.LocacaoWhereInput = {
      OR: [
        {
          imovel: {
            endereco: {
              logradouro: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              bairro: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              cidade: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              estado: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              cep: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.locacao.findMany({
        where,
        include: {
          imovel: {
            include: {
              endereco: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.locacao.count({ where }),
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

  async update(lancamentoId: number, data: CreateLancamentoDto) {
    try {

      const result = await this.prismaService.lancamentoAcordo.update({
        where: {
          id: lancamentoId,
        },
        data: {
          descricao: data.descricao,
          valorOriginal: data.valorOriginal,
          juros: data.juros,
          multa: data.multa,
          desconto: data.desconto,
          dataLancamento: data.dataLancamento,
        },
        include: {
          boletoBancario: true,
        },
      });


      return await this.prismaService.lancamentoAcordo.findFirst({
        where: {
          id: lancamentoId,
        },
        include: {
          boletoBancario: true,
        },
      });

      //TODO: clean the type documents and data if it changes
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A lancamento already exists for this property',
          );
        } else {
          throw error;
        }
      }
      throw error;
    }
  }

}
