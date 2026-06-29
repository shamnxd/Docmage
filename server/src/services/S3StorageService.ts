import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { IFileStorageService } from '../interfaces/IFileStorage';
import crypto from 'crypto';
import { Logger } from '../utils/Logger';

export class S3StorageService implements IFileStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(region: string, accessKeyId: string, secretAccessKey: string, bucketName: string) {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop() || 'pdf';
    const storageKey = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    Logger.info(`[S3]: File uploaded successfully with key: ${storageKey}`);
    return storageKey;
  }

  async uploadBuffer(buffer: Buffer, mimetype: string, fileExtension: string): Promise<string> {
    const storageKey = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: storageKey,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    Logger.info(`[S3]: Buffer uploaded successfully with key: ${storageKey}`);
    return storageKey;
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const byteArray = await response.Body?.transformToByteArray();
    if (!byteArray) throw new Error('Could not get file buffer');
    return Buffer.from(byteArray);
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
    Logger.info(`[S3]: File deleted successfully with key: ${key}`);
  }
}
