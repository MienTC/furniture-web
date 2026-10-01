import mongoose, { Schema, Document } from 'mongoose';
import { IVoucherUsage } from '../types/index.js';

export interface IVoucherUsageDocument extends IVoucherUsage, Document {
  _id: mongoose.Types.ObjectId;
}

const VoucherUsageSchema = new Schema<IVoucherUsageDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    voucher_id: {
      type: String,
      required: true,
      ref: 'LS_Vouchers',
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      ref: 'Ls_users',
      index: true,
    },
    order_id: {
      type: String,
      required: true,
      ref: 'LS_Orders',
    },
    discount_applied: {
      type: Number,
      required: true,
      min: 0,
    },
    dt_used: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

export const VoucherUsageModel = mongoose.model<IVoucherUsageDocument>(
  'LS_VoucherUsages',
  VoucherUsageSchema
);
