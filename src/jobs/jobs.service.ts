import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { JobsStatus } from '@prisma/client';

export class CreateJobDto {
  empresaId: number
  alertaId: number
  pessoaId: number
  imovelId: number
  locacaoId: number
  str_message: string
  str_start_date: string
  str_end_date: string
  str_start_time: string
  str_end_time: string
  str_cron: string
  int_delay: number
  dtm_created: Date
  dtm_updated: Date
  status: JobsStatus
  userId: string
}

@Injectable()
export class JobsService {
  constructor(private PrismaService: PrismaService) { }
  async createJob(createJobDto: CreateJobDto) {
    /*const { banco, agencia, conta, digito } = createJobDto;
    const checkIfUserExists = await this.PrismaService.jobs.findUnique({
      where: {
        banco_agencia_conta_digito: {
          banco,
          agencia,
          conta,
          digito
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' Conta corrente já existe');
    }*/

    return await this.PrismaService.jobs.create({
      data: {
        str_message: createJobDto.str_message,
        str_start_date: createJobDto.str_start_date,
        str_end_date: createJobDto.str_end_date,
        str_start_time: createJobDto.str_start_time,
        str_end_time: createJobDto.str_end_time,
        str_cron: createJobDto.str_cron,
        int_delay: createJobDto.int_delay,
        dtm_created: createJobDto.dtm_created,
        dtm_updated: createJobDto.dtm_updated,
        status: createJobDto.status,

        user: createJobDto.userId ? { connect: { id: createJobDto.userId } } : undefined,
        alerta: createJobDto.alertaId ? { connect: { id: createJobDto.alertaId } } : undefined,
        empresa: createJobDto.empresaId ? { connect: { id: createJobDto.empresaId } } : undefined,
        pessoa: createJobDto.pessoaId ? { connect: { id: createJobDto.pessoaId } } : undefined,
        imovel: createJobDto.imovelId ? { connect: { id: createJobDto.imovelId } } : undefined,
        locacao: createJobDto.locacaoId ? { connect: { id: createJobDto.locacaoId } } : undefined,
      },
      include: {
        empresa: true,
        alerta: true,
        pessoa: true,
        imovel: true,
        locacao: true,
      },

    });
  }

  async update(id: string, createJobDto: CreateJobDto) {
    return await this.PrismaService.jobs.update({
      where: {
        id,
      },
      data: {
        str_message: createJobDto.str_message,
        str_start_date: createJobDto.str_start_date,
        str_end_date: createJobDto.str_end_date,
        str_start_time: createJobDto.str_start_time,
        str_end_time: createJobDto.str_end_time,
        str_cron: createJobDto.str_cron,
        int_delay: createJobDto.int_delay,
        dtm_created: createJobDto.dtm_created,
        dtm_updated: createJobDto.dtm_updated,
        status: createJobDto.status,
      },
      include: {
        empresa: true,
        alerta: true,
        pessoa: true,
        imovel: true,
        locacao: true,
      },

    });
  }

  async getJobs(empresa_id: number) {
    return await this.PrismaService.jobs.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: {
        empresa: true,
        alerta: true,
        pessoa: true,
        imovel: true,
        locacao: true,
      },
    });
  }


  async delete(id: string) {
    return await this.PrismaService.jobs.delete({
      where: {
        id,
      }
    });
  }
  async ativaJob(id: string) {
    return await this.PrismaService.jobs.update({
      where: {
        id,
      },
      data: {
        status: JobsStatus.WAITING_TO_START,
      },
      include: {
        empresa: true,
        alerta: true,
        pessoa: true,
        imovel: true,
        locacao: true,
      },

    });
  }

  async desativaJob(id: string) {
    return await this.PrismaService.jobs.update({
      where: {
        id,
      },
      data: {
        status: JobsStatus.FINISHED,
      },
      include: {
        empresa: true,
        alerta: true,
        pessoa: true,
        imovel: true,
        locacao: true,
      },

    });
  }

}
