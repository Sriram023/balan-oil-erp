import Manufacturer from "../models/Manufacturer.js"; // ✅ Correct ESM import
import { Request, Response } from "express";

// Get all manufacturers
export const getManufacturers = async (_req: Request, res: Response) => {
  try {
    const manufacturers = await Manufacturer.find();
    res.json(manufacturers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new manufacturer
export const addManufacturer = async (req: Request, res: Response) => {
  try {
    const { name, creditGiven, paidAmount } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newManufacturer = new Manufacturer({
      name,
      creditGiven: creditGiven || 0,
      paidAmount: paidAmount || 0,
    });

    const saved = await newManufacturer.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
