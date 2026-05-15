import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AlertaController } from './alerta.controller';
import { AlertaService } from './alerta.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlertaController],
  providers: [AlertaService],
})
export class AlertaModule { }
