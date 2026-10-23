import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { FileData } from '@/common/interfaces/file-data';
import { FilesAzureService } from '@/files/azurefiles.service';
import { PrismaService } from '@/prisma/prisma.service';
import { getFileType } from '@/proprietarios/proprietarios.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Acordo, BoletoStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { CreateAcordoDto, UpdateAcordoDto } from './acordos.controller';


@Injectable()
export class AcordosService {
  constructor(
    private readonly prismaService: PrismaService,
    private filesAzureService: FilesAzureService,

  ) { }

  async create(createAcordoDto: CreateAcordoDto) {

    //Caso seja lançamento de locação, verifica se a locação existe e está ativa
    if (createAcordoDto.locacaoId && createAcordoDto.locacaoId > 0) {

      const locacao = await this.prismaService.locacao.findUnique({
        where: {
          id: createAcordoDto.locacaoId
        }
      });

      if (!locacao) {
        throw new BadRequestException('Locacao not found');
      }
    }

    //Caso seja lançamento de imovel sem locação
    if (createAcordoDto.imovelId && createAcordoDto.imovelId > 0) {
      const imovel = await this.prismaService.imovel.findUnique({
        where: {
          id: createAcordoDto.imovelId,
        },
      });

      if (!imovel) {
        throw new BadRequestException('Imovel not found');
      }
    }

    const result = await this.prismaService.acordo.create({
      data: {
        observacao: createAcordoDto.observacao,
        valorOriginal: createAcordoDto.valorOriginal,
        juros: createAcordoDto.juros,
        desconto: createAcordoDto.desconto,
        multa: createAcordoDto.multa,
        valorLiquido: createAcordoDto.valorLiquido,
        qtdParcelas: createAcordoDto.qtdParcelas,
        tipoGeracaoBoleto: createAcordoDto.tipoGeracaoBoleto,
        locacao: createAcordoDto.locacaoId ? { connect: { id: createAcordoDto.locacaoId } } : undefined,
        imovel: createAcordoDto.imovelId ? { connect: { id: createAcordoDto.imovelId } } : undefined,
        status: createAcordoDto.status,
        dataEmissao: createAcordoDto.dataEmissao,
        dataVencimento: createAcordoDto.dataVencimento,
        empresa: { connect: { id: createAcordoDto.empresaId } },
        pessoa: { connect: { id: createAcordoDto.pessoaId } },
      },
      include: {
        locacao: true,
        imovel: true,
        pessoa: true,
        boletos: true
      },
    });

    //Verifica se tem anexos
    if (createAcordoDto?.documentos?.length) {
      await this.createAcordoDocuments(createAcordoDto.empresaId, result.id, createAcordoDto.documentos);
    }

    return result;
  }

