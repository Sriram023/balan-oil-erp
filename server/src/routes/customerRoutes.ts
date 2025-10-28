import express from "express";
import { getCustomers, addCustomer } from "../controllers/customerController.js";
import Customer from "../models/Customer.js";

const router = express.Router();

router.get("/", getCustomers);
router.post("/", addCustomer);

// Add Credit
router.post("/:id/add-credit", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    let { amount } = req.body;
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    customer.creditGiven += amount;
    customer.creditHistory.push({ amount, date: new Date().toISOString() });
    await customer.save();

    res.json(customer);
  } catch (err) {
    console.error("Credit update error:", err);
    res.status(500).json({ error: "Failed to add credit" });
  }
});

// Add Payment
router.post("/:id/add-payment", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    let { amount } = req.body;
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    customer.paidAmount += amount;
    customer.paymentHistory.push({ amount, date: new Date().toISOString() });
    await customer.save();

    res.json(customer);
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

// Add Product
/* router.post("/:id/add-product", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const { name, quantity, rate, total, date } = req.body;
    customer.products.push({ name, quantity, rate, total, date });
    await customer.save();

    res.json(customer);
  } catch (err) {
    console.error("Product add error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
}); */
router.post("/:id/add-product", async (req, res) => {
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

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    if (!customer.products) customer.products = []; // ensure array exists
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

export default router;
