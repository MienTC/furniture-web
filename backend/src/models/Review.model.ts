import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../types/index.js';

export interface IReviewDocument extends IReview, Document {
  _id: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    product_id: {
      type: String,
      required: true,
      ref: 'LS_Products',
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      ref: 'Ls_users',
      index: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    user_avatar: {
      type: String,
      default: '',
    },
    order_id: {
      type: String,
      default: null,
      ref: 'LS_Orders',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    verified_purchase: {
      type: Boolean,
      default: false,
    },
    is_approved: {
      type: Boolean,
      default: true,
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

export const ReviewModel = mongoose.model<IReviewDocument>('LS_Reviews', ReviewSchema);
