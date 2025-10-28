import mongoose from "mongoose";
import dotenv from "dotenv";
import Manufacturer from "./models/Manufacturer.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected!");

    const manufacturer = new Manufacturer({
      name: "ABC Oils",
      creditGiven: 10000,
      paidAmount: 5000,
    });

    const saved = await manufacturer.save();
    console.log("✅ Manufacturer added:", saved);

    process.exit(0); // Exit after saving
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

seed();
