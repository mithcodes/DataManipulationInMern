import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/save-products", async (req, res) => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error(`Fake Store API request failed with status ${response.status}`);
    }

    const data = await response.json();

    await Product.insertMany(data);

    res.json({ message: "Data saved in MongoDB successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-products", async (req, res) => {
  try {
    // DB se data nikal rahe
    const products = await Product.find();

    // response bhej rahe
    res.json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
