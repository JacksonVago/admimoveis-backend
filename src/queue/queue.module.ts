// src/queue/queue.module.ts
import { Module } from '@nestjs/common';
//import { BullModule } from '@nestjs/bull';
import { EnvModule } from '@/env/env.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { CustomRedisModule } from '@/redis/redis.module';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [
    PrismaModule,
    EnvModule,
    CustomRedisModule,
    /*EnvModule,
    BullModule.registerQueue({
      name: 'dynamicQueue',
    }),*/
  ],
  providers: [QueueService,],
  exports: [QueueService,],
  controllers: [QueueController],
})
export class QueueModule { }
