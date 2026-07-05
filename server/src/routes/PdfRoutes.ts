import { Router } from 'express';
import multer from 'multer';
import type { PdfController } from '../controllers/PdfController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validate } from '../middlewares/ValidationMiddleware';
import { extractPagesSchema } from '../dtos/PdfDto';
import { paginationSchema } from '../dtos/PaginationDto';
import { ROUTES } from '../utils/constants/Routes';
const upload = multer({ storage: multer.memoryStorage() });
export class PdfRoutes {
  public router = Router();
  constructor(
    private readonly pdfController: PdfController,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.use(this.authMiddleware.handle);
    this.router.post(ROUTES.PDF.UPLOAD, upload.single('pdf'), this.pdfController.upload);
    this.router.get(ROUTES.PDF.LIST, validate(paginationSchema), this.pdfController.list);
    this.router.post(ROUTES.PDF.EXTRACT, validate(extractPagesSchema), this.pdfController.extract);
    this.router.get(ROUTES.PDF.DOWNLOAD, this.pdfController.download);
    this.router.delete(ROUTES.PDF.DELETE, this.pdfController.delete);
  }
}