import mongoose, { Schema, Document } from 'mongoose';
import { IWishlist } from '../types/index.js';

export interface IWishlistDocument extends IWishlist, Document {
  _id: mongoose.Types.ObjectId;
}

const WishlistSchema = new Schema<IWishlistDocument>(
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
      index: true,
    },
    product_id: {
      type: String,
      required: true,
      ref: 'LS_Products',
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'dt_create',
      updatedAt: false,
    },
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export const WishlistModel = mongoose.model<IWishlistDocument>('LS_Wishlist', WishlistSchema);
