import { PDFDocument } from 'pdf-lib';
import type { IPdf } from '../models/PdfModel.js';
import type { IPdfRepository } from '../interfaces/IPdfRepository.js';
import type { IFileStorageService } from '../interfaces/IFileStorage.js';
import { AppError } from '../utils/errors/AppError.js';
import { HttpStatus } from '../utils/constants/HttpStatus.js';
import { ErrorMessages } from '../utils/constants/Messages.js';
import type { PaginationQuery } from '../dtos/PaginationDto.js';
import { Logger } from '../utils/Logger.js';

export class PdfService {
  constructor(
    private readonly pdfRepository: IPdfRepository,
    private readonly fileStorageService: IFileStorageService
  ) { }

  async uploadPdf(userId: string, file: Express.Multer.File): Promise<IPdf> {
    try {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const pageCount = pdfDoc.getPageCount();

      const storageKey = await this.fileStorageService.uploadFile(file);

      const pdfData: Partial<IPdf> = {
        userId,
        originalName: file.originalname,
        storageKey,
        size: file.size,
        pageCount,
      };

      return await this.pdfRepository.create(pdfData);
    } catch (error) {
      Logger.error(`[PdfService]: Upload failed:`, error);
      if (error instanceof AppError) throw error;
      throw AppError.internal(ErrorMessages.PDF_PROCESSING_FAILED);
    }
  }

  async getUserPdfs(userId: string, query: PaginationQuery) {
    const filter: Record<string, unknown> = { userId };

    if (query.search) {
      filter.originalName = { $regex: query.search, $options: 'i' };
    }

    const sort: Record<string, 1 | -1> = { [query.sortBy]: query.sortOrder === 'desc' ? -1 : 1 };

    const paginationResult = await this.pdfRepository.findWithPagination(
      filter,
      query.page,
      query.limit,
      sort
    );

    return paginationResult;
  }

  async deletePdf(userId: string, pdfId: string): Promise<void> {
    const pdf = await this.pdfRepository.findById(pdfId);
    if (!pdf) {
      throw AppError.notFound(ErrorMessages.FILE_NOT_FOUND);
    }

    if (pdf.userId !== userId) {
      throw AppError.forbidden(ErrorMessages.UNAUTHORIZED);
    }

    await this.fileStorageService.deleteFile(pdf.storageKey);
    await this.pdfRepository.delete(pdfId);
  }

  async extractPages(userId: string, pdfId: string, pageIndices: number[], newFileName: string): Promise<IPdf> {
    const pdf = await this.pdfRepository.findById(pdfId);
    if (!pdf || pdf.userId !== userId) {
      throw AppError.notFound(ErrorMessages.FILE_NOT_FOUND);
    }

    try {
      const buffer = await this.fileStorageService.getFileBuffer(pdf.storageKey);
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const newBuffer = Buffer.from(pdfBytes);

      const finalName = newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`;
      const storageKey = await this.fileStorageService.uploadBuffer(newBuffer, 'application/pdf', 'pdf');

      return await this.pdfRepository.create({
        userId,
        originalName: finalName,
        storageKey,
        size: newBuffer.length,
        pageCount: copiedPages.length,
      });
    } catch (error) {
      Logger.error(`[PdfService]: Extraction failed:`, error);
      if (error instanceof AppError) throw error;
      throw AppError.internal(ErrorMessages.PDF_PROCESSING_FAILED);
    }
  }

  async getPdfBuffer(pdfId: string): Promise<{ buffer: Buffer; fileName: string }> {
    const pdf = await this.pdfRepository.findById(pdfId);
    if (!pdf) throw AppError.notFound(ErrorMessages.FILE_NOT_FOUND);

    const buffer = await this.fileStorageService.getFileBuffer(pdf.storageKey);
    return { buffer, fileName: pdf.originalName };
  }
}
