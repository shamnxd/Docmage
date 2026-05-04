import type { LoginResponseDto, RegisterRequestDto } from "../dtos/AuthDto.js";

export interface IAuthService {
  register(data: RegisterRequestDto): Promise<{ message: string }>;
  verifyAndRegister(email: string, otp: string): Promise<LoginResponseDto>;
  login(email: string, password: string): Promise<LoginResponseDto>;
  refresh(token: string): Promise<{ accessToken: string }>;
  logout(userId: string): Promise<void>;
  googleLogin(token: string): Promise<LoginResponseDto>;
  forgotPassword(email: string): Promise<{ message: string }>;
  resetPassword(token: string, password: string): Promise<{ message: string }>;
  resendOtp(email: string): Promise<{ message: string }>;
}
