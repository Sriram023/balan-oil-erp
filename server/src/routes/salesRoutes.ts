import express from "express";
import Sale from "../models/sales";

const router = express.Router();

router.get("/", async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: -1 });
  res.json(sales);
});

router.post("/", async (req, res) => {
  const { productName, quantity, price, date } = req.body;
  const total = quantity * price;
  const sale = new Sale({ productName, quantity, price, total, date });
  await sale.save();
  res.status(201).json(sale);
});

export default router;
