import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { CreateGrupoFluxoCaixaDto } from './grupofluxocaixa.controller';

@Injectable()
export class GrupoFluxoCaixaService {
  constructor(private PrismaService: PrismaService) { }
  async create(createGrupoFluxocaixaDto: CreateGrupoFluxoCaixaDto) {
    const { descricao, empresaId } = createGrupoFluxocaixaDto;
    const checkIfUserExists = await this.PrismaService.grupoFluxoCaixa.findUnique({
      where: {
        empresaId_descricao: {
          descricao: descricao,
          empresaId: empresaId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' Grupo de fluxo de caixa já existe');
    }

    return await this.PrismaService.grupoFluxoCaixa.create({
      data: {
        descricao: createGrupoFluxocaixaDto.descricao,
        cor: createGrupoFluxocaixaDto.cor,
        status: PessoaStatus.ATIVA,
        empresa: createGrupoFluxocaixaDto.empresaId ? { connect: { id: createGrupoFluxocaixaDto.empresaId } } : undefined,
      },
      include: {
        empresa: true,
      },
    });
  }

  async update(id: number, { descricao, cor, status }: CreateGrupoFluxoCaixaDto) {
    return await this.PrismaService.grupoFluxoCaixa.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
        cor: cor,
        status: status,
      },
      include: { empresa: true },
    });
  }

  async get(empresaId: number) {
    return await this.PrismaService.grupoFluxoCaixa.findMany({
      where: {
        empresaId: empresaId,
      },
      include: { empresa: true },
    });
  }


  async delete(id: number) {
    return await this.PrismaService.grupoFluxoCaixa.delete({
      where: {
        id,
      }
    });
  }
}
