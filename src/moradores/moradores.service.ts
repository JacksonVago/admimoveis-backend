import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Morador, Prisma } from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { CreateMoradorDto } from './dtos/create-morador.dto';

@Injectable()
export class MoradoresService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) { }

  async create(data: CreateMoradorDto) {
    try {
      //const connectImoveisDataIds: Prisma.ImovelWhereUniqueInput[] =
      //        data?.vincularImoveisIds?.map((id) => ({ id }));

      const result = await this.prismaService.morador.create({
        data: {
          pessoaId: data.pessoaId,
          locacaoId: data.locacaoId,
        },
        include: {
          pessoa: true,
          locacao: true,
        },
      });

      return result;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('morador já cadastrado');
      }
      throw error;
    }
  }

  //async update(id: number, data: UpdateProprietarioDto) {
  async update(id: number, data: CreateMoradorDto) {


    const moradorExists = await this.prismaService.morador.findUnique(
      {
        where: {
          id,
        },
      },
    );

    if (!moradorExists) {
      throw new Error('Morador not found');
    }

    const result = await this.prismaService.morador.update({
      where: {
        id,
      },
      include: {
        locacao: true,
      },
      data: {
        pessoaId: data.pessoaId,
        locacaoId: data.locacaoId,
      },
    });

    return result;
  }

  async delete(id: number) {
    await this.checkMoradorExists(id);

    return await this.prismaService.morador.delete({
      where: {
        id,
      },
    });
  }

  async findMoradorById(id: number) {
    return await this.prismaService.morador.findUnique({
      include: {
        pessoa: {
          include: {
            endereco: true,
          }
        },
        locacao: {
          include: {
            imovel: {
              include: {
                endereco: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }

  async linkMoradorToLocacao(moradorId: number, locacaoId: number, linkDto: CreateMoradorDto) {

    const pessoaExists = await this.prismaService.pessoa.findUnique({
      where: {
        id: moradorId,
      },
    });
    if (!pessoaExists) {
      throw new NotFoundException('Morador not found');
    }

    const locacaoExists = await this.prismaService.locacao.findUnique({
      where: {
        id: locacaoId,
      },
    });

    if (!locacaoExists) {
      throw new NotFoundException('Locacao not found');
    }

    //Grava registro de vinculo
    const data = await this.prismaService.morador.create({
      data: {
        pessoaId: moradorId,
        locacaoId: locacaoId,
      },
      include: {
        pessoa: true,
        locacao: true,
      },
    });

    /*
    await this.checkProprietarioExists(proprietarioId);
    const data = await this.prismaService.proprietario.update({
      where: {
        id: proprietarioId,
      },
      data: {
        imovelId: imovelId,
      },
    });
    */
    return data;
  }

  async unlinkMoradorFromLocacao(moradorId: number, locacaoId: number) {
    await this.checkMoradorExists(moradorId);

    const pessoaExists = await this.prismaService.pessoa.findUnique({
      where: {
        id: moradorId,
      },
    });
    if (!pessoaExists) {
      throw new NotFoundException('Morador not found');
    }

    const locacaoExists = await this.prismaService.locacao.findUnique({
      where: {
        id: locacaoId,
      },
    });

    if (!locacaoExists) {
      throw new NotFoundException('Imovel not found');
    }

    const data = await this.prismaService.morador.update({
      where: {
        id: moradorId,
      },
      data: {
        locacaoId: locacaoId,
      },
    });
    return data;
  }

  async findByDocumento(documento: string) {
    const data = await this.prismaService.morador.findMany({
      where: {
        pessoa: {
          documento: {
            equals: documento,
          }
        },
      },
      include: {
        pessoa: true,
      },
    });

    if (!data) {
      throw new NotFoundException('Morador not found');
    }

    return data;
  }

  async findManyBySearch(
    searchTerm: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ): Promise<BasePaginationData<Morador>> {
    //TODO: implement search by name, document, phone, email

    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.MoradorWhereInput = {
      OR: [
        {
          pessoa: {
            nome: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            documento: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            telefone: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            endereco: {
              logradouro: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              bairro: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              cidade: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              estado: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              cep: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            profissao: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
      ],
    };

    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.morador.findMany({
        take: pageSize,
        skip,
        where,
        include: {
          pessoa: {
            include: {
              endereco: true,
            }
          },
          locacao: {
            include: {
              imovel: {
                include: {
                  endereco: true,
                },
              },
            }
          }
        },
      }),
      this.prismaService.morador.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data.length, //current position in the list e.g. 10 of 100
      totalPages,
    };
  }

  private async checkMoradorExists(id: number) {
    const morador = await this.findMoradorById(id);
    if (!morador) {
      throw new Error('Morador not found');
    }
    return morador;
  }

}

export function getFileType(file: MemoryStoredFile): 'documento' | 'foto' {
  const isImage = file.mimetype.startsWith('image');
  return isImage ? 'foto' : 'documento';
}
