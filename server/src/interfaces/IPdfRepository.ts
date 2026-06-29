import type { IPdf } from "../models/PdfModel";
import type { IBaseRepository } from "./IBaseRepository";

export interface IPdfRepository extends IBaseRepository<IPdf> {
  findByUserId(userId: string): Promise<IPdf[]>;
}
