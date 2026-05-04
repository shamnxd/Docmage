import "dotenv/config";
import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/Db.js";
import { connectRedis } from "./config/Redis.js";
import { env } from "./config/Env.js";
import { authController, pdfController, authMiddleware } from "./Container.js";
import { PdfRoutes } from "./routes/PdfRoutes.js";
import { globalErrorHandler } from "./middlewares/ErrorMiddleware.js";
import authRoutes from "./routes/AuthRoutes.js";
import { Logger } from "./utils/Logger.js";
import { ROUTES } from "./utils/constants/Routes.js";

class App {
  public app: Application;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = env.PORT;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests from this IP, please try again after 15 minutes",
    });
    this.app.use("/api", limiter);
  }

  private initializeRoutes(): void {
    this.app.use(`${ROUTES.API_BASE}${ROUTES.AUTH.BASE}`, authRoutes);

    const pdfRoutes = new PdfRoutes(pdfController, authMiddleware);
    this.app.use(`${ROUTES.API_BASE}${ROUTES.PDF.BASE}`, pdfRoutes.router);

    this.app.get(ROUTES.HEALTH, (req, res) => {
      res.status(200).json({ status: "UP" });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(globalErrorHandler);
  }

  public async listen(): Promise<void> {
    try {
      await connectDB();
      await connectRedis();

      this.app.listen(this.port, () => {
        Logger.info(`[Server]: Running at http://localhost:${this.port} in ${env.NODE_ENV} mode`);
      });
    } catch (error) {
      Logger.error(`Failed to start server: ${error}`);
      process.exit(1);
    }
  }
}

export default App;
