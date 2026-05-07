import bcrypt from 'bcryptjs';
import axios from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { IAuthService } from '../interfaces/IAuthService.js';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
import type { IOtpService } from '../interfaces/IOtpService.js';
import type { RegisterRequestDto, LoginResponseDto } from '../dtos/AuthDto.js';
import { AppError } from '../utils/errors/AppError.js';
import { HttpStatus } from '../utils/constants/HttpStatus.js';
import { ErrorMessages, SuccessMessages } from '../utils/constants/Messages.js';
import { env } from '../config/Env.js';
import { Logger } from '../utils/Logger.js';

import type { IEmailService } from '../interfaces/IEmailService.js';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private otpService: IOtpService,
    private emailService: IEmailService
  ) { }

  async register(data: RegisterRequestDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      if (existingUser.isVerified) {
        throw AppError.conflict(ErrorMessages.USER_EXISTS);
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.userRepository.update(existingUser.id!, { 
        password: hashedPassword,
        name: data.name 
      });
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await this.userRepository.create({
        email: data.email,
        name: data.name,
        password: hashedPassword,
        isVerified: false
      });
    }

    const otp = await this.otpService.generateOtp(data.email);
    await this.emailService.sendOtp(data.email, otp);

    return { message: SuccessMessages.OTP_SENT };
  }

  async resendOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw AppError.notFound(ErrorMessages.USER_NOT_FOUND);
    if (user.isVerified) throw AppError.badRequest("User already verified");

    const otp = await this.otpService.generateOtp(email);
    await this.emailService.sendOtp(email, otp);

    return { message: SuccessMessages.OTP_SENT };
  }

  async verifyAndRegister(email: string, otp: string): Promise<LoginResponseDto> {
    const isValid = await this.otpService.verifyOtp(email, otp);
    if (!isValid) throw AppError.badRequest(ErrorMessages.INVALID_OTP);

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw AppError.notFound(ErrorMessages.USER_NOT_FOUND);

    await this.userRepository.update(user.id!, { isVerified: true });
    await this.otpService.deleteOtp(email);

    return this.generateTokens(user.id!, user.email);
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized(ErrorMessages.INVALID_CREDENTIALS);
    }
    if (!user.isVerified) {
      throw AppError.unauthorized(ErrorMessages.ACCOUNT_UNVERIFIED);
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) throw AppError.unauthorized(ErrorMessages.INVALID_CREDENTIALS);

    return this.generateTokens(user.id!, user.email);
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: "" });
  }

  async refresh(token: string): Promise<{ accessToken: string; user: { id: string; email: string; name?: string } }> {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
      const user = await this.userRepository.findById(decoded.userId);
 
      if (!user || user.refreshToken !== token) {
        throw AppError.unauthorized();
      }
 
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
 
      return { 
        accessToken, 
        user: { 
          id: user.id!, 
          email: user.email,
          name: user.name 
        } 
      };
    } catch (error) {
      throw AppError.unauthorized();
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw AppError.notFound(ErrorMessages.USER_NOT_FOUND);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await this.userRepository.update(user.id!, {
      resetPasswordToken,
      resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
    });

    await this.emailService.sendPasswordResetLink(email, resetToken);

    return { message: SuccessMessages.PASSWORD_RESET_SENT };
  }

  async resetPassword(token: string, password: string) {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await this.userRepository.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw AppError.badRequest('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(user.id!, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });

    return { message: 'Password reset successful' };
  }

  async googleLogin(token: string): Promise<LoginResponseDto> {
    try {
      // Fetch user info from Google using the access token
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payload = response.data;
      if (!payload || !payload.email) {
        throw AppError.badRequest('Invalid Google token');
      }

      const { email, name, given_name } = payload;
      const displayName = name || given_name || email.split('@')[0];

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        // Create new user for social login
        // We set a random password because password is required in the schema
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        user = await this.userRepository.create({
          email,
          name: displayName,
          password: hashedPassword,
          isVerified: true // Social login users are pre-verified
        });
      } else {
        const updateData: Partial<{ isVerified: boolean; name: string }> = {};
        if (!user.isVerified) updateData.isVerified = true;
        if (!user.name) updateData.name = displayName;
        
        if (Object.keys(updateData).length > 0) {
          await this.userRepository.update(user.id!, updateData);
        }
      }

      return this.generateTokens(user.id!, user.email, displayName);
    } catch (error) {
      Logger.error('[AuthService]: Google login failed', error);
      throw AppError.unauthorized('Google authentication failed');
    }
  }

  private async generateTokens(userId: string, email: string, name?: string): Promise<LoginResponseDto> {
    const accessToken = jwt.sign({ userId, email }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await this.userRepository.update(userId, { refreshToken });

    return { accessToken, refreshToken, user: { id: userId, email, name } };
  }
}
