export interface IOtpService {
  generateOtp(email: string): Promise<string>;
  verifyOtp(email: string, code: string): Promise<boolean>;
  deleteOtp(email: string): Promise<void>;
}