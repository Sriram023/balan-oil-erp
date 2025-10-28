import express from "express";
import {
  getManufacturers,
  addManufacturer,
} from "../controllers/manufacturerController.js";
import Manufacturer from "../models/Manufacturer.js";

const router = express.Router();

router.get("/", getManufacturers);
router.post("/", addManufacturer);

// ✅ Add these two new routes
router.post("/:id/add-credit", async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) return res.status(404).json({ error: "Manufacturer not found" });

    let { amount } = req.body;
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Safely default values if they are undefined
    manufacturer.creditGiven = Number(manufacturer.creditGiven) || 0;
    manufacturer.paidAmount = Number(manufacturer.paidAmount) || 0;

    manufacturer.creditGiven += amount;
    manufacturer.creditHistory.push({ amount, date: new Date().toISOString() });
    await manufacturer.save();

    res.json(manufacturer);
  } catch (err) {
    console.error("Credit update error:", err);
    res.status(500).json({ error: "Failed to add credit" });
  }
});

router.post("/:id/add-payment", async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) return res.status(404).json({ error: "Manufacturer not found" });

    let { amount } = req.body;
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Safely default values if they are undefined
    manufacturer.creditGiven = Number(manufacturer.creditGiven) || 0;
    manufacturer.paidAmount = Number(manufacturer.paidAmount) || 0;

    manufacturer.paidAmount += amount;
    manufacturer.paymentHistory.push({ amount, date: new Date().toISOString() });
    await manufacturer.save();

    res.json(manufacturer);
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: "Failed to add payment" });
  }
});
router.post("/:id/add-product", async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer) return res.status(404).json({ error: "Manufacturer not found" });

    const product = req.body;
    if (!product?.name || !product?.quantity || !product?.rate) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    // ✅ Ensure manufacturer has a products array
    // ✅ Fix for Mongoose DocumentArray typing
       if (!Array.isArray(manufacturer.products)) {
         (manufacturer as any).products = []; // bypass TS inference safely
}

       (manufacturer.products as any).push(product);
       await manufacturer.save();


    res.json(manufacturer);
  } catch (err) {
    console.error("Product add error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});
// ✅ Fetch a single manufacturer by ID (with products)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate if the ID looks like a proper ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid manufacturer ID format" });
    }

    const manufacturer = await Manufacturer.findById(id);
    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    res.json(manufacturer);
  } catch (err) {
    console.error("Error fetching manufacturer:", err);
    res.status(500).json({ error: "Failed to fetch manufacturer" });
  }
});




export default router;
