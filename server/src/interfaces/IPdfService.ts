import type { IPdf } from "../models/PdfModel";
import type { PaginationQuery } from "../dtos/PaginationDto";
import type { PaginationResult } from "./IBaseRepository";
export interface IPdfService {
  uploadPdf(userId: string, file: Express.Multer.File): Promise<IPdf>;
  getUserPdfs(userId: string, query: PaginationQuery): Promise<PaginationResult<IPdf>>;
  deletePdf(userId: string, pdfId: string): Promise<void>;
  extractPages(
    userId: string,
    pdfId: string,
    pageIndices: number[],
    newFileName: string
  ): Promise<IPdf>;
  getPdfBuffer(pdfId: string): Promise<{ buffer: Buffer; fileName: string }>;
}