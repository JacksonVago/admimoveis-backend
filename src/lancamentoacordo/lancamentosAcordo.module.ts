import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { LancamentoAcordoController } from './lancamentosAcordo.controller';
import { LancamentosAcordosService } from './lancamentosAcordo.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [LancamentoAcordoController],
  providers: [LancamentosAcordosService],
})
export class LancamentoAcordoModule { }
