import { EnvModule } from "@/env/env.module";
import { Module } from "@nestjs/common";
import { MailController } from "./email.controller";
import { MailService } from "./email.service";

@Module({
    imports: [EnvModule],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
