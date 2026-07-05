import nodemailer from 'nodemailer';
import { env } from '../config/Env';
import { Logger } from '../utils/Logger';
import type { IEmailService } from '../interfaces/IEmailService';
import { getOtpTemplate, getPasswordResetTemplate } from '../templates/EmailTemplates';
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }
  async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"DocMage" <${env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your DocMage Account',
      html: getOtpTemplate(otp),
    };
    try {
      await this.transporter.sendMail(mailOptions);
      Logger.info(`[EmailService]: OTP sent to ${email}`);
    } catch (error) {
      Logger.error(`[EmailService]: Failed to send OTP to ${email}`, error);
      throw new Error('Failed to send verification email', { cause: error });
    }
  }
  async sendPasswordResetLink(email: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: `"DocMage" <${env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your DocMage Password',
      html: getPasswordResetTemplate(resetUrl),
    };
    try {
      await this.transporter.sendMail(mailOptions);
      Logger.info(`[EmailService]: Password reset link sent to ${email}`);
    } catch (error) {
      Logger.error(`[EmailService]: Failed to send password reset link to ${email}`, error);
      throw new Error('Failed to send password reset email', { cause: error });
    }
  }
}