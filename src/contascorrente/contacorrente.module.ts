import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ContaCorrenteController } from './contacorrente.controller';
import { ContaCorrenteService } from './contacorrente.service';

@Module({
  imports: [PrismaModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [ContaCorrenteController],
  providers: [ContaCorrenteService],
})
export class ContaCorrenteModule { }
