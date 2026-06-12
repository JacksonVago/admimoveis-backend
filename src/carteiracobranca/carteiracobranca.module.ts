import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CarteiraCobrancaController } from './carteiracobranca.controller';
import { CarteiraCobrancaService } from './carteiracobranca.service';

@Module({
  imports: [PrismaModule],
  controllers: [CarteiraCobrancaController],
  providers: [CarteiraCobrancaService],
})
export class CarteiraCobrancaModule { }
