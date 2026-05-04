import { BaseMongoRepository } from './MongoBaseRepository.js';
import PdfModel from '../models/PdfModel.js';
import type { IPdf } from '../models/PdfModel.js';
import type { IPdfRepository } from '../interfaces/IPdfRepository.js';

export class MongoPdfRepository extends BaseMongoRepository<IPdf> implements IPdfRepository {
  constructor() {
    super(PdfModel);
  }

  async findByUserId(userId: string): Promise<IPdf[]> {
    return await this.findAll({ userId });
  }
}
