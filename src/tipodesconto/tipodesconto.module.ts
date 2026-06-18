import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoDescontoController } from './tipodesconto.controller';
import { TipoDescontoService } from './tipodesconto.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoDescontoController],
  providers: [TipoDescontoService],
})
export class TipoDescontoModule { }
