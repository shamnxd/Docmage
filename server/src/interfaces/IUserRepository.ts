import type { IUser } from "../models/UserModel";
import type { IBaseRepository } from "./IBaseRepository";
export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}