import mongoose, { Schema, Document } from 'mongoose';
import { ICartItem } from '../types/index.js';

export interface ICartItemDocument extends ICartItem, Document {
  _id: mongoose.Types.ObjectId;
}

const CartItemSchema = new Schema<ICartItemDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    s_cart_id: {
      type: String,
      required: true,
      ref: 'LS_Carts',
      index: true,
    },
    product_id: {
      type: String,
      required: true,
      ref: 'LS_Products',
      index: true,
    },
    variant_id: {
      type: String,
      default: null,
      ref: 'LS_ProductVariants',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    selected_color: {
      type: String,
      default: '',
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

// One variant/product per cart constraint
CartItemSchema.index({ s_cart_id: 1, product_id: 1, selected_color: 1 }, { unique: true });

export const CartItemModel = mongoose.model<ICartItemDocument>('PR_CartItems', CartItemSchema);
