import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BoletoStatus, Imovel, LancamentoImovel, lancamentoStatus, Prisma } from '@prisma/client';
import { CreateLancamentoDto, gerarBoletoDto } from './lancamentosimoveis.controller';

@Injectable()
export class LancamentosImoveisService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createLancamentoDto: CreateLancamentoDto) {

    const imovel = await this.prismaService.imovel.findUnique({
      where: {
        id: createLancamentoDto.imovelId,
      },
    });

    if (!imovel) {
      throw new BadRequestException('Imovel not found');
    }

    const result = await this.prismaService.lancamentoImovel.create({
      data: {
        parcela: createLancamentoDto.parcela,
        tipoId: createLancamentoDto.tipoId,
        valorLancamento: createLancamentoDto.valorLancamento,
        dataLancamento: createLancamentoDto.dataLancamento,
        vencimentoLancamento: createLancamentoDto.vencimentoLancamento,
        observacao: createLancamentoDto.observacao ? createLancamentoDto.observacao : '',
        linhaDigitavel: createLancamentoDto.linhaDigitavel ? createLancamentoDto.linhaDigitavel : '',
        numeroDocumento: createLancamentoDto.numeroDocumento,
        dataDocumento: createLancamentoDto.dataDocumento,
        serieDocumento: createLancamentoDto.serieDocumento,
        valorDocumento: createLancamentoDto.valorDocumento,
        descontoDocumento: createLancamentoDto.descontoDocumento,
        status: createLancamentoDto.status,
        imovelId: createLancamentoDto.imovelId
      },
      include: {
        imovel: true,
      },
    });

    return result;
  }

  async createPagamento(gerarPagamentoDto: gerarBoletoDto) {

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const imovel = await this.prismaService.imovel.findUnique({
      where: {
        id: gerarPagamentoDto.imovelId,
      },
    });

    if (!imovel) {
      throw new BadRequestException('Imovel not found');
    }

    //Monta dados do pagamento/boleto
    const resultPag = await this.prismaService.boleto.create({
      data: {
        status: BoletoStatus.PENDENTE,
        valorOriginal: gerarPagamentoDto.lancamentos.reduce((sum, lancamento) => sum + lancamento.valorLancamento, 0),
        valorPago: null,
        dataEmissao: new Date(),
        dataVencimento: (gerarPagamentoDto.lancamentos && gerarPagamentoDto.lancamentos.length > 0) ? gerarPagamentoDto.lancamentos[0].vencimentoLancamento : new Date(gerarPagamentoDto.dataVencimento),
        dataPagamento: null,
        observacao: 'pagamento gerado automaticamente para imóvel ' + gerarPagamentoDto.imovelId,
        empresa: { connect: { id: gerarPagamentoDto.empresaId } },
        imovel: { connect: { id: gerarPagamentoDto.imovelId } },
        lancamentoImovels: {
          connect: gerarPagamentoDto.lancamentos.map(lancamento => ({ id: lancamento.id })),
        },
      },
      include: {
        imovel: true,
        lancamentoImovels: true,
      },
    });


    //Atualiza os lançamentos vinculando o pagamento
    const result = await this.prismaService.lancamentoImovel.updateMany({
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

        await this.prismaService.lancamentoImovel.create({
          data: {
            parcela: novaParcela,
            tipoId: lancamento.tipoId,
            valorLancamento: lancamento.valorLancamento,
            dataLancamento: novaDataLancamento,
            vencimentoLancamento: novoVencimentoLancamento,
            observacao: lancamento.observacao ? lancamento.observacao : '',
            status: lancamentoStatus.ABERTO,
            imovelId: gerarPagamentoDto.imovelId
          },
        });
      }
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.lancamentoImovel.findUnique({
      where: {
        id: id,
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    statusLancamento: lancamentoStatus | null | undefined,
    exclude: string | null,
  ): Promise<BasePaginationData<LancamentoImovel>> {
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

    const where: Prisma.LancamentoImovelWhereInput = {
      OR: [
        {
          observacao: {
            contains: search,
            mode: 'insensitive'
          },
        },
        {
          imovel: {
            description: {
              contains: search,
              mode: 'insensitive'
            },
            proprietarios: {
              every: {
                pessoa: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                }

              }
            }
          },
        },
      ],
      /*AND: [
        ((statusLocacao === null || statusLocacao === undefined) ? {} : { status: { equals: statusLocacao } }),
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]*/
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.lancamentoImovel.findMany({
        where,
        include: {
          imovel: {
            include: {
              proprietarios: {
                include: {
                  pessoa: {
                    include: {
                      endereco: true
                    }
                  }
                }
              },
              endereco: true,
            }
          }
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.lancamentoImovel.count({ where }),
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

  async findManyImovel(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    statusLancamento: lancamentoStatus | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<Imovel>> {
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

    const where: Prisma.ImovelWhereInput = {
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
          description: {
            contains: search,
            mode: 'insensitive'
          },
        },
        {
          endereco: {
            logradouro: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          endereco: {
            complemento: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          proprietarios: {
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
          proprietarios: {
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
        empresaId ? { empresaId: empresaId } : {},
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.imovel.findMany({
        where,
        include: {
          proprietarios: {
            include: {
              pessoa: {
                include: {
                  endereco: true
                }
              }
            }
          },
          endereco: true,
          lancamentos: {
            where: {
              dataLancamento: {
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
      this.prismaService.imovel.count({ where }),
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

  async findImoveisByLocatarioId(id: number) {
    return this.prismaService.proprietario.findUnique({
      where: {
        id: id,
      },
      include: {
        imovel: true,
        pessoa: true,
      },
    });
  }

  async delete(id: number) {
    return await this.prismaService.lancamentoImovel.delete({
      where: {
        id: id,
      }
    });
  }

  async findManyImoveis(
    locatarioId: number,
    search: string,
    page: number,
    pageSize: number,
  ) {
    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.ImovelWhereInput = {
      OR: [
        {
          endereco: {
            logradouro: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            bairro: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cidade: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            estado: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cep: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.imovel.findMany({
        where,
        include: {
          endereco: true,
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.imovel.count({ where }),
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

      const existingImovel = await this.prismaService.imovel.findFirst({
        where: {
          id: data.imovelId,
        }
      });

      if (!existingImovel) {
        throw new BadRequestException('Imovel not found');
      }

      const result = await this.prismaService.lancamentoImovel.update({
        where: {
          id: lancamentoId,
        },
        data: {
          parcela: data.parcela,
          tipoId: data.tipoId,
          dataLancamento: data.dataLancamento,
          valorLancamento: data.valorLancamento,
          vencimentoLancamento: data.vencimentoLancamento,
          status: data.status,
          linhaDigitavel: data.linhaDigitavel ? data.linhaDigitavel : '',
          observacao: data.observacao,
          numeroDocumento: data.numeroDocumento,
          dataDocumento: data.dataDocumento,
          serieDocumento: data.serieDocumento,
          valorDocumento: data.valorDocumento,
          descontoDocumento: data.descontoDocumento,
        },
        include: {
          imovel: true
        },
      });


      return await this.prismaService.lancamentoImovel.findFirst({
        where: {
          id: lancamentoId,
        },
        include: {
          imovel: true,
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

  async updateStatus(lancamentoId: number, data: CreateLancamentoDto) {
    try {

      const result = await this.prismaService.lancamentoImovel.update({
        where: {
          id: lancamentoId,
        },
        data: {
          status: data.status,
        },
        include: {
          imovel: true
        },
      });


      return await this.prismaService.lancamentoImovel.findFirst({
        where: {
          id: lancamentoId,
        },
        include: {
          imovel: true,
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
