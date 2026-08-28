import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GrupoFluxoCaixaController } from './grupofluxocaixa.controller';
import { GrupoFluxoCaixaService } from './grupofluxocaixa.service';

@Module({
  imports: [PrismaModule],
  controllers: [GrupoFluxoCaixaController],
  providers: [GrupoFluxoCaixaService],
})
export class GrupoFluxoCaixaModule { }
