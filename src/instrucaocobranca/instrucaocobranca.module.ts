import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { InstrucaoCobrancaController } from './instrucaocobranca.controller';
import { InstrucaoCobrancaService } from './instrucaocobranca.service';

@Module({
  imports: [PrismaModule],
  controllers: [InstrucaoCobrancaController],
  providers: [InstrucaoCobrancaService],
})
export class InstrucaoCobrancaModule { }
