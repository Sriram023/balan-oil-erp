import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  brand?: string;
  category: string;
  unit: "Litre" | "Kg" | "Piece";
  barcode: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    category: { type: String, required: true },

    unit: {
      type: String,
      enum: ["Litre", "Kg", "Piece"],
      required: true,
    },

    barcode: {
      type: String,
      required: true,
      unique: true, // 🔐 CRITICAL
      index: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },

    stock: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
