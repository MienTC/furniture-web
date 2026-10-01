import mongoose, { Document, Schema } from 'mongoose';

export interface ILeadDocument extends Document {
  s_ID: string;
  phone: string;
  source: string;
  customer_message: string;
  status: 'new' | 'contacted' | 'cancelled';
  dt_create: Date;
  dt_edit: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    s_ID: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    source: { type: String, default: 'ai_chatbot' },
    customer_message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'cancelled'], default: 'new' },
    dt_create: { type: Date, default: Date.now },
    dt_edit: { type: Date, default: Date.now },
  },
  { collection: 'ls_leads' }
);

export const LeadModel = mongoose.model<ILeadDocument>('Lead', LeadSchema);
