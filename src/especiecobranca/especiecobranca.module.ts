import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { EspecieCobrancaController } from './especiecobranca.controller';
import { EspecieCobrancaService } from './especiecobranca.service';

@Module({
  imports: [PrismaModule],
  controllers: [EspecieCobrancaController],
  providers: [EspecieCobrancaService],
})
export class EspecieCobrancaModule { }
