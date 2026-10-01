import mongoose, { Schema, Document } from 'mongoose';
import { IAddress } from '../types/index.js';

export interface IAddressDocument extends IAddress, Document {
  _id: mongoose.Types.ObjectId;
}

const AddressSchema = new Schema<IAddressDocument>(
  {
    s_ID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      ref: 'Ls_users',
      index: true,
    },
    recipient_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
      default: '',
    },
    address_line: {
      type: String,
      required: true,
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: false,
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

export const AddressModel = mongoose.model<IAddressDocument>('LS_Address', AddressSchema);
