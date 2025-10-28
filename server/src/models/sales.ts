import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Sale", SaleSchema);
