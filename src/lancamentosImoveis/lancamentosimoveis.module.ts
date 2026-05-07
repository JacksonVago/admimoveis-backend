import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { LancamentoImovelController } from './lancamentosimoveis.controller';
import { LancamentosImoveisService } from './lancamentosimoveis.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [LancamentoImovelController],
  providers: [LancamentosImoveisService],
})
export class LancamentoImoveisModule { }
