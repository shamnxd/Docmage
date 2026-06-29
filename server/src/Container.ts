import { AuthController } from "./controllers/AuthController";
import { MongoUserRepository } from "./repositories/MongoUserRepository";
import { AuthService } from "./services/AuthService";
import { RedisOtpService } from "./services/RedisOtpService";
import { MongoPdfRepository } from "./repositories/MongoPdfRepository";
import { S3StorageService } from "./services/S3StorageService";
import { PdfService } from "./services/PdfService";
import { PdfController } from "./controllers/PdfController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { EmailService } from "./services/EmailService";
import { env } from "./config/Env";

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
