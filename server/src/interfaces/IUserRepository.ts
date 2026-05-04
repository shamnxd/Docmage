import type { IUser } from "../models/UserModel.js";
import type { IBaseRepository } from "./IBaseRepository.js";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
