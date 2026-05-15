import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ContaCorrenteController } from './contacorrente.controller';
import { ContaCorrenteService } from './contacorrente.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContaCorrenteController],
  providers: [ContaCorrenteService],
})
export class ContaCorrenteModule { }
