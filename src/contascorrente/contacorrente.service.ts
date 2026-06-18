import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { ContaCorrente, PessoaStatus, Prisma } from '@prisma/client';
import { CreateCCDto } from './contacorrente.controller';

@Injectable()
export class ContaCorrenteService {
  constructor(private PrismaService: PrismaService) { }
  async createContaCorrente(createCCDto: CreateCCDto) {
    const { bancoId, agencia, conta, digito } = createCCDto;
    const checkIfUserExists = await this.PrismaService.contaCorrente.findUnique({
      where: {
        bancoId_agencia_conta_digito: {
          bancoId,
          agencia,
          conta,
          digito
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' Conta corrente já existe');
    }

    return await this.PrismaService.contaCorrente.create({
      data: {
        agencia: createCCDto.agencia,
        conta: createCCDto.conta,
        digito: createCCDto.digito,
        descricao: createCCDto.descricao,
        usuarioBancoAPI: createCCDto.usuarioBancoAPI,
        senhaBancoAPI: createCCDto.senhaBancoAPI,
        chaveAppAPI: createCCDto.chaveAppAPI,
        urlPIX: createCCDto.urlPIX,
        urlBoleto: createCCDto.urlBoleto,
        urlWebhookPIX: createCCDto.urlWebhookPIX,
        urlWebhookBoleto: createCCDto.urlWebhookBoleto,
        status: createCCDto.status,
        pagtoParcial: createCCDto.pagtoParcial,
        qtdeMaxParcial: createCCDto.qtdeMaxParcial,
        formaEnvio: createCCDto.formaEnvio,
        assuntoEmail: createCCDto.assuntoEmail,
        mensagemEmail1: createCCDto.mensagemEmail1,
        mensagemEmail2: createCCDto.mensagemEmail2,
        mensagemEmail3: createCCDto.mensagemEmail3,

        tipoJurosCob: createCCDto.tipoJurosCobId ? { connect: { id: createCCDto.tipoJurosCobId } } : undefined,
        valorJuros: createCCDto.valorJuros,
        percJuros: createCCDto.percJuros,
        diasInicioJuros: createCCDto.diasInicioJuros,

        tipoMultaCob: createCCDto.tipoMultaCobId ? { connect: { id: createCCDto.tipoMultaCobId } } : undefined,
        valorMulta: createCCDto.valorMulta,
        percMulta: createCCDto.percMulta,
        diasInicioMulta: createCCDto.diasInicioMulta,

        tipoDescontoCob: createCCDto.tipoDescontoCobId ? { connect: { id: createCCDto.tipoDescontoCobId } } : undefined,
        valorDesconto: createCCDto.valorDesconto,
        percDesconto: createCCDto.percDesconto,
        diasInicioDesconto: createCCDto.diasInicioDesconto,

        tipoAutorizacaoCob: createCCDto.tipoAutorizacaoCobId ? { connect: { id: createCCDto.tipoAutorizacaoCobId } } : undefined,
        tipoRecebimentoDiv: createCCDto.tipoRecebimentoDiv,
        valorMinDiverg: createCCDto.valorMinDiverg,
        valorMaxDiverg: createCCDto.valorMaxDiverg,
        percMinDiverg: createCCDto.percMinDiverg,
        percMaxDiverg: createCCDto.percMaxDiverg,

        protestar: createCCDto.protestar,
        qtdeDiasProtesto: createCCDto.qtdeDiasProtesto,
        negativar: createCCDto.negativar,
        qtdeDiasNegativar: createCCDto.qtdeDiasNegativar,

        instrucaoCob1: createCCDto.instrucaoCobId1 ? { connect: { id: createCCDto.instrucaoCobId1 } } : undefined,
        instrucaoCob2: createCCDto.instrucaoCobId2 ? { connect: { id: createCCDto.instrucaoCobId2 } } : undefined,
        instrucaoCob3: createCCDto.instrucaoCobId3 ? { connect: { id: createCCDto.instrucaoCobId3 } } : undefined,
        qtdeDiasAposVencto: createCCDto.qtdeDiasAposVencto,
        cobrancaDiaUtil: createCCDto.cobrancaDiaUtil,

        instrucaoRec1: createCCDto.instrucaoRecId1 ? { connect: { id: createCCDto.instrucaoRecId1 } } : undefined,
        instrucaoRec2: createCCDto.instrucaoRecId2 ? { connect: { id: createCCDto.instrucaoRecId2 } } : undefined,
        instrucaoRec3: createCCDto.instrucaoRecId3 ? { connect: { id: createCCDto.instrucaoRecId3 } } : undefined,
        instrucaoRec4: createCCDto.instrucaoRecId4 ? { connect: { id: createCCDto.instrucaoRecId4 } } : undefined,
        carteira: createCCDto.carteiraId ? { connect: { id: createCCDto.carteiraId } } : undefined,
        especie: createCCDto.especieId ? { connect: { id: createCCDto.especieId } } : undefined,

        banco: createCCDto.bancoId ? { connect: { id: createCCDto.bancoId } } : undefined,
        pessoa: createCCDto.pessoaId ? { connect: { id: createCCDto.pessoaId } } : undefined,
        empresa: createCCDto.empresaId ? { connect: { id: createCCDto.empresaId } } : undefined,
      },
      include: {
        instrucaoCob1: true,
        instrucaoCob2: true,
        instrucaoCob3: true,
        instrucaoRec1: true,
        instrucaoRec2: true,
        instrucaoRec3: true,
        instrucaoRec4: true,
        tipoJurosCob: true,
        tipoMultaCob: true,
        tipoDescontoCob: true,
        tipoAutorizacaoCob: true,
        empresa: true,
        pessoa: true,
      },

    });
  }

  async update(id: number, data: CreateCCDto) {
    console.log('data: ', data)
    const result = await this.PrismaService.contaCorrente.update({
      where: {
        id,
      },
      data: {
        descricao: data.descricao,
        usuarioBancoAPI: data.usuarioBancoAPI,
        senhaBancoAPI: data.senhaBancoAPI,
        chaveAppAPI: data.chaveAppAPI,
        urlPIX: data.urlPIX,
        urlBoleto: data.urlBoleto,
        urlWebhookPIX: data.urlWebhookPIX,
        urlWebhookBoleto: data.urlWebhookBoleto,
        status: data.status,
        pagtoParcial: data.pagtoParcial,
        qtdeMaxParcial: data.qtdeMaxParcial,
        formaEnvio: data.formaEnvio,
        assuntoEmail: data.assuntoEmail,
        mensagemEmail1: data.mensagemEmail1,
        mensagemEmail2: data.mensagemEmail2,
        mensagemEmail3: data.mensagemEmail3,

        tipoJurosCob: data.tipoJurosCobId ? { connect: { id: data.tipoJurosCobId } } : undefined,
        valorJuros: data.valorJuros,
        percJuros: data.percJuros,
        diasInicioJuros: data.diasInicioJuros,

        tipoMultaCob: data.tipoMultaCobId ? { connect: { id: data.tipoMultaCobId } } : undefined,
        valorMulta: data.valorMulta,
        percMulta: data.percMulta,
        diasInicioMulta: data.diasInicioMulta,

        tipoDescontoCob: data.tipoDescontoCobId ? { connect: { id: data.tipoDescontoCobId } } : undefined,
        valorDesconto: data.valorDesconto,
        percDesconto: data.percDesconto,
        diasInicioDesconto: data.diasInicioDesconto,

        tipoAutorizacaoCob: data.tipoAutorizacaoCobId ? { connect: { id: data.tipoAutorizacaoCobId } } : undefined,
        tipoRecebimentoDiv: data.tipoRecebimentoDiv,
        valorMinDiverg: data.valorMinDiverg,
        valorMaxDiverg: data.valorMaxDiverg,
        percMinDiverg: data.percMinDiverg,
        percMaxDiverg: data.percMaxDiverg,

        protestar: data.protestar,
        qtdeDiasProtesto: data.qtdeDiasProtesto,
        negativar: data.negativar,
        qtdeDiasNegativar: data.qtdeDiasNegativar,

        instrucaoCob1: data.instrucaoCobId1 ? { connect: { id: data.instrucaoCobId1 } } : undefined,
        instrucaoCob2: data.instrucaoCobId2 ? { connect: { id: data.instrucaoCobId2 } } : undefined,
        instrucaoCob3: data.instrucaoCobId3 ? { connect: { id: data.instrucaoCobId3 } } : undefined,
        qtdeDiasAposVencto: data.qtdeDiasAposVencto,
        cobrancaDiaUtil: data.cobrancaDiaUtil,

        instrucaoRec1: data.instrucaoRecId1 ? { connect: { id: data.instrucaoRecId1 } } : undefined,
        instrucaoRec2: data.instrucaoRecId2 ? { connect: { id: data.instrucaoRecId2 } } : undefined,
        instrucaoRec3: data.instrucaoRecId3 ? { connect: { id: data.instrucaoRecId3 } } : undefined,
        instrucaoRec4: data.instrucaoRecId4 ? { connect: { id: data.instrucaoRecId4 } } : undefined,
        carteira: data.carteiraId ? { connect: { id: data.carteiraId } } : undefined,
        especie: data.especieId ? { connect: { id: data.especieId } } : undefined,
      },
      include: {
        instrucaoCob1: true,
        instrucaoCob2: true,
        instrucaoCob3: true,
        instrucaoRec1: true,
        instrucaoRec2: true,
        instrucaoRec3: true,
        instrucaoRec4: true,
        tipoJurosCob: true,
        tipoMultaCob: true,
        tipoDescontoCob: true,
        tipoAutorizacaoCob: true,
        empresa: true,
        pessoa: true,
      },

    });

    console.log('result: ', result);
    return result;
  }

  async findMany(
    empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    exclude: string | null,
  ): Promise<BasePaginationData<ContaCorrente>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    const where: Prisma.ContaCorrenteWhereInput = {
      OR: [
        {
          agencia: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          conta: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          descricao: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          banco: {
            nome: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
      //Quando quiser excluir id´s
      AND: [
        (exclude === null ? {} : { id: { notIn: arr_id } }),
        empresaId ? { empresaId: empresaId } : {},
      ]

    };

    const [data, total] = await this.PrismaService.$transaction([
      this.PrismaService.contaCorrente.findMany({
        where,
        include: {
          instrucaoCob1: true,
          instrucaoCob2: true,
          instrucaoCob3: true,
          instrucaoRec1: true,
          instrucaoRec2: true,
          instrucaoRec3: true,
          instrucaoRec4: true,
          tipoJurosCob: true,
          tipoMultaCob: true,
          tipoDescontoCob: true,
          tipoAutorizacaoCob: true,
          pessoa: true,
          banco: true,
        },
        skip,
        take: pageSize,
      }),
      this.PrismaService.contaCorrente.count({ where }),
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

  async getContasCorrente(empresa_id: number) {
    return await this.PrismaService.contaCorrente.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: {
        instrucaoCob1: true,
        instrucaoCob2: true,
        instrucaoCob3: true,
        instrucaoRec1: true,
        instrucaoRec2: true,
        instrucaoRec3: true,
        instrucaoRec4: true,
        tipoJurosCob: true,
        tipoMultaCob: true,
        tipoDescontoCob: true,
        tipoAutorizacaoCob: true,
        empresa: true,
        pessoa: true,
        banco: true,
      },
    });
  }

  async getContaCorrente(id: number) {
    return await this.PrismaService.contaCorrente.findUnique({
      where: {
        id,
      },
      include: {
        instrucaoCob1: true,
        instrucaoCob2: true,
        instrucaoCob3: true,
        instrucaoRec1: true,
        instrucaoRec2: true,
        instrucaoRec3: true,
        instrucaoRec4: true,
        tipoJurosCob: true,
        tipoMultaCob: true,
        tipoDescontoCob: true,
        tipoAutorizacaoCob: true,
        empresa: true,
        pessoa: true,
      },
    });
  }


  async delete(id: number) {
    return await this.PrismaService.contaCorrente.delete({
      where: {
        id,
      }
    });
  }
  async ativaConta(id: number) {
    return await this.PrismaService.contaCorrente.update({
      where: {
        id,
      },
      data: {
        status: PessoaStatus.ATIVA,
      },
      include: {
        empresa: true,
        pessoa: true,
      },

    });
  }

  async desativaConta(id: number) {
    return await this.PrismaService.contaCorrente.update({
      where: {
        id,
      },
      data: {
        status: PessoaStatus.CANCELADA,
      },
      include: {
        empresa: true,
        pessoa: true,
      },

    });
  }

}
