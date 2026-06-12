import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BancoController } from './banco.controller';
import { BancoService } from './banco.service';

@Module({
  imports: [PrismaModule],
  controllers: [BancoController],
  providers: [BancoService],
})
export class BancoModule { }
