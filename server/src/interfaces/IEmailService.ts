export interface IEmailService {
  sendOtp(email: string, otp: string): Promise<void>;
  sendPasswordResetLink(email: string, token: string): Promise<void>;
}
