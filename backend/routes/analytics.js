const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const Report = require("../models/reportModel");
const User = require("../models/userModel");

// Get analytics data for a user
router.get("/analytics/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's products
    const products = await Product.find({ userId }).sort({ createdAt: -1 });
    
    // Calculate analytics
    const totalProducts = products.length;
    const companiesCount = [...new Set(products.map(p => p.companyName))].length;
    
    // Products by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const productsByMonth = await Product.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId), createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Products by company
    const productsByCompany = await Product.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: "$companyName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent activity
    const recentProducts = products.slice(0, 5);

    // Export history
    const exportHistory = await Report.find({ userId }).sort({ createdAt: -1 }).limit(10);

    res.json({
      totalProducts,
      companiesCount,
      productsByMonth,
      productsByCompany,
      recentProducts,
      exportHistory,
      growthRate: calculateGrowthRate(products)
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

function calculateGrowthRate(products) {
  const thisMonth = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const thisMonthCount = products.filter(p => 
    p.createdAt.getMonth() === thisMonth.getMonth() && 
    p.createdAt.getFullYear() === thisMonth.getFullYear()
  ).length;
  
  const lastMonthCount = products.filter(p => 
    p.createdAt.getMonth() === lastMonth.getMonth() && 
    p.createdAt.getFullYear() === lastMonth.getFullYear()
  ).length;
  
  if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
  return ((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(1);
}

module.exports = router;