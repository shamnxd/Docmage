export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: object): Promise<T | null>;
  findAll(filter?: object): Promise<T[]>;
  findWithPagination(
    filter: object,
    page: number,
    limit: number,
    sort?: Record<string, 1 | -1>
  ): Promise<PaginationResult<T>>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
