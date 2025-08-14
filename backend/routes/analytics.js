const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");

// Get analytics data for a user
router.get("/analytics/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Verify user exists
    const userExists = await User.exists({ _id: objectId });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's products
    const products = await Product.find({ userId: objectId }).sort({
      createdAt: -1,
    });

    // Handle case when user has no products
    if (products.length === 0) {
      return res.json({
        totalProducts: 0,
        companiesCount: 0,
        productsByMonth: [],
        productsByCompany: [],
        recentProducts: [],
        exportHistory: [],
        growthRate: 0,
      });
    }

    // Calculate analytics
    const totalProducts = products.length;
    const companiesCount = [...new Set(products.map((p) => p.companyName))]
      .length;

    // Products by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const productsByMonth = await Product.aggregate([
      { $match: { userId: objectId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Products by company
    const productsByCompany = await Product.aggregate([
      { $match: { userId: objectId } },
      { $group: { _id: "$companyName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Recent activity
    const recentProducts = products.slice(0, 5);

    // Export history
    const exportHistory = await Report.find({ userId: objectId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Return analytics data
    res.json({
      totalProducts,
      companiesCount,
      productsByMonth,
      productsByCompany,
      recentProducts,
      exportHistory,
      growthRate: calculateGrowthRate(products),
    });
  } catch (err) {
    console.error("Analytics error:", {
      endpoint: "/analytics/" + userId,
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const statusCode = err.message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
});

// Helper function to calculate growth rate
function calculateGrowthRate(products) {
  const thisMonth = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const thisMonthCount = products.filter(
    (p) =>
      p.createdAt.getMonth() === thisMonth.getMonth() &&
      p.createdAt.getFullYear() === thisMonth.getFullYear()
  ).length;

  const lastMonthCount = products.filter(
    (p) =>
      p.createdAt.getMonth() === lastMonth.getMonth() &&
      p.createdAt.getFullYear() === lastMonth.getFullYear()
  ).length;

  if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
  return (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(
    1
  );
}

module.exports = router;
