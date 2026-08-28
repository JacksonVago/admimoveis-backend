import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsOptional, IsString } from 'class-validator';
import 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { MailService } from './email.service';

export class EmailDto {

    //email
    @IsOptional()
    @IsString()
    email: string;

    //Subject
    @IsOptional()
    @IsString()
    subject: string;

    //Subject
    @IsOptional()
    @IsString()
    text: string;
}

@Controller('emails')
export class MailController {
    constructor(
        private readonly mailService: MailService,
    ) { }

    @FormDataRequest()
    @Post('send-email/:empresaId')
    async sendMail(
        @Param('empresaId') empresaId: number,
        @Body() sendMailDto: { email: string; subject: string; text?: string },
    ): Promise<string> {
        await this.mailService.sendMail(empresaId, sendMailDto);

        return 'Email sent successfully';
    }

    @Post('sendpdf-email/:empresaId')
    @UseInterceptors(FileInterceptor('pdf'))
    async sendMailPdf(
        @Param('empresaId') empresaId: number,
        @Body() sendMailDto: EmailDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<string> {
        console.log('file:', file);
        await this.mailService.sendMailPDF(empresaId, sendMailDto, file);

        return 'Email sent successfully';
    }
}