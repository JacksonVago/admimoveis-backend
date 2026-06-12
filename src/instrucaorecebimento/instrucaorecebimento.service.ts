import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateInstrucaoRecebimentosDto } from './instrucaorecebimento.controller';

@Injectable()
export class InstrucaoRecebimentosService {
  constructor(private PrismaService: PrismaService) { }
  async createInstrucaoRecebimentos(createInstrucaoRecebimentosDto: CreateInstrucaoRecebimentosDto) {
    const { codigo, bancoId } = createInstrucaoRecebimentosDto;
    const checkIfUserExists = await this.PrismaService.instrucaoRecebimentos.findUnique({
      where: {
        bancoId_codigo: {
          codigo: codigo,
          bancoId: bancoId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' Instrução de recebimento já existe');
    }

    return await this.PrismaService.instrucaoRecebimentos.create({
      data: {
        codigo: createInstrucaoRecebimentosDto.codigo,
        descricao: createInstrucaoRecebimentosDto.descricao,
        banco: createInstrucaoRecebimentosDto.bancoId ? { connect: { id: createInstrucaoRecebimentosDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateInstrucaoRecebimentos(id: number, { descricao }: CreateInstrucaoRecebimentosDto) {
    return await this.PrismaService.instrucaoRecebimentos.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
      },
      include: { banco: true },
    });
  }

  async getInstrucoesRecebimentos(bancoId: number) {
    return await this.PrismaService.instrucaoRecebimentos.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteInstrucaoRecebimentos(id: number) {
    return await this.PrismaService.instrucaoRecebimentos.delete({
      where: {
        id,
      }
    });
  }
}