  async delete(id: number) {

    const result = await this.prismaService.acordo.delete({
      where: {
        id: id,
      },
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.acordo.findUnique({
      where: {
        id: id,
      },
      include: {
        documentos: true,
        imovel: true,
        pessoa: true,
        lancamentos: true,
        boletos: true,
        locacao: {
          include: {
            imovel: {
              include: {
                endereco: true,
                condominio: true,
              }
            },
          }
        },
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    statusAcordo: BoletoStatus | null | undefined,
    exclude: string | null,
  ): Promise<BasePaginationData<Acordo>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (statusAcordo !== undefined) {
      if (statusAcordo.toString() === 'undefined') {
        statusAcordo = undefined;
      }
    }

    const where: Prisma.AcordoWhereInput = {
      OR: [
        {
          locacao: {
            imovel: {
              description: {
                contains: search,
                mode: 'insensitive'
              },
            },
            locatarios: {
              some: {
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
        {
          locacao: {
            imovel: {
              endereco: {
                complemento: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
            },
          },
        },
      ],
      /*AND: [
        ((statusLocacao === null || statusLocacao === undefined) ? {} : { status: { equals: statusLocacao } }),
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]*/
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.acordo.findMany({
        where,
        include: {
          locacao: {
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
            }
          },
          imovel: {
            include: {
              endereco: true,
              proprietarios: {
                include: {
                  pessoa: {
                    include: {
                      endereco: true
                    }
                  }
                }
              },
              lancamentos: {
                include: {
                  lancamentotipo: true
                }
              }
            }
          },
          boletos: true,
          lancamentos: true,
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.acordo.count({ where }),
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

  async findManyAcordo(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    statusAcordo: BoletoStatus | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<Acordo>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (statusAcordo !== undefined) {
      if (statusAcordo.toString() === 'undefined') {
        statusAcordo = undefined;
      }
    }

    let dataFim: Date = dataFinal;
    dataFim.setDate(dataFinal.getDate() + 1);

    const where: Prisma.AcordoWhereInput = {
      OR: [
        {
          observacao: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          lancamentos: {
            some: {
              descricao: {
                contains: search,
                mode: 'insensitive'
              },
            },
          },
        },
        {
          locacao: {
            imovel: {
              description: {
                contains: search,
                mode: 'insensitive'
              },
            },
            locatarios: {
              some: {
                pessoa: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
        {
          locacao: {
            locatarios: {
              some: {
                pessoa: {
                  nome: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
        {
          locacao: {
            imovel: {
              endereco: {
                complemento: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
            },
          }
        },

        {
          imovel: {
            description: {
              contains: search,
              mode: 'insensitive'
            },
            proprietarios: {
              some: {
                pessoa: {
                  nome: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
        {
          imovel: {
            description: {
              contains: search,
              mode: 'insensitive'
            },
            proprietarios: {
              some: {
                pessoa: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
        {
          imovel: {
            description: {
              contains: search,
              mode: 'insensitive'
            },
            endereco: {
              complemento: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
      AND: [
        {
          empresaId: empresaId,
        },
        ((statusAcordo === null || statusAcordo === undefined || statusAcordo.toString() === "") ? {} : {
          status: {
            equals: statusAcordo
          }
        }),
        {
          dataVencimento: {
            gte: dataInicial,
            lte: dataFim,
          },
        },
      ]
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.acordo.findMany({
        where,
        include: {
          locacao: {
            include: {
              imovel: {
                include: {
                  endereco: true,
                  condominio: true,
                }
              },
              locatarios: {
                include: {
                  pessoa: true,
                }
              }
            },
          },
          imovel: {
            include: {
              endereco: true,
              proprietarios: {
                include: {
                  pessoa: true
                }
              },
            }
          },
          documentos: true,
          boletos: true,
          lancamentos: true,
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.acordo.count({ where }),
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

  async AcordosStatus(empresaId: number,
    statusAcordo: BoletoStatus): Promise<Acordo[]> {

    const acordos = this.prismaService.acordo.findMany({
      where: {
        locacao: {
          empresaId: empresaId,
        },
        status: statusAcordo,
      },
      include: {
        locacao: {
          include: {
            imovel: {
              include: {
                condominio: true,
                endereco: true,
              }
            }
          }
        },
        lancamentos: true,
        boletos: true,
      }
    });

    return acordos;
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
              condominio: true,
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

  async update(acordoId: number, data: UpdateAcordoDto) {
    try {

      if (data.locacaoId && data.locacaoId > 0) {
        const existingLocacao = await this.prismaService.locacao.findFirst({
          where: {
            id: data.locacaoId,
          }
        });

        if (!existingLocacao) {
          throw new BadRequestException('Locacao not found');
        }
      }

      //Caso seja lançamento de imovel sem locação
      if (data.imovelId && data.imovelId > 0) {
        const imovel = await this.prismaService.imovel.findUnique({
          where: {
            id: data.imovelId,
          },
        });

        if (!imovel) {
          throw new BadRequestException('Imovel not found');
        }
      }


      const result = await this.prismaService.acordo.update({
        where: {
          id: acordoId,
        },
        data: {
          observacao: data.observacao,
          valorOriginal: data.valorOriginal,
          juros: data.juros,
          desconto: data.desconto,
          multa: data.multa,
          valorLiquido: data.valorLiquido,
          qtdParcelas: data.qtdParcelas,
          tipoGeracaoBoleto: data.tipoGeracaoBoleto,
          locacao: data.locacaoId ? { connect: { id: data.locacaoId } } : undefined,
          imovel: data.imovelId ? { connect: { id: data.imovelId } } : undefined,
          status: data.status,
          dataEmissao: data.dataEmissao,
          dataVencimento: data.dataVencimento,
          pessoa: { connect: { id: data.pessoaId } },
        },
        include: {
          locacao: true,
          imovel: true,
          pessoa: true,
          boletos: true
        },
      });

      if (data.documentos) {
        await this.createAcordoDocuments(data.empresaId, acordoId, data.documentos);
      }

      if (data.documentosToDeleteIds) {
        //Exclui arquivo da nuvem
        data.documentosToDeleteIds.forEach(async (docId) => {
          const doc = await this.prismaService.genericAnexo.findUnique({
            where: {
              id: docId,
            },
          });
          await this.filesAzureService.deleteFile(doc.url);

          await this.prismaService.genericAnexo.delete({
            where: {
              id: docId,
            },
          });

        }
        );
      }

      return await this.prismaService.lancamentoAcordo.findFirst({
        where: {
          id: acordoId,
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

  async updateStatus(acordoId: number, data: CreateAcordoDto) {
    try {

      console.log(acordoId);
      console.log(data);
      const result = await this.prismaService.acordo.update({
        where: {
          id: acordoId,
        },
        data: {
          status: data.status,
        },
        include: {
          locacao: true,
          imovel: true,
          pessoa: true,
          boletos: true,
        },
      });


      return await this.prismaService.acordo.findFirst({
        where: {
          id: acordoId,
        },
        include: {
          locacao: true,
          imovel: true,
          pessoa: true,
          boletos: true,
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

  private async createAcordoDocuments(
    EmpresaId: number,
    acordoId: number,
    files: MemoryStoredFile[],
  ) {
    try {
      // Crie uma lista de promessas para processar cada arquivo
      const documentPromisses = files.map(async (file) => {
        // Converta o MemoryStoredFile para o formato necessário
        const adaptedFile: FileData = {
          filename: `${randomUUID()}.${file.originalName?.split('.').pop()}`,
          originalname: file.originalName,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
          encoding: file.encoding,
        };

        const fileType = getFileType(file);

        const folder = 'admimoveis/' + EmpresaId.toString() + '/acordos/' + acordoId.toString() + '/' + file.originalName.replaceAll(' ', '_');

        const url = await this.filesAzureService.uploadFile(folder, file);

        return this.prismaService.genericAnexo.create({
          data: {
            tipoArquivo: fileType,
            size: file.size,
            url,
            type: file.mimetype,
            name: file.originalName,
            acordo: {
              connect: {
                id: acordoId,
              },
            },
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createAcordoDocuments', error);
    }
  }
}
