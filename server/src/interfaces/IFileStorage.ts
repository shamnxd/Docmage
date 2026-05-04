export interface IFileStorageService {
  uploadFile(file: Express.Multer.File): Promise<string>;
  uploadBuffer(buffer: Buffer, mimetype: string, fileExtension: string): Promise<string>;
  getPresignedUrl(key: string): Promise<string>;
  getFileBuffer(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
}
