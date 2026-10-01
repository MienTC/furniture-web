import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/index.js';

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_user: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    s_PWD: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    avatar_url: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      index: true,
    },
    status: {
      type: Boolean,
      default: true, // true = active, false = blocked
    },
    refresh_token: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: {
      createdAt: 'dt_create',
      updatedAt: 'dt_edit',
    },
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).s_PWD;
        delete (ret as any).refresh_token;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>('Ls_users', UserSchema);
