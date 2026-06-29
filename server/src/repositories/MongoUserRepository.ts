import UserModel from "../models/UserModel";
import type { IUser } from "../models/UserModel";
import { BaseMongoRepository } from "./MongoBaseRepository";
import type { IUserRepository } from "../interfaces/IUserRepository";

export class MongoUserRepository extends BaseMongoRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }
}
