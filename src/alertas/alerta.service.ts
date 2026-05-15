import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAlertaDto } from './alerta.controller';

@Injectable()
export class AlertaService {
  constructor(private PrismaService: PrismaService) { }
  async createAlerta(createAlertaDto: CreateAlertaDto) {
    const { alertaId, empresaId } = createAlertaDto;
    const checkIfUserExists = await this.PrismaService.configuracaoAlertas.findUnique({
      where: {
        empresaId_alertaId: {
          empresaId: empresaId,
          alertaId: alertaId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' tipo type exists');
    }

    return await this.PrismaService.configuracaoAlertas.create({
      data: {
        descricao: createAlertaDto.descricao,
        ativo: createAlertaDto.ativo,
        tipoAgendamento: createAlertaDto.tipoAgendamento,
        frequenciaEnvio: createAlertaDto.frequenciaEnvio,
        dataInicio: createAlertaDto.dataInicio,
        ocorreAcada: createAlertaDto.ocorreAcada,
        grupoEnvio: createAlertaDto.grupoEnvio,
        horarioEnvio: createAlertaDto.horarioEnvio,
        tipoIntervaloEnvio: createAlertaDto.tipoIntervaloEnvio,
        intervaloEnvio: createAlertaDto.intervaloEnvio,
        horarioInicial: createAlertaDto.horarioInicial,
        horarioFinal: createAlertaDto.horarioFinal,
        dataInicioEnvio: createAlertaDto.dataInicioEnvio,
        dataFinalEnvio: createAlertaDto.dataFinalEnvio,
        alerta: alertaId ? { connect: { id: alertaId } } : undefined,
        empresa: empresaId ? { connect: { id: empresaId } } : undefined,
      },
      include: {
        empresa: true,
        alerta: true,
        jobs: true,
      },

    });
  }

  async updateAlerta(id: number, data: CreateAlertaDto) {
    return await this.PrismaService.configuracaoAlertas.update({
      where: {
        id,
      },
      data: {
        descricao: data.descricao,
        ativo: data.ativo,
        tipoAgendamento: data.tipoAgendamento,
        frequenciaEnvio: data.frequenciaEnvio,
        dataInicio: data.dataInicio,
        ocorreAcada: data.ocorreAcada,
        grupoEnvio: data.grupoEnvio,
        horarioEnvio: data.horarioEnvio,
        tipoIntervaloEnvio: data.tipoIntervaloEnvio,
        intervaloEnvio: data.intervaloEnvio,
        horarioInicial: data.horarioInicial,
        horarioFinal: data.horarioFinal,
        dataInicioEnvio: data.dataInicioEnvio,
        dataFinalEnvio: data.dataFinalEnvio,
      },
      include: {
        empresa: true,
        alerta: true,
        jobs: true,
      },

    });
  }

  async getAlertas(empresa_id: number) {
    return await this.PrismaService.configuracaoAlertas.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: {
        empresa: true,
        alerta: true,
        jobs: true,
      },
    });
  }


  async deleteAlerta(id: number) {
    return await this.PrismaService.configuracaoAlertas.delete({
      where: {
        id,
      }
    });
  }
  async ativaAlerta(id: number) {
    return await this.PrismaService.configuracaoAlertas.update({
      where: {
        id,
      },
      data: {
        ativo: true,
      },
      include: {
        empresa: true,
        alerta: true,
        jobs: true,
      },

    });
  }
  async desativaAlerta(id: number) {
    return await this.PrismaService.configuracaoAlertas.update({
      where: {
        id,
      },
      data: {
        ativo: false,
      },
      include: {
        empresa: true,
        alerta: true,
        jobs: true,
      },

    });
  }
}
