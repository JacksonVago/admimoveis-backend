import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AlertaController } from './alerta.controller';
import { AlertaService } from './alerta.service';

@Module({
  imports: [PrismaModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [AlertaController],
  providers: [AlertaService],
})
export class AlertaModule { }
