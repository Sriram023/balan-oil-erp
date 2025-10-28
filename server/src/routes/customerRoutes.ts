import express, { Request, Response } from "express";
import { getCustomers, addCustomer } from "../controllers/customerController";
import Customer from "../models/customer";

const router = express.Router();

router.get("/", getCustomers);
router.post("/", addCustomer);

// Add Credit
router.post("/:id/add-credit", async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const { amount } = req.body;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    customer.creditGiven += numAmount;
    customer.creditHistory.push({ amount: numAmount, date: new Date().toISOString() });
    await customer.save();

    res.json(customer);
  } catch (err) {
    console.error("Credit update error:", err);
    res.status(500).json({ error: "Failed to add credit" });
  }
});

// Add Payment
router.post("/:id/add-payment", async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const { amount } = req.body;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    customer.paidAmount += numAmount;
    customer.paymentHistory.push({ amount: numAmount, date: new Date().toISOString() });
    await customer.save();

    res.json(customer);
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

// Add Product
router.post("/:id/add-product", async (req: Request, res: Response) => {
  try {
    const { name, quantity, rate, total, date } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    customer.products.push({
      name,
      quantity,
      rate,
      total,
      date: date || new Date().toLocaleDateString(),
    });

    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get specific customer (details page)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    if (!customer.products) customer.products = [];
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

export default router;
