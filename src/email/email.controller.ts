import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './email.service';

@Controller('emails')
export class MailController {
    constructor(
        private readonly mailService: MailService,
    ) { }

    @Post('send-email')
    async sendMail(
        @Body() sendMailDto: { email: string; subject: string; text?: string },
    ): Promise<string> {
        await this.mailService.sendMail(sendMailDto);

        return 'Email sent successfully';
    }
}