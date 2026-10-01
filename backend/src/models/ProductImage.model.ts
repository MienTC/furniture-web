import mongoose, { Schema, Document } from 'mongoose';
import { IProductImage } from '../types/index.js';

export interface IProductImageDocument extends IProductImage, Document {
  _id: mongoose.Types.ObjectId;
}

const ProductImageSchema = new Schema<IProductImageDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_product_ID: {
      type: String,
      required: true,
      ref: 'LS_Products',
      index: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    alt_text: {
      type: String,
      default: '',
    },
    sort_order: {
      type: Number,
      default: 0,
      index: true,
    },
    is_primary: {
      type: Boolean,
      default: false,
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

export const ProductImageModel = mongoose.model<IProductImageDocument>(
  'LS_ProductImages',
  ProductImageSchema
);
