import { Router } from 'express';
import { authController, authMiddleware } from '../Container';
import { validate } from '../middlewares/ValidationMiddleware';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema
} from '../dtos/AuthDto.js';
import { ROUTES } from '../utils/constants/Routes';
const router = Router();
router.post(ROUTES.AUTH.REGISTER, validate(registerSchema), authController.register);
router.post(ROUTES.AUTH.VERIFY, validate(verifyOtpSchema), authController.verify);
router.post(ROUTES.AUTH.LOGIN, validate(loginSchema), authController.login);
router.post(ROUTES.AUTH.GOOGLE_LOGIN, validate(googleLoginSchema), authController.googleLogin);
router.post(ROUTES.AUTH.REFRESH, authController.refresh);
router.post(ROUTES.AUTH.FORGOT_PASSWORD, validate(forgotPasswordSchema), authController.forgotPassword);
router.post(ROUTES.AUTH.RESET_PASSWORD, validate(resetPasswordSchema), authController.resetPassword);
router.post(ROUTES.AUTH.RESEND_OTP, validate(forgotPasswordSchema), authController.resendOtp);
router.post(ROUTES.AUTH.LOGOUT, authMiddleware.handle, authController.logout);
export default router;