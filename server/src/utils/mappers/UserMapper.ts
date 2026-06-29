import type { IUser } from '../../models/UserModel';

export class UserMapper {
  static toResponseDTO(user: IUser) {
    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
