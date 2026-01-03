import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

dotenv.config();
mongoose.set("strictQuery", true);

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(
  cors({
    origin: "*", // restrict later to frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* ---------------- ROUTES ---------------- */
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/inventory", inventoryRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (_req, res) => {
  res.send("✅ BM Oils Backend is running!");
});

/* ---------------- DB + SERVER ---------------- */
const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://sriramravichandran7_db_user:Sriram%23023@internal-management.lih7pql.mongodb.net/Internal-management?retryWrites=true&w=majority&appName=Internal-management";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
