import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import salesRoutes from "./routes/salesRoutes";
dotenv.config(); // load env first
mongoose.set("strictQuery", true);

const app = express(); // define app first


app.use(express.json());
app.use(
  cors({
    origin: "*", // you can later replace "*" with your real frontend URL like "https://bmoils.in"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Routes
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);
// Test route
app.get("/", (_req, res) => {
  res.send("BM Oils Backend is running!");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://sriramravichandran7_db_user:Sriram%23023@internal-management.lih7pql.mongodb.net/Internal-management?retryWrites=true&w=majority&appName=Internal-management";

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
