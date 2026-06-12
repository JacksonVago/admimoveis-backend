import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateInstrucaoCobrancaDto } from './instrucaocobranca.controller';

@Injectable()
export class InstrucaoCobrancaService {
  constructor(private PrismaService: PrismaService) { }
  async createInstrucaoCobranca(createInstrucaoCobrancaDto: CreateInstrucaoCobrancaDto) {
    const { codigo, bancoId } = createInstrucaoCobrancaDto;
    const checkIfUserExists = await this.PrismaService.instrucaoCobranca.findUnique({
      where: {
        bancoId_codigo: {
          codigo: codigo,
          bancoId: bancoId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' Instrução de cobrança já existe');
    }

    return await this.PrismaService.instrucaoCobranca.create({
      data: {
        codigo: createInstrucaoCobrancaDto.codigo,
        descricao: createInstrucaoCobrancaDto.descricao,
        banco: createInstrucaoCobrancaDto.bancoId ? { connect: { id: createInstrucaoCobrancaDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateInstrucaoCobranca(id: number, { descricao }: CreateInstrucaoCobrancaDto) {
    return await this.PrismaService.instrucaoCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
      },
      include: { banco: true },
    });
  }

  async getInstrucoesCobranca(bancoId: number) {
    return await this.PrismaService.instrucaoCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteInstrucaoCobranca(id: number) {
    return await this.PrismaService.instrucaoCobranca.delete({
      where: {
        id,
      }
    });
  }
}
