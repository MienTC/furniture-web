import mongoose, { Schema, Document } from 'mongoose';
import { IProductVariant } from '../types/index.js';

export interface IProductVariantDocument extends IProductVariant, Document {
  _id: mongoose.Types.ObjectId;
}

const ProductVariantSchema = new Schema<IProductVariantDocument>(
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
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    variant_name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    list_price: {
      type: Number,
      default: 0,
    },
    sale_price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock_quantity: {
      type: Number,
      default: 0,
    },
    reserved_quantity: {
      type: Number,
      default: 0,
    },
    is_active: {
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

export const ProductVariantModel = mongoose.model<IProductVariantDocument>(
  'LS_ProductVariants',
  ProductVariantSchema
);
