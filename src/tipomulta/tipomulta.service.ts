import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTipoMultaDto } from './tipomulta.controller';

@Injectable()
export class TipoMultaService {
  constructor(private PrismaService: PrismaService) { }
  async createTipoMulta(createTipoMultaDto: CreateTipoMultaDto) {
    const { codigo, bancoId } = createTipoMultaDto;
    const checkIfUserExists = await this.PrismaService.tipoMultaCobranca.findUnique({
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

    return await this.PrismaService.tipoMultaCobranca.create({
      data: {
        codigo: createTipoMultaDto.codigo,
        descricao: createTipoMultaDto.descricao,
        banco: createTipoMultaDto.bancoId ? { connect: { id: createTipoMultaDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateTipoMulta(id: number, { descricao }: CreateTipoMultaDto) {
    return await this.PrismaService.tipoMultaCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
      },
      include: { banco: true },
    });
  }

  async getTiposMultas(bancoId: number) {
    return await this.PrismaService.tipoMultaCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteTipoMulta(id: number) {
    return await this.PrismaService.tipoMultaCobranca.delete({
      where: {
        id,
      }
    });
  }
}
