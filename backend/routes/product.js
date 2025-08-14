const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

// Get all products
router.get("/products", async (req, res) => {
  try {
    const userId = req.query.userId;
    const query = userId ? { userId } : {};
    const products = await Product.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new product
router.post("/products", async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a product
router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    // TODO: Implement Cloudinary deletion here
    // You'll need to add cloudinary deletion logic
    // const cloudinary = require('cloudinary').v2;
    // if (product.imageUrl) {
    //   const publicId = extractPublicIdFromUrl(product.imageUrl);
    //   await cloudinary.uploader.destroy(publicId);
    // }
    
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
