import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoJurosController } from './tipojuros.controller';
import { TipoJurosService } from './tipojuros.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoJurosController],
  providers: [TipoJurosService],
})
export class TipoJurosModule { }
