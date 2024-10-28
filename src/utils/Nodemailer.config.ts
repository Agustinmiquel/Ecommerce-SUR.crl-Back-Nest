import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class EmailConfig {
  logger = new Logger(EmailConfig.name);
  constructor(private readonly emailService: MailerService) {}
  async sendEmail(email: string, user: string) {
    const message =
      'Bienvenido a la tienda online de productos mayoristas DEL SUR C.R.L';

    try {
      this.emailService.sendMail({
        from: 'DEL SUR C.R.L',
        to: email,
        subject: `Primera compra, FELICIDADES`,
        text: message,
        template: 'welcome',
        context: {
          title:
            'Bienvenido a la tienda online de productos mayoristas DEL SUR C.R.L',
          message: `Bienvenido ${user}!, a este correo vas a estar recibiendo los comprobantes de compras`,
        },
        attachments: [
          {
            filename: 'logo.png',
            path: join(__dirname, '..', 'utils', 'logo.png'),
            cid: 'logo',
          },
        ],
      });
      this.logger.log('El email fue enviado');
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
