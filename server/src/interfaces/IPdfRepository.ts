import type { IPdf } from "../models/PdfModel.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export interface IPdfRepository extends IBaseRepository<IPdf> {
  findByUserId(userId: string): Promise<IPdf[]>;
}
