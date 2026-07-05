import type { Model, Document } from 'mongoose';
import type { IBaseRepository, PaginationResult } from '../interfaces/IBaseRepository';
export abstract class BaseMongoRepository<T extends Document> implements IBaseRepository<T> {
  protected constructor(protected readonly model: Model<T>) { }
  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return await entity.save();
  }
  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }
  async findOne(filter: object): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }
  async findAll(filter: object = {}): Promise<T[]> {
    return await this.model.find(filter).exec();
  }
  async findWithPagination(
    filter: object,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<PaginationResult<T>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}