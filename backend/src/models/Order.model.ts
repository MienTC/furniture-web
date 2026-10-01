import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types/index.js';

export interface IOrderDocument extends IOrder, Document {
  _id: mongoose.Types.ObjectId;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_order_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_user_id: {
      type: String,
      required: true,
      ref: 'Ls_users',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    payment_method: {
      type: String,
      enum: ['cod', 'bank_transfer', 'credit_card'],
      default: 'cod',
    },
    payment_status: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
      index: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping_fee: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    voucher_code: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    // Shipping address snapshot
    recipient_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    address_line: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: {
      createdAt: 'dt_created',
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

export const OrderModel = mongoose.model<IOrderDocument>('LS_Orders', OrderSchema);
