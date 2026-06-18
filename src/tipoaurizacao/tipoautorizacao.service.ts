import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTipoAutorizacaoDto } from './tipoautorizacao.controller';

@Injectable()
export class TipoAutorizacaoService {
  constructor(private PrismaService: PrismaService) { }
  async createTipoAutorizacao(createTipoAutorizacaoDto: CreateTipoAutorizacaoDto) {
    const { codigo, bancoId } = createTipoAutorizacaoDto;
    const checkIfUserExists = await this.PrismaService.tipoAutorizacaoCobranca.findUnique({
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

    return await this.PrismaService.tipoAutorizacaoCobranca.create({
      data: {
        codigo: createTipoAutorizacaoDto.codigo,
        descricao: createTipoAutorizacaoDto.descricao,
        banco: createTipoAutorizacaoDto.bancoId ? { connect: { id: createTipoAutorizacaoDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateTipoAutorizacao(id: number, { descricao }: CreateTipoAutorizacaoDto) {
    return await this.PrismaService.tipoAutorizacaoCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
      },
      include: { banco: true },
    });
  }

  async getTiposAutorizacaos(bancoId: number) {
    return await this.PrismaService.tipoAutorizacaoCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteTipoAutorizacao(id: number) {
    return await this.PrismaService.tipoAutorizacaoCobranca.delete({
      where: {
        id,
      }
    });
  }
}
