import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { CreateCCDto } from './contacorrente.controller';

@Injectable()
export class ContaCorrenteService {
  constructor(private PrismaService: PrismaService) { }
  async createContaCorrente(createCCDto: CreateCCDto) {
    const { banco, agencia, conta, digito } = createCCDto;
    const checkIfUserExists = await this.PrismaService.contaCorrente.findUnique({
      where: {
        banco_agencia_conta_digito: {
          banco,
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
        banco: createCCDto.banco,
        agencia: createCCDto.agencia,
        conta: createCCDto.conta,
        digito: createCCDto.digito,
        descricao: createCCDto.descricao,
        usuarioBancoAPI: createCCDto.usuarioBancoAPI,
        senhaBancoAPI: createCCDto.senhaBancoAPI,
        chaveAppAPI: createCCDto.chaveAppAPI,
        urlPIX: createCCDto.urlPIX,
        urlWebhookPIX: createCCDto.urlWebhookPIX,
        status: createCCDto.status,

        pessoa: createCCDto.pessoaId ? { connect: { id: createCCDto.pessoaId } } : undefined,
        empresa: createCCDto.empresaId ? { connect: { id: createCCDto.empresaId } } : undefined,
      },
      include: {
        empresa: true,
        pessoa: true,
      },

    });
  }

  async update(id: number, data: CreateCCDto) {
    return await this.PrismaService.contaCorrente.update({
      where: {
        id,
      },
      data: {
        descricao: data.descricao,
        usuarioBancoAPI: data.usuarioBancoAPI,
        senhaBancoAPI: data.senhaBancoAPI,
        chaveAppAPI: data.chaveAppAPI,
        urlPIX: data.urlPIX,
        urlWebhookPIX: data.urlWebhookPIX,
        status: data.status,
      },
      include: {
        empresa: true,
        pessoa: true,
      },

    });
  }

  async getContasCorrente(empresa_id: number) {
    return await this.PrismaService.contaCorrente.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: {
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
