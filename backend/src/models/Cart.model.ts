import mongoose, { Schema, Document } from 'mongoose';
import { ICart } from '../types/index.js';

export interface ICartDocument extends ICart, Document {
  _id: mongoose.Types.ObjectId;
}

const CartSchema = new Schema<ICartDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      ref: 'Ls_users',
      unique: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'dt_create',
      updatedAt: 'dt_edit',
    },
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

export const CartModel = mongoose.model<ICartDocument>('LS_Carts', CartSchema);
