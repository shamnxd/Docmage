import { env } from "../config/Env.js";
import redisClient from "../config/Redis.js";
import type { IOtpService } from "../interfaces/IOtpService.js";

export class RedisOtpService implements IOtpService {
  private readonly EXPIRY = env.OTP_EXPIRY_SECONDS;

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setEx(`otp:${email}`, this.EXPIRY, otp);

    return otp;
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const cachedOtp = await redisClient.get(`otp:${email}`);
    return cachedOtp === code;
  }

  async deleteOtp(email: string): Promise<void> {
    await redisClient.del(`otp:${email}`);
  }
}
