import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingDocument extends Document {
  key: string;
  value: Record<string, any>;
  dt_create?: Date;
  dt_edit?: Date;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: 'dt_create',
      updatedAt: 'dt_edit',
    },
  }
);

export const SettingModel = mongoose.model<ISettingDocument>('LS_Settings', SettingSchema);
