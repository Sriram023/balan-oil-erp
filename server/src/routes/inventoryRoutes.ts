import express from "express";
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

const router = express.Router();

/**
 * Scan barcode and update stock
 * type = "IN" | "OUT"
 */
router.post("/scan", async (req, res) => {
  try {
    const { barcode, quantity, type, note } = req.body;

    if (!barcode || !quantity || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const product = await Product.findOne({ barcode });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (type === "OUT" && product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // 🔁 Update stock
    product.stock += type === "IN" ? quantity : -quantity;
    await product.save();

    // 🧾 Log transaction
    await InventoryTransaction.create({
      productId: product._id,
      barcode: product.barcode,
      quantity,
      type,
      stockAfter: product.stock,
      note,
    });

    res.json({
      message: "Stock updated successfully",
      product,
    });
  } catch (err) {
    console.error("Inventory scan error:", err);
    res.status(500).json({ error: "Inventory scan failed" });
  }
});

export default router;
