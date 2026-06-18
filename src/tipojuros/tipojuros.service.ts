import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTipoJurosDto } from './tipojuros.controller';

@Injectable()
export class TipoJurosService {
  constructor(private PrismaService: PrismaService) { }
  async createTipoJuros(createTipoJurosDto: CreateTipoJurosDto) {
    const { codigo, bancoId } = createTipoJurosDto;
    const checkIfUserExists = await this.PrismaService.tipoJurosCobranca.findUnique({
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

    return await this.PrismaService.tipoJurosCobranca.create({
      data: {
        codigo: createTipoJurosDto.codigo,
        descricao: createTipoJurosDto.descricao,
        banco: createTipoJurosDto.bancoId ? { connect: { id: createTipoJurosDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateTipoJuros(id: number, { descricao }: CreateTipoJurosDto) {
    return await this.PrismaService.tipoJurosCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
      },
      include: { banco: true },
    });
  }

  async getTiposJuros(bancoId: number) {
    return await this.PrismaService.tipoJurosCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteTipoJuros(id: number) {
    return await this.PrismaService.tipoJurosCobranca.delete({
      where: {
        id,
      }
    });
  }
}
