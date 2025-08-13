const express = require("express");
const router = express.Router();
const Report = require("../models/reportModel");

// Create a new report (placeholder for PDF logic)
router.post("/api/reports", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;