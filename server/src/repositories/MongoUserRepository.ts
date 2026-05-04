import UserModel from "../models/UserModel.js";
import type { IUser } from "../models/UserModel.js";
import { BaseMongoRepository } from "./MongoBaseRepository.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";

export class MongoUserRepository extends BaseMongoRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ email });
  }
}
