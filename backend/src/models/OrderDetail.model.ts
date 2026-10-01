import mongoose, { Schema, Document } from 'mongoose';
import { IOrderDetail } from '../types/index.js';

export interface IOrderDetailDocument extends IOrderDetail, Document {
  _id: mongoose.Types.ObjectId;
}

const OrderDetailSchema = new Schema<IOrderDetailDocument>(
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
      ref: 'LS_Orders',
      index: true,
    },
    s_product_id: {
      type: String,
      required: true,
      ref: 'LS_Products',
      index: true,
    },
    s_variant_id: {
      type: String,
      default: null,
      ref: 'LS_ProductVariants',
    },
    product_name: {
      type: String,
      required: true,
    },
    variant_name: {
      type: String,
      default: '',
    },
    selected_color: {
      type: String,
      default: '',
    },
    image_url: {
      type: String,
      default: '',
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    line_total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'dt_created',
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

export const OrderDetailModel = mongoose.model<IOrderDetailDocument>(
  'PR_OrderDetail',
  OrderDetailSchema
);
