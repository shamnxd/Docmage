import type { Response, NextFunction } from 'express';
import { PdfService } from '../services/PdfService.js';
import { PdfMapper } from '../utils/mappers/PdfMapper.js';
import { HttpStatus } from '../utils/constants/HttpStatus.js';
import { ErrorMessages, SuccessMessages } from '../utils/constants/Messages.js';
import { AppError } from '../utils/errors/AppError.js';
import type { AuthRequest } from '../middlewares/AuthMiddleware.js';
import type { PaginationQuery } from '../dtos/PaginationDto.js';

export class PdfController {
  constructor(private readonly pdfService: PdfService) { }

  public upload = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(ErrorMessages.NO_FILE_UPLOADED, HttpStatus.BAD_REQUEST);
      }

      const pdf = await this.pdfService.uploadPdf(req.user!.userId, req.file);
      res.status(HttpStatus.CREATED).json({
        status: 'success',
        message: SuccessMessages.PDF_UPLOADED,
        data: PdfMapper.toResponseDTO(pdf),
      });
    } catch (error) {
      next(error);
    }
  };

  public list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as PaginationQuery;
      const result = await this.pdfService.getUserPdfs(req.user!.userId, query);

      res.status(HttpStatus.OK).json({
        status: 'success',
        data: {
          pdfs: result.data.map(PdfMapper.toResponseDTO),
          pagination: {
            total: result.total,
            page: result.page,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await this.pdfService.deletePdf(req.user!.userId, id);
      res.status(HttpStatus.OK).json({
        status: 'success',
        message: SuccessMessages.PDF_DELETED,
      });
    } catch (error) {
      next(error);
    }
  };

  public extract = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { pageIndices, newFileName } = req.body;

      if (!Array.isArray(pageIndices) || pageIndices.length === 0) {
        throw new AppError(ErrorMessages.INVALID_PAGE_INDICES, HttpStatus.BAD_REQUEST);
      }
      
      if (!newFileName) {
        throw new AppError("New file name is required", HttpStatus.BAD_REQUEST);
      }

      await this.pdfService.extractPages(req.user!.userId, id, pageIndices, newFileName);

      res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'PDF extracted and saved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public download = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { buffer, fileName } = await this.pdfService.getPdfBuffer(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      next(error);
    }
  };
}
