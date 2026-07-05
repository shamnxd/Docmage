import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';
export interface IPdf extends Document {
  id: string;
  userId: string;
  originalName: string;
  storageKey: string;
  size: number;
  pageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
const pdfSchema = new Schema<IPdf>(
  {
    userId: { 
      type: String, 
      required: true,
      index: true
    },
    originalName: { 
      type: String, 
      required: true 
    },
    storageKey: { 
      type: String, 
      required: true 
    },
    size: { 
      type: Number, 
      required: true 
    },
    pageCount: { 
      type: Number, 
      required: true 
    },
  },
  { timestamps: true }
);
const PdfModel = model<IPdf>('Pdf', pdfSchema);
export default PdfModel;