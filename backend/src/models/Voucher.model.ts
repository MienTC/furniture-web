import mongoose, { Schema, Document } from 'mongoose';
import { IVoucher } from '../types/index.js';

export interface IVoucherDocument extends IVoucher, Document {
  _id: mongoose.Types.ObjectId;
}

const VoucherSchema = new Schema<IVoucherDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discount_type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
      min: 0,
    },
    min_order_value: {
      type: Number,
      default: 0,
    },
    max_discount: {
      type: Number,
      default: 0,
    },
    usage_limit: {
      type: Number,
      default: 1000,
    },
    usage_count: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
      default: null,
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

export const VoucherModel = mongoose.model<IVoucherDocument>('LS_Vouchers', VoucherSchema);
