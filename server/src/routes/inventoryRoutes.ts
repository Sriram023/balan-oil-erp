import express from "express";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

const router = express.Router();

/* ---------------- GET ALL PRODUCTS ---------------- */
router.get("/product", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ---------------- BARCODE SCAN ---------------- */
/*
  type: IN | OUT | ADJUST
  reason: PURCHASE | SALE | RETURN | DAMAGE
*/
router.post("/scan", async (req, res) => {
  try {
    const { barcode, quantity, type, reason, note } = req.body;

    if (!barcode || !quantity || !type || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await Product.findOne({ barcode });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (type === "OUT" && product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Update stock
    if (type === "IN") product.stock += quantity;
    if (type === "OUT") product.stock -= quantity;

    await product.save();

    const transaction = await InventoryTransaction.create({
      productId: product._id,
      barcode: product.barcode,
      quantity,
      type,
      reason,
      note,
      performedBy: "ADMIN",
    });

    res.json({
      message: "✅ Inventory updated",
      product,
      transaction,
    });
  } catch (err) {
    console.error("Inventory scan error:", err);
    res.status(500).json({ error: "Inventory scan failed" });
  }
});
// Get all products with stock
router.get("/products", async (_req, res) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get inventory transactions
router.get("/transactions", async (_req, res) => {
  try {
    const txns = await InventoryTransaction.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory history" });
  }
});
export default router;
