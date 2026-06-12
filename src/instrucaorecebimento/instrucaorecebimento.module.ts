import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { InstrucaoRecebimentosController } from './instrucaorecebimento.controller';
import { InstrucaoRecebimentosService } from './instrucaorecebimento.service';

@Module({
  imports: [PrismaModule],
  controllers: [InstrucaoRecebimentosController],
  providers: [InstrucaoRecebimentosService],
})
export class InstrucaoRecebimentosModule { }
