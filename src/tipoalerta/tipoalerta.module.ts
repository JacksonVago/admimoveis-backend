import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoAlertaController } from './tipoalerta.controller';
import { TipoAlertaService } from './tipoalerta.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoAlertaController],
  providers: [TipoAlertaService],
})
export class TipoAlertaModule { }
