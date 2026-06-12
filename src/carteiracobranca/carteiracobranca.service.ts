import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCarteiraCobrancaDto } from './carteiracobranca.controller';

@Injectable()
export class CarteiraCobrancaService {
  constructor(private PrismaService: PrismaService) { }
  async createCarteiraCobranca(createCarteiraCobrancaDto: CreateCarteiraCobrancaDto) {
    const { carteira, bancoId } = createCarteiraCobrancaDto;
    const checkIfUserExists = await this.PrismaService.carteiraCobranca.findUnique({
      where: {
        bancoId_carteira: {
          carteira: carteira,
          bancoId: bancoId,
        }
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException('Carteira de cobrança já existe');
    }

    return await this.PrismaService.carteiraCobranca.create({
      data: {
        carteira: createCarteiraCobrancaDto.carteira,
        descricao: createCarteiraCobrancaDto.descricao,
        vencimentoMinimo: createCarteiraCobrancaDto.vencimentoMinimo,
        vencimentoMaximo: createCarteiraCobrancaDto.vencimentoMaximo,
        banco: createCarteiraCobrancaDto.bancoId ? { connect: { id: createCarteiraCobrancaDto.bancoId } } : undefined,
      },
      include: {
        banco: true,
      },
    });
  }

  async updateCarteiraCobranca(id: number, data: CreateCarteiraCobrancaDto) {
    return await this.PrismaService.carteiraCobranca.update({
      where: {
        id,
      },
      data: {
        descricao: data.descricao,
        vencimentoMinimo: data.vencimentoMinimo,
        vencimentoMaximo: data.vencimentoMaximo,
      },
      include: { banco: true },
    });
  }

  async getCarteiraCobranca(bancoId: number) {
    return await this.PrismaService.carteiraCobranca.findMany({
      where: {
        bancoId: bancoId,
      },
      include: { banco: true },
    });
  }


  async deleteCarteiraCobranca(id: number) {
    return await this.PrismaService.carteiraCobranca.delete({
      where: {
        id,
      }
    });
  }
}
