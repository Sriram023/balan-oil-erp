import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creditGiven: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },

  paymentHistory: {
    type: [
      {
        amount: Number,
        date: String,
        note: String,
      },
    ],
    default: [],
  },

  creditHistory: {
    type: [
      {
        amount: Number,
        date: String,
        note: String,
      },
    ],
    default: [],
  },

  products: {
    type: [
      {
        name: String,
        quantity: Number,
        rate: Number,
        total: Number,
        date: String,
      },
    ],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
});

// 🧠 Auto-calculate balance before save
ManufacturerSchema.pre("save", function (next) {
  this.balance = this.creditGiven - this.paidAmount;
  next();
});

const Manufacturer = mongoose.model("Manufacturer", ManufacturerSchema);
export default Manufacturer;
