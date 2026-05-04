import type { IPdf } from '../../models/PdfModel.js';

export class PdfMapper {
  static toResponseDTO(pdf: IPdf) {
    return {
      id: pdf.id,
      originalName: pdf.originalName,
      size: pdf.size,
      pageCount: pdf.pageCount,
      createdAt: pdf.createdAt,
    };
  }
}
