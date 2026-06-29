import { BaseMongoRepository } from './MongoBaseRepository';
import PdfModel from '../models/PdfModel';
import type { IPdf } from '../models/PdfModel';
import type { IPdfRepository } from '../interfaces/IPdfRepository';

export class MongoPdfRepository extends BaseMongoRepository<IPdf> implements IPdfRepository {
  constructor() {
    super(PdfModel);
  }

  async findByUserId(userId: string): Promise<IPdf[]> {
    return await this.findAll({ userId });
  }
}
