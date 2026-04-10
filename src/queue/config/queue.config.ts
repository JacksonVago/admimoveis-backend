import { BullModule } from '@nestjs/bullmq';
import { EnvService } from '../../env/env.service';
import { envSChema } from '@/env/env';

const PORT:number | undefined = parseInt(process.env.REDIS_PORT == void 0 ? "0" : process.env.REDIS_PORT);

export const queueConfig = BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST,
    port: PORT,
  },
  defaultJobOptions: {
    removeOnComplete: 1000,
    removeOnFail: 5000,
    attempts: 3,
  },
});
