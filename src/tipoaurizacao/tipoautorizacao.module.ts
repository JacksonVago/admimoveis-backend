import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoAutorizacaoController } from './tipoautorizacao.controller';
import { TipoAutorizacaoService } from './tipoautorizacao.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoAutorizacaoController],
  providers: [TipoAutorizacaoService],
})
export class TipoAutorizacaoModule { }
