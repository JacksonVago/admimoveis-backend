import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { CreateTipoAlertaDto } from './tipoalerta.controller';

@Injectable()
export class TipoAlertaService {
  constructor(private PrismaService: PrismaService) { }
  async createTipo(createTipoDto: CreateTipoAlertaDto) {
    const { descricao, empresaId } = createTipoDto;
    const checkIfUserExists = await this.PrismaService.tipoAlerta.findUnique({
      where: {
        empresaId_descricao: {
          descricao: descricao,
          empresaId: empresaId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' tipo type exists');
    }

    return await this.PrismaService.tipoAlerta.create({
      data: {
        descricao: descricao,
        status: createTipoDto.status,
        empresa: empresaId ? { connect: { id: empresaId } } : undefined,
      },
      include: { empresa: true },
    });
  }

  async updateTipo(id: number, { descricao, status }: CreateTipoAlertaDto) {
    return await this.PrismaService.tipoAlerta.update({
      where: {
        id,
      },
      data: {
        descricao: descricao,
        status: status,
      },
      include: { empresa: true },
    });
  }

  async getTipos(empresa_id: number) {
    return await this.PrismaService.tipoAlerta.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: { empresa: true },
    });
  }


  async deleteTipo(id: number) {
    return await this.PrismaService.tipoAlerta.delete({
      where: {
        id,
      }
    });
  }
  async ativaTipo(id: number) {
    return await this.PrismaService.tipoAlerta.update({
      where: {
        id,
      },
      data: {
        status: PessoaStatus.ATIVA,
      },
      include: { empresa: true },
    });
  }
  async desativaTipo(id: number) {
    return await this.PrismaService.tipoAlerta.update({
      where: {
        id,
      },
      data: {
        status: PessoaStatus.CANCELADA,
      },
      include: { empresa: true },
    });
  }
}
