import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTipoDescontoDto } from './tipodesconto.controller';

@Injectable()
export class TipoDescontoService {
  constructor(private PrismaService: PrismaService) { }
  async createTipoDesconto(createTipoDescontoDto: CreateTipoDescontoDto) {
    const { codigo, bancoId } = createTipoDescontoDto;
    const checkIfUserExists = await this.PrismaService.tipoDescontoCobranca.findUnique({
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

    return await this.PrismaService.tipoDescontoCobranca.create({
      data: {
        codigo: createTipoDescontoDto.codigo,
        descricao: createTipoDescontoDto.descricao,
        banco: createTipoDescontoDto.bancoId ? { connect: { id: createTipoDescontoDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateTipoDesconto(id: number, { descricao }: CreateTipoDescontoDto) {
    return await this.PrismaService.tipoDescontoCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
      },
      include: { banco: true },
    });
  }

  async getTiposDescontos(bancoId: number) {
    return await this.PrismaService.tipoDescontoCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteTipoDesconto(id: number) {
    return await this.PrismaService.tipoDescontoCobranca.delete({
      where: {
        id,
      }
    });
  }
}
