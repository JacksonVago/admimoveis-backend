import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { BoletoBancarioController } from './boletobancario.controller';
import { BoletoBancarioService } from "./boletobancario.service";
import { BoletoWebService } from './boletoweb.service';

@Module({
  imports: [PrismaModule,
    HttpModule,
    NestjsFormDataModule
  ],
  controllers: [BoletoBancarioController],
  providers: [BoletoBancarioService, BoletoWebService],
})
export class BoletoBancarioModule { }
