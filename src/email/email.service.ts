import { EnvService } from '@/env/env.service';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SendMailConfiguration {
    email: string;
    subject: string;
    text?: string;
    //template: any;
}

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private envService: EnvService) {

        //Buscar dados de acessos 

        const PORT: number | undefined = parseInt(this.envService.get('SMTP_PORT').toString() == void 0 ? "0" : this.envService.get('SMTP_PORT').toString());

        this.transporter = nodemailer.createTransport(
            {
                host: this.envService.get('SMTP_HOST').toString(),
                port: PORT,
                secure: true,
                auth: {
                    user: this.envService.get('SMTP_USER').toString(),
                    pass: this.envService.get('SMTP_PASSWORD').toString(),
                    //user: 'jackson@natividadesolucoes.com.br',
                    //pass: 'JjmlS2021@',
                },
                tls: {
                    rejectUnauthorized: false
                },
            },
            {
                from: {
                    name: 'NestJs + React Emails Test App',
                    address: 'Test App',
                },
            },
        );
    }

    async sendMail({ email, subject, text }: SendMailConfiguration) {

        this.transporter.sendMail(
            {
                from: "suporte@natividadesolucoes.com.br",
                to: email,
                subject: subject,
                text: text || "I hope this message gets delivered!",
            },
            (err, info) => {
                if (err) {
                    console.error('erro', err);
                    return;
                }
                console.log(info.envelope);
                console.log(info.messageId);
            }
        );


        /*await this.transporter.sendMail({
            to: email,
            subject,
            html,
        });*/
    }
}