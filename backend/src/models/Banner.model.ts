import mongoose, { Schema, Document } from 'mongoose';
import { IBanner } from '../types/index.js';

export interface IBannerDocument extends IBanner, Document {
  _id: mongoose.Types.ObjectId;
}

const BannerSchema = new Schema<IBannerDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    link_url: {
      type: String,
      default: '',
    },
    badge_text: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['hero', 'showcase', 'trustbar'],
      default: 'hero',
      index: true,
    },
    icon_name: {
      type: String,
      default: '',
    },
    sort_order: {
      type: Number,
      default: 0,
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
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

export const BannerModel = mongoose.model<IBannerDocument>('LS_Banners', BannerSchema);
