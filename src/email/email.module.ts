import { Module } from "@nestjs/common";
import { MailController } from "./email.controller";
import { MailService } from "./email.service";

@Module({
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule { }
