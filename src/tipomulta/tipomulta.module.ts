import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoMultaController } from './tipomulta.controller';
import { TipoMultaService } from './tipomulta.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoMultaController],
  providers: [TipoMultaService],
})
export class TipoMultaModule { }
