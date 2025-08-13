const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  companyName: { type: String, default: "xyz" },
  attributes: Object, // For dynamic/conditional form fields
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
