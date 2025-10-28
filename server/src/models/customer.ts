import mongoose, { Schema, Document } from "mongoose";

interface Product {
  name: string;
  quantity: number;
  rate: number;
  total: number;
  date: string;
}

interface Transaction {
  amount: number;
  date: string;
  note?: string;
}

export interface ICustomer extends Document {
  name: string;
  creditGiven: number;
  paidAmount: number;
  balance: number;
  paymentHistory: Transaction[];
  creditHistory: Transaction[];
  products: Product[];
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  creditGiven: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  balance: {
    type: Number,
    default: function (this: any) {
      return this.creditGiven - this.paidAmount;
    },
  },
  paymentHistory: [
    {
      amount: Number,
      date: String,
      note: String,
    },
  ],
  creditHistory: [
    {
      amount: Number,
      date: String,
      note: String,
    },
  ],
  products: [
    {
      name: String,
      quantity: Number,
      rate: Number,
      total: Number,
      date: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;
