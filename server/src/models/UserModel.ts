import type { Document } from 'mongoose';
import { Schema, model } from 'mongoose';
export interface IUser extends Document {
  id: string;
  email: string;
  password?: string;
  name?: string;
  isVerified: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<IUser>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    name: {
      type: String
    },
    refreshToken: { 
      type: String 
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
  },
  { timestamps: true }
);
const UserModel = model<IUser>('User', userSchema);
export default UserModel;