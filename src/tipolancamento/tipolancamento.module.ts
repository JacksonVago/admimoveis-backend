import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { TipoLancamentoController } from './tipolancamento.controller';
import { TipoLancamentoService } from './tipolancamento.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [TipoLancamentoController],
  providers: [TipoLancamentoService],
})
export class TipoLancamentoModule { }
