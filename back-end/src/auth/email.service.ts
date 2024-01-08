import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'neonpong777@gmail.com',
        pass: 'wlec zpxw wiie gpts',
      },
    });
  }

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
          from: 'neonpong777@gmail.com',
          to,
          subject,
          html,
        };

        await this.transporter.sendMail(mailOptions);

  }
}
