import { AuthController } from "./controllers/AuthController.js";
import { MongoUserRepository } from "./repositories/MongoUserRepository.js";
import { AuthService } from "./services/AuthService.js";
import { RedisOtpService } from "./services/RedisOtpService.js";
import { MongoPdfRepository } from "./repositories/MongoPdfRepository.js";
import { S3StorageService } from "./services/S3StorageService.js";
import { PdfService } from "./services/PdfService.js";
import { PdfController } from "./controllers/PdfController.js";
import { AuthMiddleware } from "./middlewares/AuthMiddleware.js";
import { EmailService } from "./services/EmailService.js";
import { env } from "./config/Env.js";

// Shared Infrastructure
const storageService = new S3StorageService(
  env.S3_REGION,
  env.S3_ACCESS_KEY,
  env.S3_SECRET_KEY,
  env.S3_BUCKET_NAME
);

const authMiddleware = new AuthMiddleware(env.JWT_ACCESS_SECRET);
const emailService = new EmailService();

// Repositories
const userRepository = new MongoUserRepository();
const pdfRepository = new MongoPdfRepository();

// Services
const otpService = new RedisOtpService();
const authService = new AuthService(userRepository, otpService, emailService);
const pdfService = new PdfService(pdfRepository, storageService);

// Controllers
export const authController = new AuthController(authService);
export const pdfController = new PdfController(pdfService);

// Middleware
export { authMiddleware };
