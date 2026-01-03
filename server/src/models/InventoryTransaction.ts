import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryTransaction extends Document {
  productId: mongoose.Types.ObjectId;
  barcode: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason: "PURCHASE" | "SALE" | "RETURN" | "DAMAGE";
  note?: string;
  performedBy: "ADMIN" | "STAFF";
  createdAt: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    barcode: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT", "ADJUST"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      enum: ["PURCHASE", "SALE", "RETURN", "DAMAGE"],
      required: true,
    },

    note: {
      type: String,
    },

    performedBy: {
      type: String,
      enum: ["ADMIN", "STAFF"],
      default: "ADMIN",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInventoryTransaction>(
  "InventoryTransaction",
  InventoryTransactionSchema
);
