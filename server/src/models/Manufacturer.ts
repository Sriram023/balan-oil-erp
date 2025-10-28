import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creditGiven: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  balance: {
    type: Number,
    default: function () {
      return this.creditGiven - this.paidAmount;
    },
  },
  paymentHistory: {
    type: [
      {
        amount: Number,
        date: String,
        note: String,
      },
    ],
    default: [], // ✅ ensures it's always an array
  },
  creditHistory: {
    type: [
      {
        amount: Number,
        date: String,
        note: String,
      },
    ],
    default: [], // ✅ ensures it's always an array
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

const Manufacturer = mongoose.model("Manufacturer", ManufacturerSchema);
export default Manufacturer;
