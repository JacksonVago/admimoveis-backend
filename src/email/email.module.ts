import { EnvModule } from "@/env/env.module";
import { FilesModule } from "@/files/files.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { MailController } from "./email.controller";
import { MailService } from "./email.service";

@Module({
    imports: [EnvModule, PrismaModule, FilesModule,
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
