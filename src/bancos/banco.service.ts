import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBancoDto } from './banco.controller';

@Injectable()
export class BancoService {
  constructor(private PrismaService: PrismaService) { }
  async createBanco(createBancoDto: CreateBancoDto) {
    const { codigo } = createBancoDto;
    const checkIfUserExists = await this.PrismaService.banco.findUnique({
      where: {
        codigo: codigo,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' Banco já existe');
    }

    return await this.PrismaService.banco.create({
      data: {
        codigo: createBancoDto.codigo,
        nome: createBancoDto.nome,
      }
    });
  }

  async updateBanco(id: number, { nome }: CreateBancoDto) {
    return await this.PrismaService.banco.update({
      where: {
        id,
      },
      data: {
        nome: nome,
      }
    });
  }

  async getBancos(id: number) {
    return await this.PrismaService.banco.findMany({
      where: id && id > 0 ? { id: id } : {},
    });
  }


  async deleteBanco(id: number) {
    return await this.PrismaService.banco.delete({
      where: {
        id,
      }
    });
  }
}
