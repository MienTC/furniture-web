import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types/index.js';

export interface IProductDocument extends IProduct, Document {
  _id: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_Product_ID: {
      type: String,
      required: true,
      index: true,
    },
    category_id: {
      type: String,
      required: true,
      ref: 'Ls_Categories',
      index: true,
    },
    category_name: {
      type: String,
      default: '',
    },
    s_Name: {
      type: String,
      required: true,
      trim: true,
      index: 'text',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    short_description: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    original_price: {
      type: Number,
      default: 0,
    },
    discount_percent: {
      type: Number,
      default: 0,
    },
    dimensions: {
      type: String,
      default: '',
    },
    material: {
      type: String,
      default: '',
      index: true,
    },
    color_options: {
      type: [String],
      default: [],
    },
    origin: {
      type: String,
      default: '',
    },
    warranty: {
      type: String,
      default: '',
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    avg_rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    is_featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    is_new: {
      type: Boolean,
      default: false,
    },
    is_best_seller: {
      type: Boolean,
      default: false,
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    stock_quantity: {
      type: Number,
      default: 0,
    },
    in_stock: {
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

export const ProductModel = mongoose.model<IProductDocument>('LS_Products', ProductSchema);
