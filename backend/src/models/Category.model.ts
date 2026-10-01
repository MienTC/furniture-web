import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../types/index.js';

export interface ICategoryDocument extends ICategory, Document {
  _id: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_parent_category_id: {
      type: String,
      default: null,
      index: true,
    },
    s_Name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    item_count: {
      type: Number,
      default: 0,
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

export const CategoryModel = mongoose.model<ICategoryDocument>('Ls_Categories', CategorySchema);
