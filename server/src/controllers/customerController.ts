import Customer from "../models/Customer.js";

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const { name, creditGiven, paidAmount } = req.body;
    const newCustomer = new Customer({
      name,
      creditGiven,
      paidAmount,
      balance: creditGiven - paidAmount,
      paymentHistory: [],
      creditHistory: [],
      products: [],
    });
    await newCustomer.save();
    res.json(newCustomer);
  } catch (err) {
    console.error("Error saving customer:", err);
    res.status(500).json({ error: "Failed to save customer" });
  }
};
