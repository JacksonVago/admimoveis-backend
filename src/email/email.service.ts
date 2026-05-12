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

    constructor() {
        this.transporter = nodemailer.createTransport(
            {
                host: 'email-ssl.com.br', //'smtp.natividadesolucoes.com.br',
                port: 465,
                secure: true,
                auth: {
                    user: 'suporte@natividadesolucoes.com.br',
                    pass: 'Suporte@2020',
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