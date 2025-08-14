const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  reportType: { type: String, enum: ['pdf', 'excel'], required: true },
  fileName: { type: String, required: true },
  pdfUrl: String,
  emailSent: { type: Boolean, default: false },
  sentToEmail: String,
  createdAt: { type: Date, default: Date.now },
  fileSize: Number,
  status: { type: String, enum: ['generating', 'completed', 'failed'], default: 'generating' }
});

module.exports = mongoose.models.Report || mongoose.model("Report", reportSchema);