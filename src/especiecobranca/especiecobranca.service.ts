import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEspecieCobrancaDto } from './especiecobranca.controller';

@Injectable()
export class EspecieCobrancaService {
  constructor(private PrismaService: PrismaService) { }
  async createEspecieCobranca(createEspecieCobrancaDto: CreateEspecieCobrancaDto) {
    const { codigo, bancoId } = createEspecieCobrancaDto;
    const checkIfUserExists = await this.PrismaService.especieCobranca.findUnique({
      where: {
        bancoId_codigo: {
          codigo: codigo,
          bancoId: bancoId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException('Espécie de cobrança já existe');
    }

    return await this.PrismaService.especieCobranca.create({
      data: {
        codigo: createEspecieCobrancaDto.codigo,
        descricao: createEspecieCobrancaDto.descricao,
        sigla: createEspecieCobrancaDto.sigla,
        banco: createEspecieCobrancaDto.bancoId ? { connect: { id: createEspecieCobrancaDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateEspecieCobranca(id: number, data: CreateEspecieCobrancaDto) {
    return await this.PrismaService.especieCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: data.descricao,
      },
      include: { banco: true },
    });
  }

  async getEspecieCobranca(bancoId: number) {
    return await this.PrismaService.especieCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteEspecieCobranca(id: number) {
    return await this.PrismaService.especieCobranca.delete({
      where: {
        id,
      }
    });
  }
}
