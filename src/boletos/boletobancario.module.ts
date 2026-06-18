import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BoletoBancarioController } from './boletobancario.controller';
import { BoletoBancarioService } from './BoletoBancario.service';
import { BoletoWebService } from './boletoweb';

@Module({
  imports: [PrismaModule],
  controllers: [BoletoBancarioController],
  providers: [BoletoBancarioService, BoletoWebService],
})
export class BoletoBancarioModule { }
